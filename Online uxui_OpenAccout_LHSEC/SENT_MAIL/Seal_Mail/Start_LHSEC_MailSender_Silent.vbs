' VBScript Launcher to run LHSEC Mail Dispatcher silently in background
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Open Browser
WshShell.Run "http://localhost:8088", 1, False

' Run Server silently
psCmd = "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & scriptDir & "\server.ps1"""
WshShell.Run psCmd, 0, False
