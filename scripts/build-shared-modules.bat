@echo off
echo ========================================
echo Building Shared Modules
echo ========================================

cd ..

echo [1/3] Building common-dto...
cd shared\common-dto
call mvn clean install -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [2/3] Building event-schemas...
cd shared\event-schemas
call mvn clean install -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [3/3] Building utilities...
cd shared\utilities
call mvn clean install -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo ========================================
echo All shared modules built successfully!
echo ========================================
pause
