@echo off
REM Script to run the onboarding migration on the database
REM This will add the temp_onboarding_data column to the users table

echo ================================================
echo  Running Onboarding Migration
echo ================================================
echo.

REM Get database credentials from .env or use defaults
set DB_NAME=ecom_db
set DB_USER=root

echo Database: %DB_NAME%
echo User: %DB_USER%
echo.

REM Prompt for password
set /p DB_PASSWORD="Enter MySQL password for user %DB_USER%: "

echo.
echo Running migration...
echo.

REM Run the SQL file
mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < add-temp-onboarding-data-column.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo  Migration completed successfully!
    echo ================================================
    echo.
    echo The temp_onboarding_data column has been added to the users table.
    echo You can now start the backend server and test the onboarding feature.
) else (
    echo.
    echo ================================================
    echo  Migration failed!
    echo ================================================
    echo.
    echo Please check:
    echo 1. MySQL service is running
    echo 2. Database credentials are correct
    echo 3. Database ecommerce_db exists
)

echo.
pause
