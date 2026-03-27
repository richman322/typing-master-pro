@echo off
cls
echo ===================================================
echo   TYPING MASTER PRO - ULTRA FORCE DEPLOYER
echo ===================================================
echo.

:: Check for Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed! 
    echo Please install it from: https://git-scm.com/
    pause
    exit /b
)

echo [1/5] Cleaning old files...
if exist dist rd /s /q dist
if exist node_modules/.cache rd /s /q node_modules/.cache

echo.
echo [2/5] Installing dependencies (Please wait)...
call npm install --silent

echo.
echo [3/5] Building the application...
call npm run build

if not exist dist (
    echo [ERROR] Build failed! The 'dist' folder was not created.
    pause
    exit /b
)

echo.
echo [4/5] Preparing Git...
git init
git add .
git commit -m "Force deploy update" 2>nul

echo.
echo ---------------------------------------------------
echo  PASTE YOUR GITHUB REPOSITORY URL BELOW
echo  Example: https://github.com/yourname/typing-master-pro.git
echo ---------------------------------------------------
set /p repo_url="URL: "

:: Remove existing remote if it exists
git remote remove origin 2>nul
git remote add origin %repo_url%
git branch -M main

echo.
echo [5/5] Deploying to GitHub Pages...
call npm run deploy

echo.
echo ===================================================
echo   SUCCESS! YOUR APP IS NOW PUBLIC.
echo ===================================================
echo Link: %repo_url:git=io%
echo (Note: Replace 'github.com' with 'yourusername.github.io' in your head)
echo.
pause
