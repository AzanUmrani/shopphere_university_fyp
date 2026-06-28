@echo off
setlocal enabledelayedexpansion

echo ========================================
echo AUTOMATIC DATABASE RECOVERY WIZARD
echo ========================================
echo.

REM Check if Laragon data exists
echo [Step 1/5] Checking for Laragon MySQL data...
if exist "C:\laragon\data\mysql\ecom_db" (
    echo ✓ FOUND: Laragon database at C:\laragon\data\mysql\ecom_db
    set LARAGON_EXISTS=1
    echo.
    echo YOUR DATA IS SAFE! We can recover it.
    echo.
    goto recovery_options
) else (
    echo ✗ Laragon database not found at default location
    set LARAGON_EXISTS=0
    goto check_alternative
)

:check_alternative
echo.
echo [Step 2/5] Checking alternative Laragon locations...
if exist "C:\laragon\bin\mysql" (
    echo ✓ Found Laragon MySQL installation
    echo Searching for database folders...
    dir "C:\laragon\bin\mysql" /s /b /a:d | findstr "data"
) else (
    echo ✗ Laragon not found
)
echo.
goto create_new

:recovery_options
echo Options:
echo 1. Copy Laragon database to new MySQL (Recommended)
echo 2. Use Laragon MySQL instead (Keep using old setup)
echo 3. Export and import database
echo.
set /p recovery_choice="Choose option (1-3): "

if "%recovery_choice%"=="1" goto copy_database
if "%recovery_choice%"=="2" goto use_laragon
if "%recovery_choice%"=="3" goto export_import
goto recovery_options

:copy_database
echo.
echo [Step 3/5] Finding new MySQL data directory...
for /f "tokens=2 delims==" %%I in ('mysql --help ^| findstr "datadir"') do set MYSQL_DIR=%%I
set MYSQL_DIR=%MYSQL_DIR: =%
echo MySQL data directory: %MYSQL_DIR%
echo.
echo Stopping MySQL service...
net stop MySQL 2>nul
timeout /t 2 >nul
echo.
echo Copying database folder...
xcopy "C:\laragon\data\mysql\ecom_db" "%MYSQL_DIR%ecom_db\" /E /I /Y
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database copied successfully!
) else (
    echo ✗ Copy failed. May need administrator privileges.
    echo Right-click Command Prompt and "Run as Administrator"
    pause
    exit /b 1
)
echo.
echo Starting MySQL service...
net start MySQL
echo.
echo ✓ Database recovery complete!
goto verify_database

:use_laragon
echo.
echo [Step 3/5] Setting up Laragon MySQL...
echo.
echo Update your .env file with:
echo DB_HOST=localhost
echo DB_PORT=3307
echo DB_USER=root
echo DB_PASS=
echo DB_NAME=ecom_db
echo.
echo Then start Laragon and click "Database" - "MySQL"
pause
goto end

:export_import
echo.
echo [Step 3/5] Exporting database from Laragon...
if not exist "C:\laragon\bin\mysql" (
    echo ✗ Cannot find Laragon MySQL binaries
    goto create_new
)
cd /d "C:\laragon\bin\mysql\mysql-8.0.30\bin"
mysqldump -u root -p --port=3307 ecom_db > "%~dp0ecom_backup.sql"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Export successful: ecom_backup.sql
    echo.
    echo [Step 4/5] Importing to new MySQL...
    mysql -u root -p ecom_db < "%~dp0ecom_backup.sql"
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Import successful!
        goto verify_database
    )
)
echo ✗ Export/Import failed
pause
goto create_new

:create_new
echo.
echo ========================================
echo CREATING NEW DATABASE FROM SCRATCH
echo ========================================
echo.
echo [Step 3/5] Creating database...
cd /d "%~dp0"
mysql -u root -p < create-database.sql
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created
) else (
    echo ✗ Failed to create database
    echo.
    echo Manual steps required:
    echo 1. Open Command Prompt
    echo 2. Run: mysql -u root -p
    echo 3. Execute: CREATE DATABASE ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    pause
    exit /b 1
)
echo.
echo [Step 4/5] Creating tables from models...
call npm run db:setup
goto verify_database

:verify_database
echo.
echo [Step 5/5] Verifying database...
mysql -u root -p -e "USE ecom_db; SHOW TABLES;"
echo.
echo ✓ RECOVERY COMPLETE!
echo.
echo Next steps:
echo 1. Start your backend: npm run dev
echo 2. Check for any errors
echo 3. Setup daily backups (see backup.bat)
echo.
goto end

:end
echo.
pause
exit