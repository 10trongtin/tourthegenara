@echo off
title Solia Deployer - Cloudflare Pages
color 0A

echo ==========================================================
echo  SOLIA VIRTUAL TOUR DEPLOYMENT SYSTEM
echo ==========================================================
echo  [INFO] Bat dau upload cac file thay doi len Cloudflare...
echo  [INFO] He thong se tu dong quet va CHI upload file moi (HTML/JS/CSS).
echo  [INFO] Cac file anh panos cu se duoc giu nguyen tren server.
echo ==========================================================
echo.

call npx wrangler pages deploy .

echo.
echo ==========================================================
echo  [SUCCESS] Cap nhat thanh cong giao dien len Cloudflare!
echo ==========================================================
pause
