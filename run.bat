@echo off
title Sistema RAEE Spring Boot
if "%JAVA_HOME%"=="" set JAVA_HOME=C:\Users\baranda2\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%

echo ===================================================
echo   Sistema de Gestion de Residuos Electronicos RAEE
echo   UPN - Soluciones Web y Aplicaciones Distribuidas
echo ===================================================
echo Verificando conexion MySQL (puerto 3306)...

powershell -Command "if ((Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue)) { exit 0 } else { exit 1 }"
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL detectado en puerto 3306. Iniciando con base de datos MySQL (raee_db)...
    call mvnw.cmd spring-boot:run
) else (
    echo [AVISO] MySQL no detectado en el puerto 3306.
    echo Iniciando con perfil 'h2' (Base de datos en memoria modo MySQL) para permitir pruebas inmediatas...
    call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
)
pause
