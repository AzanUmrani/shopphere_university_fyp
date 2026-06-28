@echo off
REM Verify that the migration was successful
REM This script checks if temp_onboarding_data column exists in users table

echo ================================================
echo  Checking Migration Status
echo ================================================
echo.

set DB_NAME=ecom_db
set DB_USER=root

echo Checking if temp_onboarding_data column exists in users table...
echo.

REM Prompt for password
set /p DB_PASSWORD="Enter MySQL password for user %DB_USER%: "

echo.

REM Check if column exists
mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% -e "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='ecom_db' AND TABLE_NAME='users' AND COLUMN_NAME='temp_onboarding_data';"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo  Column check complete!
    echo ================================================
    echo.
    echo If you see 'temp_onboarding_data' and 'json' above,
    echo the migration was SUCCESSFUL!
    echo.
    echo You can now restart your backend server.
) else (
    echo.
    echo ================================================
    echo  Could not verify column
    echo ================================================
    echo.
    echo Please check your database connection.
)

echo.
pause
