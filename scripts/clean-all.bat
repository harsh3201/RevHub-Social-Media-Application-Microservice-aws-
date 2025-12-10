@echo off
echo ========================================
echo Cleaning All Build Artifacts
echo ========================================

cd ..

echo Cleaning backend services...
for /d %%d in (backend-services\*) do (
    if exist "%%d\target" (
        echo Cleaning %%d...
        rmdir /s /q "%%d\target"
    )
)

echo Cleaning shared modules...
for /d %%d in (shared\*) do (
    if exist "%%d\target" (
        echo Cleaning %%d...
        rmdir /s /q "%%d\target"
    )
)

echo Cleaning frontend services...
for /d %%d in (frontend-services\*) do (
    if exist "%%d\node_modules" (
        echo Cleaning %%d...
        rmdir /s /q "%%d\node_modules"
    )
    if exist "%%d\dist" (
        rmdir /s /q "%%d\dist"
    )
)

echo ========================================
echo All build artifacts cleaned!
echo ========================================
pause
