@echo off
echo ============================================
echo DATABASE RECOVERY & SETUP TOOL
echo ============================================
echo.

:menu
echo.
echo Choose an option:
echo.
echo 1. Check if database exists
echo 2. Create new database
echo 3. Setup tables (auto-create from models)
echo 4. Backup database
echo 5. Find MySQL data directory
echo 6. Find Laragon data directory
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto check_db
if "%choice%"=="2" goto create_db
if "%choice%"=="3" goto setup_tables
if "%choice%"=="4" goto backup_db
if "%choice%"=="5" goto find_mysql
if "%choice%"=="6" goto find_laragon
if "%choice%"=="7" goto end
goto menu

:check_db
echo.
echo Checking for database...
mysql -u root -p -e "SHOW DATABASES LIKE 'ecom_db';"
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Checking tables...
    mysql -u root -p ecom_db -e "SHOW TABLES;"
)
pause
goto menu

:create_db
echo.
echo Creating database from SQL file...
mysql -u root -p < create-database.sql
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created successfully!
) else (
    echo ✗ Failed to create database
)
pause
goto menu

:setup_tables
echo.
echo Auto-creating tables from Sequelize models...
cd /d "%~dp0"
call npm run db:setup
pause
goto menu

:backup_db
echo.
set /p backup_name="Enter backup filename (without extension): "
echo Creating backup...
mysqldump -u root -p ecom_db > backups\%backup_name%.sql
if %ERRORLEVEL% EQU 0 (
    echo ✓ Backup created: backups\%backup_name%.sql
) else (
    echo ✗ Backup failed
    if not exist "backups" mkdir backups
    echo Try again after creating backups folder
)
pause
goto menu

:find_mysql
echo.
echo Finding MySQL data directory...
mysql --help | findstr "datadir"
echo.
echo Common locations:
echo - C:\ProgramData\MySQL\MySQL Server 8.0\Data\
echo - C:\Program Files\MySQL\MySQL Server 8.0\data\
echo - C:\MySQL\data\
pause
goto menu

:find_laragon
echo.
echo Checking for Laragon MySQL data...
if exist "C:\laragon\data\mysql" (
    echo ✓ Found Laragon data at: C:\laragon\data\mysql
    dir "C:\laragon\data\mysql" /A:D
) else (
    echo ✗ Laragon data not found at default location
    echo Try checking:
    echo - C:\laragon\bin\mysql\mysql-8.0.30\data\
    echo - Your custom Laragon installation path
)
pause
goto menu

:end
echo.
echo Exiting...
exit