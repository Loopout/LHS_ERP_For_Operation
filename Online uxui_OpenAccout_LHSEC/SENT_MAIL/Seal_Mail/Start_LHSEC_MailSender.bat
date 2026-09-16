@echo off
chcp 65001 >nul
title LHSEC Mutual Fund Allocation Email Dispatcher (Pure Web Standalone)
cd /d "%~dp0"

echo ======================================================================
echo   LHSEC Mutual Fund Allocation Email Dispatcher (ระบบส่งอีเมลจัดสรรหน่วย)
echo   ฝ่ายปฏิบัติการหลักทรัพย์ บริษัทหลักทรัพย์ แลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน)
echo   [รูปแบบ Pure Web Standalone 100% - ไม่ใช้ PowerShell]
echo ======================================================================
echo.
echo  กำลังเปิดหน้าต่างระบบบนเว็บเบราว์เซอร์...
echo.

start "" "%~dp0web\index.html"

exit
