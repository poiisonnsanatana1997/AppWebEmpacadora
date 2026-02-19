#Requires -Version 5.1
<#
.SYNOPSIS
    Script de despliegue automatizado para AppWebEmpacadora en IIS

.DESCRIPTION
    Este script automatiza el proceso de construcción y despliegue de la aplicación
    React en un servidor IIS Windows.

.PARAMETER Environment
    Entorno de despliegue: development, staging, o production (default: production)

.PARAMETER ServerPath
    Ruta en el servidor donde se desplegará la aplicación (default: C:\inetpub\wwwroot\empacadora)

.PARAMETER CreateBackup
    Crear backup de la versión actual antes de desplegar (default: $true)

.PARAMETER SkipBuild
    Omitir el paso de construcción y usar el contenido actual de dist/ (default: $false)

.PARAMETER AppPoolName
    Nombre del Application Pool en IIS (default: EmpacadoraAppPool)

.EXAMPLE
    .\deploy-iis.ps1 -Environment production
    Despliega a producción con configuración por defecto

.EXAMPLE
    .\deploy-iis.ps1 -Environment staging -ServerPath "C:\inetpub\wwwroot\empacadora-staging"
    Despliega a staging en una ruta personalizada

.EXAMPLE
    .\deploy-iis.ps1 -SkipBuild -CreateBackup $false
    Despliega sin construir nuevamente y sin crear backup
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'production',

    [Parameter(Mandatory=$false)]
    [string]$ServerPath = 'C:\inetpub\wwwroot\empacadora',

    [Parameter(Mandatory=$false)]
    [bool]$CreateBackup = $true,

    [Parameter(Mandatory=$false)]
    [bool]$SkipBuild = $false,

    [Parameter(Mandatory=$false)]
    [string]$AppPoolName = 'EmpacadoraAppPool'
)

# Variables
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$DistPath = Join-Path $ScriptPath "dist"
$BackupPath = Join-Path (Split-Path $ServerPath -Parent) "empacadora.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Colores para output
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        [Parameter(Mandatory=$false)]
        [ValidateSet('Success', 'Info', 'Warning', 'Error')]
        [string]$Type = 'Info'
    )

    switch ($Type) {
        'Success' { Write-Host "✓ $Message" -ForegroundColor Green }
        'Info'    { Write-Host "ℹ $Message" -ForegroundColor Cyan }
        'Warning' { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        'Error'   { Write-Host "✗ $Message" -ForegroundColor Red }
    }
}

# Banner
Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DESPLIEGUE DE APPWEBEMPACADORA A IIS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-ColorOutput "Entorno: $Environment" -Type Info
Write-ColorOutput "Ruta de despliegue: $ServerPath" -Type Info
Write-ColorOutput "Backup: $CreateBackup" -Type Info
Write-ColorOutput "Omitir build: $SkipBuild`n" -Type Info

# Verificar si se está ejecutando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-ColorOutput "Este script requiere permisos de administrador para configurar IIS." -Type Warning
    Write-ColorOutput "Continuando sin permisos de administrador (solo se copiarán archivos)...`n" -Type Warning
}

# Paso 1: Construcción de la aplicación
if (-not $SkipBuild) {
    Write-ColorOutput "PASO 1: Construyendo aplicación para $Environment..." -Type Info

    # Verificar que package.json existe
    if (-not (Test-Path (Join-Path $ScriptPath "package.json"))) {
        Write-ColorOutput "No se encontró package.json en $ScriptPath" -Type Error
        exit 1
    }

    # Construir según el entorno
    $buildCommand = switch ($Environment) {
        'development' { 'npm run build:dev' }
        'staging'     { 'npm run build:staging' }
        'production'  { 'npm run build:prod' }
    }

    Write-ColorOutput "Ejecutando: $buildCommand" -Type Info
    try {
        Invoke-Expression $buildCommand
        if ($LASTEXITCODE -ne 0) {
            throw "Error en la construcción"
        }
        Write-ColorOutput "Construcción completada exitosamente`n" -Type Success
    }
    catch {
        Write-ColorOutput "Error al construir la aplicación: $_" -Type Error
        exit 1
    }
}
else {
    Write-ColorOutput "PASO 1: Omitiendo construcción (usando dist/ existente)`n" -Type Warning
}

# Verificar que existe la carpeta dist
if (-not (Test-Path $DistPath)) {
    Write-ColorOutput "No se encontró la carpeta dist en $DistPath" -Type Error
    Write-ColorOutput "Ejecuta 'npm run build:prod' primero o quita el parámetro -SkipBuild" -Type Info
    exit 1
}

# Paso 2: Crear backup si está habilitado
if ($CreateBackup -and (Test-Path $ServerPath)) {
    Write-ColorOutput "PASO 2: Creando backup de la versión actual..." -Type Info
    try {
        Copy-Item -Path $ServerPath -Destination $BackupPath -Recurse -Force
        Write-ColorOutput "Backup creado en: $BackupPath`n" -Type Success
    }
    catch {
        Write-ColorOutput "Advertencia: No se pudo crear el backup: $_" -Type Warning
        Write-ColorOutput "Continuando con el despliegue...`n" -Type Warning
    }
}
else {
    Write-ColorOutput "PASO 2: Omitiendo backup`n" -Type Info
}

# Paso 3: Detener Application Pool (si se tiene permisos)
if ($isAdmin) {
    Write-ColorOutput "PASO 3: Deteniendo Application Pool '$AppPoolName'..." -Type Info
    try {
        Import-Module WebAdministration -ErrorAction Stop
        $appPoolExists = Test-Path "IIS:\AppPools\$AppPoolName"

        if ($appPoolExists) {
            $appPoolState = Get-WebAppPoolState -Name $AppPoolName
            if ($appPoolState.Value -eq 'Started') {
                Stop-WebAppPool -Name $AppPoolName
                Write-ColorOutput "Application Pool detenido`n" -Type Success

                # Esperar a que el pool se detenga completamente
                $timeout = 30
                $elapsed = 0
                while ((Get-WebAppPoolState -Name $AppPoolName).Value -ne 'Stopped' -and $elapsed -lt $timeout) {
                    Start-Sleep -Seconds 1
                    $elapsed++
                }
            }
            else {
                Write-ColorOutput "Application Pool ya estaba detenido`n" -Type Info
            }
        }
        else {
            Write-ColorOutput "Application Pool '$AppPoolName' no existe (se creará después)`n" -Type Warning
        }
    }
    catch {
        Write-ColorOutput "Advertencia: No se pudo detener el Application Pool: $_" -Type Warning
        Write-ColorOutput "Continuando...`n" -Type Warning
    }
}
else {
    Write-ColorOutput "PASO 3: Omitiendo detención de Application Pool (requiere admin)`n" -Type Warning
}

# Paso 4: Crear carpeta de destino si no existe
if (-not (Test-Path $ServerPath)) {
    Write-ColorOutput "PASO 4: Creando carpeta de destino..." -Type Info
    try {
        New-Item -Path $ServerPath -ItemType Directory -Force | Out-Null
        Write-ColorOutput "Carpeta creada: $ServerPath`n" -Type Success
    }
    catch {
        Write-ColorOutput "Error al crear la carpeta de destino: $_" -Type Error
        exit 1
    }
}
else {
    Write-ColorOutput "PASO 4: La carpeta de destino ya existe`n" -Type Info
}

# Paso 5: Copiar archivos
Write-ColorOutput "PASO 5: Copiando archivos al servidor..." -Type Info
try {
    # Limpiar carpeta de destino (excepto web.config si existe)
    if (Test-Path $ServerPath) {
        Get-ChildItem -Path $ServerPath -Exclude "web.config" | Remove-Item -Recurse -Force
    }

    # Copiar todos los archivos de dist a la carpeta de destino
    Copy-Item -Path "$DistPath\*" -Destination $ServerPath -Recurse -Force

    # Contar archivos copiados
    $fileCount = (Get-ChildItem -Path $ServerPath -Recurse -File | Measure-Object).Count
    Write-ColorOutput "Archivos copiados: $fileCount archivos`n" -Type Success
}
catch {
    Write-ColorOutput "Error al copiar archivos: $_" -Type Error

    # Intentar iniciar el Application Pool aunque haya fallado la copia
    if ($isAdmin -and $appPoolExists) {
        Start-WebAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
    }

    exit 1
}

# Paso 6: Verificar web.config
Write-ColorOutput "PASO 6: Verificando web.config..." -Type Info
$webConfigPath = Join-Path $ServerPath "web.config"
if (Test-Path $webConfigPath) {
    Write-ColorOutput "web.config encontrado en el destino`n" -Type Success
}
else {
    Write-ColorOutput "Advertencia: No se encontró web.config" -Type Warning
    Write-ColorOutput "Asegúrate de que public/web.config exista en tu proyecto`n" -Type Warning
}

# Paso 7: Configurar Application Pool y aplicación en IIS (si se tiene permisos)
if ($isAdmin) {
    Write-ColorOutput "PASO 7: Configurando IIS..." -Type Info
    try {
        Import-Module WebAdministration -ErrorAction Stop

        # Crear Application Pool si no existe
        if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
            Write-ColorOutput "Creando Application Pool '$AppPoolName'..." -Type Info
            New-WebAppPool -Name $AppPoolName
            Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value ''
            Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedPipelineMode -Value 'Integrated'
            Write-ColorOutput "Application Pool creado" -Type Success
        }

        # Crear aplicación si no existe
        $appPath = "IIS:\Sites\Default Web Site\empacadora"
        if (-not (Test-Path $appPath)) {
            Write-ColorOutput "Creando aplicación en IIS..." -Type Info
            New-WebApplication -Name "empacadora" -Site "Default Web Site" -PhysicalPath $ServerPath -ApplicationPool $AppPoolName
            Write-ColorOutput "Aplicación creada en IIS" -Type Success
        }
        else {
            # Actualizar la aplicación existente
            Set-ItemProperty $appPath -Name applicationPool -Value $AppPoolName
            Set-ItemProperty $appPath -Name physicalPath -Value $ServerPath
            Write-ColorOutput "Aplicación actualizada en IIS" -Type Success
        }

        # Configurar permisos
        Write-ColorOutput "Configurando permisos..." -Type Info
        $acl = Get-Acl $ServerPath
        $appPoolIdentity = "IIS AppPool\$AppPoolName"
        $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($appPoolIdentity, "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow")
        $acl.SetAccessRule($accessRule)
        Set-Acl $ServerPath $acl
        Write-ColorOutput "Permisos configurados`n" -Type Success
    }
    catch {
        Write-ColorOutput "Advertencia: Error al configurar IIS: $_" -Type Warning
        Write-ColorOutput "Puede que necesites configurar IIS manualmente`n" -Type Warning
    }
}
else {
    Write-ColorOutput "PASO 7: Omitiendo configuración de IIS (requiere admin)`n" -Type Warning
}

# Paso 8: Iniciar Application Pool
if ($isAdmin) {
    Write-ColorOutput "PASO 8: Iniciando Application Pool..." -Type Info
    try {
        Import-Module WebAdministration -ErrorAction Stop
        if (Test-Path "IIS:\AppPools\$AppPoolName") {
            $appPoolState = Get-WebAppPoolState -Name $AppPoolName
            if ($appPoolState.Value -ne 'Started') {
                Start-WebAppPool -Name $AppPoolName
                Write-ColorOutput "Application Pool iniciado`n" -Type Success
            }
            else {
                Write-ColorOutput "Application Pool ya estaba iniciado`n" -Type Info
            }
        }
    }
    catch {
        Write-ColorOutput "Advertencia: No se pudo iniciar el Application Pool: $_" -Type Warning
        Write-ColorOutput "Inicia el Application Pool manualmente desde IIS Manager`n" -Type Warning
    }
}
else {
    Write-ColorOutput "PASO 8: Omitiendo inicio de Application Pool (requiere admin)`n" -Type Warning
}

# Resumen final
Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  DESPLIEGUE COMPLETADO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Green

Write-ColorOutput "Detalles del despliegue:" -Type Info
Write-ColorOutput "  • Entorno: $Environment" -Type Info
Write-ColorOutput "  • Ruta: $ServerPath" -Type Info
if ($CreateBackup -and (Test-Path $BackupPath)) {
    Write-ColorOutput "  • Backup: $BackupPath" -Type Info
}
Write-ColorOutput "  • Application Pool: $AppPoolName`n" -Type Info

# URLs de acceso
Write-ColorOutput "URLs de acceso:" -Type Info
Write-ColorOutput "  • Local: http://localhost/empacadora/" -Type Info
if ($Environment -eq 'production') {
    Write-ColorOutput "  • Producción: http://18.217.220.233/empacadora/`n" -Type Info
}

Write-ColorOutput "Próximos pasos:" -Type Info
Write-ColorOutput "  1. Verifica que la aplicación carga: http://localhost/empacadora/" -Type Info
Write-ColorOutput "  2. Prueba el routing: http://localhost/empacadora/login" -Type Info
Write-ColorOutput "  3. Revisa la consola del navegador (F12) para errores" -Type Info
Write-ColorOutput "  4. Verifica que las llamadas a la API funcionan correctamente`n" -Type Info

if (-not $isAdmin) {
    Write-ColorOutput "IMPORTANTE: Este script se ejecutó sin permisos de administrador." -Type Warning
    Write-ColorOutput "Necesitarás configurar IIS manualmente o ejecutar el script como administrador.`n" -Type Warning
}

Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
