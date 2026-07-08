@echo off
title Solia Local Dev Server
color 0B

echo ==========================================================
echo  SOLIA VIRTUAL TOUR - LOCAL DEV SERVER
echo ==========================================================
echo  [INFO] Khoi dong server local chay thu nghiem...
echo  [INFO] Truy cap http://localhost:8788 de xem ket qua.
echo ==========================================================
echo.

call npx wrangler pages dev .

pause
