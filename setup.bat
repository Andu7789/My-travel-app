@echo off
REM Quick start script for Travel Photo Web App (Windows)

echo 🌍 Travel Photo Web App - Quick Start
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local file not found
    echo 📋 Copy .env.example to .env.local and add your Supabase credentials:
    echo    copy .env.example .env.local
    echo.
    echo Then edit .env.local with:
    echo    VITE_SUPABASE_URL=https://your-project.supabase.co
    echo    VITE_SUPABASE_ANON_KEY=your-anon-key
    echo.
    set /p PROCEED="Continue without Supabase config? (y/n): "
    if /i not "%PROCEED%"=="y" (
        exit /b 1
    )
)

REM Build check
echo 🔨 Running production build check...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build successful
echo.

REM Success
echo 🚀 Setup complete! Ready to start development:
echo.
echo    npm run dev
echo.
echo App will be available at: http://localhost:5173/My-travel-app/
echo.
echo 📚 Documentation:
echo    - README.md - Project overview
echo    - SETUP.md - Supabase configuration guide
echo    - IMPLEMENTATION_SUMMARY.md - What was built
