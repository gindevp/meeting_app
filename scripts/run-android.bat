@echo off
REM Chay app Expo tren Android (Nox/emulator).
REM Chinh SUA 2 dong duoi cho dung duong dan may ban.

set "ANDROID_HOME=C:\Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"

echo ANDROID_HOME=%ANDROID_HOME%
echo Checking adb...
adb version
if errorlevel 1 (
  echo.
  echo LOI: adb khong chay. Hay:
  echo 1. Tao thu muc C:\Android\Sdk\platform-tools
  echo 2. Giai nen Android Platform-Tools vao C:\Android\Sdk\ (de co C:\Android\Sdk\platform-tools\adb.exe^)
  echo 3. Hoac chinh ANDROID_HOME trong file nay tro den thu muc chua platform-tools
  pause
  exit /b 1
)

echo.
echo Connecting to Nox emulator (127.0.0.1:62001)...
adb connect 127.0.0.1:62001
adb devices
echo.

cd /d "%~dp0.."
npx expo start --android
