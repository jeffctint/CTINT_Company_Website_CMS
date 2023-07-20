@ECHO OFF

title VMIGS Deployment script

echo Select your action:
echo 1. BACKUP VMIGS
echo 2. DEPLOY VMIGS
echo 3. RESTORE VMIGS

choice /C 123 /M "Enter your choice: "

if errorlevel 3 goto restore
if errorlevel 2 goto isIncludeNodeModules
if errorlevel 1 goto backup

:isIncludeNodeModules
set /p "includeNm=Include Node Modules in this deployment (y/n): "
goto isIncludeClientSide

:isIncludeClientSide
set /p "includeClient=Include Client side code in this deployment (y/n): "
goto selectDeployEnv

:backup
echo Confirm action - BACKUP ?
pause
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"

set today=%YYYY%%MM%%DD%%HH%

"C:\Program Files\7-Zip\7z.exe" a "service-%today%-bak.tar" ".\data" ".\service"

move "service-%today%-bak.tar" ".\backup\"

PAUSE
goto end

:selectDeployEnv
echo Select your deploy environment:
echo 1. DEV (192.168.1.80)
echo 2. STG OFFICE SERVER 1 (192.168.10.11)
echo 3. STG OFFICE SERVER 2 (192.168.10.12)
echo 4. PROD LW SERVER 1 (192.168.10.11)
echo 5. PROD LW SERVER 2 (192.168.10.12)
echo 6. DEV GZ (192.168.31.5)

choice /C 123456 /M "Enter your choice: "

if errorlevel 6 call :deployProcess devGz
if errorlevel 5 call :deployProcess prodLwS2
if errorlevel 4 call :deployProcess prodLwS1
if errorlevel 3 call :deployProcess stgS2
if errorlevel 2 call :deployProcess stgS1
if errorlevel 1 call :deployProcess dev


:deployProcess
echo Is include node modules: %includeNm%
echo Is include client side: %includeClient%
echo Deploy Environment: %1
echo Confirm the above config ?
pause
set deployEnv=%1

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"

set today=%YYYY%%MM%%DD%%HH%%Min%

if %includeClient% == y (
	cd ".\client\client-csd-vmigs-cms"
	call npm run build-lib

	cd "..\application-vmigs-cms"
	call npm run build
	
	cd "..\..\"
)

if %includeNm% == y (
	echo "Include node modules"
	xcopy /exclude:deployment_exclude_list.txt ".\service" "..\deployment\vmigs\service" /r /i /s /y
) else (
	echo "Exclude node modules"
	xcopy /exclude:deployment_exclude_list_without_nm.txt ".\service" "..\deployment\vmigs\service" /r /i /s /y 
)

xcopy /exclude:deployment_exclude_list.txt ".\data" "..\deployment\vmigs\data" /r /i /s /y
xcopy ".\vmigs_helper.bat" "..\deployment\vmigs" /r /i /s /y

cd "..\deployment\vmigs"

md ".\service\cms\report\export_file"

if %includeClient% == y (
	xcopy "..\..\development\client\application-vmigs-cms\dist" ".\service\cms\webroot" /r /d /i /s /y
)

if %deployEnv% == dev (
	echo Copying from setting DEV folder
	xcopy "..\..\development\service\setting\vmigs_dev\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_dev\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r  /i /s /y
) else if %deployEnv% == stgS1 (
	echo Copying from setting STG folder
	xcopy "..\..\development\service\setting\vmigs_stg\server1\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_stg\server1\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r /i /s /y
) else if %deployEnv% == stgS2 (
	echo Copying from setting STG folder
	xcopy "..\..\development\service\setting\vmigs_stg\server2\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_stg\server2\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r /i /s /y
) else if %deployEnv% == prodLwS1 (
	echo Copying from setting PROD folder
	xcopy "..\..\development\service\setting\vmigs_prod_lowu\server1\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_prod_lowu\server1\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r /i /s /y
) else if %deployEnv% == prodLwS2 (
	echo Copying from setting PROD folder
	xcopy "..\..\development\service\setting\vmigs_prod_lowu\server2\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_prod_lowu\server2\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r /i /s /y
) else if %deployEnv% == devGz (
	echo Copying from setting DEV GZ folder
	xcopy "..\..\development\service\setting\vmigs_dev_gz\cms\app_vmigs.json" ".\service\cms" /r /i /s /y
	xcopy "..\..\development\service\setting\vmigs_dev_gz\voicecentralhub\app_vmigs.json" ".\service\voicecentralhub" /r /i /s /y
)

"C:\Program Files\7-Zip\7z.exe" a "service-%deployEnv%-%today%.tar" ".\data" ".\service" ".\vmigs_helper.bat"

rmdir /s /Q ".\data"
rmdir /s /Q ".\service" 
del ".\vmigs_helper.bat"

PAUSE
goto end

:restore
cd ".\backup"
dir
:pickFile
set /p TARNAME="Please enter the package name: "

echo Selected package is: %TARNAME%
if exist %TARNAME% (
	echo File exists. Please wait...
	cd "..\"
	"C:\Program Files\7-Zip\7z.exe" a ".\backup\%TARNAME%" -C .
) else (
	echo File do not exist. Please re-reselect
	goto pickFile
)
pause
goto end

:end
exit

