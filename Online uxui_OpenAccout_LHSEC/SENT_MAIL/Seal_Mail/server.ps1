# LHSEC Mutual Fund Allocation Email Dispatcher - Backend Server
# PowerShell HttpListener REST Server & Outlook COM Automation

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$webDir = Join-Path $scriptDir "web"
$draftsDir = Join-Path $scriptDir "drafts"
$contactsFile = Join-Path $scriptDir "marketing_contacts.json"
$logsFile = Join-Path $scriptDir "dispatch_logs.json"

$port = 8088
$prefix = "http://localhost:$port/"

# Ensure folders and logs file exist
if (-not (Test-Path $draftsDir)) {
    New-Item -ItemType Directory -Path $draftsDir | Out-Null
}
if (-not (Test-Path $logsFile)) {
    "[]" | Out-File -FilePath $logsFile -Encoding utf8
}

function Get-MimeType($extension) {
    switch ($extension.ToLower()) {
        ".html" { return "text/html; charset=utf-8" }
        ".htm"  { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "application/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".svg"  { return "image/svg+xml" }
        ".ico"  { return "image/x-icon" }
        ".msg"  { return "application/vnd.ms-outlook" }
        default { return "application/octet-stream" }
    }
}

function Parse-ExcelFile($filePath) {
    if (-not (Test-Path $filePath)) {
        throw "File not found: $filePath"
    }

    $xl = New-Object -ComObject Excel.Application
    $xl.Visible = $false
    $xl.DisplayAlerts = $false
    $wb = $null
    $records = @()
    $headers = @()

    try {
        $wb = $xl.Workbooks.Open($filePath)
        $sheet = $wb.Sheets.Item(1)
        $usedRange = $sheet.UsedRange
        $rows = $usedRange.Rows.Count
        $cols = $usedRange.Columns.Count

        for ($c = 1; $c -le $cols; $c++) {
            $h = ($sheet.Cells.Item(1, $c).Text).Trim()
            if (-not $h) { $h = "Col_$c" }
            $headers += $h
        }

        for ($r = 2; $r -le $rows; $r++) {
            $rowObj = [ordered]@{}
            $hasData = $false
            for ($c = 1; $c -le $cols; $c++) {
                $val = ($sheet.Cells.Item($r, $c).Text).Trim()
                if ($val) { $hasData = $true }
                $rowObj[$headers[$c - 1]] = $val
            }
            if ($hasData) {
                $records += $rowObj
            }
        }
    }
    finally {
        if ($wb) { $wb.Close($false) }
        $xl.Quit()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($xl) | Out-Null
        [GC]::Collect()
        [GC]::WaitForPendingFinalizers()
    }

    return @{
        fileName = [System.IO.Path]::GetFileName($filePath)
        headers = $headers
        records = $records
        totalRows = $records.Count
    }
}

function Dispatch-OutlookMails($mailRequests, $mode) {
    $results = @()
    $ol = $null

    try {
        $ol = New-Object -ComObject Outlook.Application
    } catch {
        throw "Could not connect to Microsoft Outlook: $($_.Exception.Message)"
    }

    foreach ($req in $mailRequests) {
        $res = [ordered]@{
            icLicense = $req.icLicense
            recipientName = $req.recipientName
            to = $req.to
            subject = $req.subject
            status = "PENDING"
            message = ""
            msgUrl = ""
            timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }

        try {
            $mail = $ol.CreateItem(0) # 0 = olMailItem
            $mail.Subject = $req.subject
            $mail.To = $req.to
            if ($req.cc) { $mail.CC = $req.cc }
            if ($req.bcc) { $mail.BCC = $req.bcc }
            
            $mail.HTMLBody = $req.htmlBody

            if ($mode -eq "draft") {
                # 1. Save directly into Outlook Drafts folder
                $mail.Save()

                # 2. Save as .msg file in drafts folder
                $safeName = "Draft_IC_" + $req.icLicense + "_" + (Get-Date).ToString("yyyyMMdd_HHmmss") + ".msg"
                $msgPath = Join-Path $draftsDir $safeName
                $mail.SaveAs($msgPath, 3) # 3 = olMSG
                $res.msgUrl = "/drafts/" + $safeName

                # 3. Launch .msg file directly with Windows Shell (guarantees Outlook window pops up in foreground)
                try {
                    Start-Process -FilePath $msgPath
                } catch {}

                # 4. Also call COM Display and activate
                try {
                    $mail.Display($false)
                    $inspector = $mail.GetInspector
                    if ($inspector) { $inspector.Activate() }
                } catch {}

                # 5. Bring Outlook window to foreground
                try {
                    $wsh = New-Object -ComObject WScript.Shell
                    $wsh.AppActivate("Outlook") | Out-Null
                    $wsh.AppActivate($req.subject) | Out-Null
                } catch {}

                $res.status = "DRAFT_OPENED"
                $res.message = "Draft saved to Outlook Drafts folder and opened"
            } elseif ($mode -eq "save_draft_only") {
                $mail.Save()
                $res.status = "SAVED_TO_DRAFTS"
                $res.message = "Saved to Outlook Drafts folder"
            } elseif ($mode -eq "send") {
                $mail.Send()
                $res.status = "SENT"
                $res.message = "Sent successfully via Outlook"
            } else {
                $mail.Save()
                $mail.Display($false)
                $res.status = "DRAFT_OPENED"
                $res.message = "Draft saved and opened in Outlook"
            }
        } catch {
            $res.status = "ERROR"
            $res.message = "Error: $($_.Exception.Message)"
        }

        $results += $res
    }

    # Save to dispatch log
    try {
        $existingLogs = @()
        if (Test-Path $logsFile) {
            $raw = Get-Content -Raw -Encoding utf8 $logsFile
            if ($raw) { $existingLogs = $raw | ConvertFrom-Json }
        }
        $updatedLogs = @($results) + @($existingLogs)
        if ($updatedLogs.Count -gt 500) { $updatedLogs = $updatedLogs[0..499] }
        $updatedLogs | ConvertTo-Json -Depth 5 | Out-File -FilePath $logsFile -Encoding utf8
    } catch {
        Write-Host "Warning: Could not save dispatch log"
    }

    return $results
}

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host " LHSEC Mutual Fund Allocation Email Dispatcher Server"
    Write-Host " Running on: $prefix"
    Write-Host " Web UI Path: $webDir"
    Write-Host " Press Ctrl+C to stop the server"
    Write-Host "=========================================================="
} catch {
    Write-Error "Failed to start listener on port $port"
    exit 1
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $urlPath = $request.Url.AbsolutePath
        $httpMethod = $request.HttpMethod

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($httpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # Handle API routes
        if ($urlPath.StartsWith("/api/")) {
            $response.ContentType = "application/json; charset=utf-8"
            
            # GET /api/status
            if ($urlPath -eq "/api/status" -and $httpMethod -eq "GET") {
                $outlookOk = $false
                $outlookVersion = ""
                try {
                    $testOl = New-Object -ComObject Outlook.Application
                    $outlookOk = $true
                    $outlookVersion = $testOl.Version
                    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($testOl) | Out-Null
                } catch {}

                $data = @{
                    status = "OK"
                    outlookAvailable = $outlookOk
                    outlookVersion = $outlookVersion
                    workspaceDir = $scriptDir
                    serverTime = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
                $json = $data | ConvertTo-Json -Depth 5
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # GET /api/contacts
            elseif ($urlPath -eq "/api/contacts" -and $httpMethod -eq "GET") {
                $json = "{}"
                if (Test-Path $contactsFile) {
                    $json = Get-Content -Raw -Encoding utf8 $contactsFile
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # POST /api/contacts
            elseif ($urlPath -eq "/api/contacts" -and $httpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()

                $body | Out-File -FilePath $contactsFile -Encoding utf8
                $resp = @{ success = $true; message = "Contacts saved successfully" } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # POST /api/parse-excel-path
            elseif ($urlPath -eq "/api/parse-excel-path" -and $httpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()

                $reqObj = $body | ConvertFrom-Json
                $targetPath = $reqObj.filePath
                if (-not [System.IO.Path]::IsPathRooted($targetPath)) {
                    $targetPath = Join-Path $scriptDir $targetPath
                }

                try {
                    $parseResult = Parse-ExcelFile -filePath $targetPath
                    $resp = @{ success = $true; data = $parseResult } | ConvertTo-Json -Depth 10
                } catch {
                    $resp = @{ success = $false; error = $_.Exception.Message } | ConvertTo-Json
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # POST /api/parse-uploaded-excel
            elseif ($urlPath -eq "/api/parse-uploaded-excel" -and $httpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()

                $reqObj = $body | ConvertFrom-Json
                $fileName = $reqObj.fileName
                $base64Data = $reqObj.base64Content

                $tempPath = Join-Path $scriptDir ("temp_upload_" + [Guid]::NewGuid().ToString().Substring(0,8) + "_" + $fileName)
                $fileBytes = [System.Convert]::FromBase64String($base64Data)
                [System.IO.File]::WriteAllBytes($tempPath, $fileBytes)

                try {
                    $parseResult = Parse-ExcelFile -filePath $tempPath
                    $resp = @{ success = $true; data = $parseResult } | ConvertTo-Json -Depth 10
                } catch {
                    $resp = @{ success = $false; error = $_.Exception.Message } | ConvertTo-Json
                }
                finally {
                    if (Test-Path $tempPath) {
                        Remove-Item -Force $tempPath -ErrorAction SilentlyContinue
                    }
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # POST /api/dispatch-mail
            elseif ($urlPath -eq "/api/dispatch-mail" -and $httpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                $reader.Close()

                $reqObj = $body | ConvertFrom-Json
                $mode = $reqObj.mode
                $mailList = $reqObj.mailList

                try {
                    $dispatchResults = Dispatch-OutlookMails -mailRequests $mailList -mode $mode
                    $resp = @{ success = $true; results = $dispatchResults } | ConvertTo-Json -Depth 5
                } catch {
                    $resp = @{ success = $false; error = $_.Exception.Message } | ConvertTo-Json
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            # GET /api/logs
            elseif ($urlPath -eq "/api/logs" -and $httpMethod -eq "GET") {
                $json = "[]"
                if (Test-Path $logsFile) {
                    $json = Get-Content -Raw -Encoding utf8 $logsFile
                }
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            else {
                $response.StatusCode = 404
                $resp = @{ error = "API Not Found" } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }

            $response.Close()
            continue
        }

        # Serving files from /drafts/
        if ($urlPath.StartsWith("/drafts/")) {
            $draftRelPath = $urlPath.Substring(8).TrimStart('/')
            $draftFullPath = Join-Path $draftsDir $draftRelPath
            if (Test-Path $draftFullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($draftFullPath)
                $response.ContentType = Get-MimeType $ext
                $fileBytes = [System.IO.File]::ReadAllBytes($draftFullPath)
                $response.ContentLength64 = $fileBytes.Length
                $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            } else {
                $response.StatusCode = 404
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>Draft not found</h1>")
                $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
            }
            $response.Close()
            continue
        }

        # Static File Serving from /web
        $localRelPath = $urlPath.TrimStart('/')
        if (-not $localRelPath -or $localRelPath -eq "") {
            $localRelPath = "index.html"
        }
        $localFullPath = Join-Path $webDir $localRelPath

        if (Test-Path $localFullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFullPath)
            $response.ContentType = Get-MimeType $ext
            $fileBytes = [System.IO.File]::ReadAllBytes($localFullPath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found: $urlPath</h1>")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.Close()
    }
    catch {
        Write-Host "Server loop error"
    }
}
