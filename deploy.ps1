# Script de despliegue para AppWebEmpacadora en subcarpeta /empacadora/
param(
    [string]$Environment = "production",
    [string]$DeployPath = "C:\inetpub\wwwroot\empacadora"
)

Write-Host "🚀 Iniciando despliegue de AppWebEmpacadora en subcarpeta /empacadora/" -ForegroundColor Green
Write-Host "Entorno: $Environment" -ForegroundColor Yellow
Write-Host "Ruta de despliegue: $DeployPath" -ForegroundColor Yellow

# Verificar que Node.js esté instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js no está instalado o no está en el PATH"
    exit 1
}

# Verificar que npm esté instalado
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "❌ npm no está instalado o no está en el PATH"
    exit 1
}

Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error al instalar dependencias"
    exit 1
}

# Construir la aplicación según el entorno
Write-Host "🔨 Construyendo aplicación para entorno: $Environment" -ForegroundColor Blue

switch ($Environment.ToLower()) {
    "development" {
        npm run build:dev
    }
    "staging" {
        npm run build:staging
    }
    "production" {
        npm run build:prod
    }
    default {
        Write-Error "❌ Entorno no válido. Use: development, staging, o production"
        exit 1
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error al construir la aplicación"
    exit 1
}

# Crear directorio de despliegue si no existe
if (-not (Test-Path $DeployPath)) {
    Write-Host "📁 Creando directorio de despliegue: $DeployPath" -ForegroundColor Blue
    New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
}

# Limpiar directorio de despliegue
Write-Host "🧹 Limpiando directorio de despliegue..." -ForegroundColor Blue
Get-ChildItem -Path $DeployPath -Recurse | Remove-Item -Force -Recurse

# Copiar archivos construidos
Write-Host "📋 Copiando archivos construidos..." -ForegroundColor Blue
Copy-Item -Path "dist\*" -Destination $DeployPath -Recurse -Force

# Verificar que el web.config esté presente
$webConfigPath = Join-Path $DeployPath "web.config"
if (-not (Test-Path $webConfigPath)) {
    Write-Host "⚠️  web.config no encontrado, copiando desde public..." -ForegroundColor Yellow
    Copy-Item -Path "public\web.config" -Destination $DeployPath -Force
}

Write-Host "✅ Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host "🌐 La aplicación estará disponible en: http://localhost/empacadora/" -ForegroundColor Cyan
Write-Host "📁 Archivos desplegados en: $DeployPath" -ForegroundColor Cyan

# Mostrar información adicional
Write-Host "`n📋 Información del despliegue:" -ForegroundColor Magenta
Write-Host "   - Entorno: $Environment" -ForegroundColor White
Write-Host "   - Base Path: /empacadora/" -ForegroundColor White
Write-Host "   - Router Basename: /empacadora" -ForegroundColor White
Write-Host "   - Vite Base: /empacadora/" -ForegroundColor White 