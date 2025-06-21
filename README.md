# AppWebEmpacadora

Aplicación web para gestión de empacadora desarrollada con React + TypeScript + Vite.

## Características

- 🚀 **React 18** con TypeScript
- ⚡ **Vite** para desarrollo rápido
- 🎨 **TailwindCSS** para estilos
- 🔐 **Autenticación JWT**
- 📊 **Gestión de productos y órdenes**
- 👥 **Gestión de usuarios**
- 📱 **Responsive design**

## Configuración de Variables de Entorno

### Configuración Rápida

1. **Copiar el archivo de ejemplo:**
```bash
cp env.example .env
```

2. **Configurar las variables según tu entorno:**
```bash
# Desarrollo
VITE_API_BASE_URL=http://localhost:5177/api

# Producción
VITE_API_BASE_URL=https://api.tu-servidor.com/api
```

### Configuración por Entorno

- **Desarrollo:** `.env.development`
- **Staging:** `.env.staging`
- **Producción:** `.env.production`

Para más detalles, consulta [docs/environment-setup.md](docs/environment-setup.md).

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Ejecutar en desarrollo
npm run dev
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build              # Construcción por defecto
npm run build:dev          # Construcción para desarrollo
npm run build:staging      # Construcción para staging
npm run build:prod         # Construcción para producción

# Preview
npm run preview            # Preview local
npm run preview:prod       # Preview de producción

# Despliegue
npm run deploy             # Desplegar a producción
npm run deploy:staging     # Desplegar a staging

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── api/                   # Configuración de API y autenticación
├── components/            # Componentes reutilizables
├── config/               # Configuración de entorno
├── contexts/             # Contextos de React
├── hooks/                # Custom hooks
├── pages/                # Páginas de la aplicación
├── services/             # Servicios de API
├── types/                # Definiciones de tipos TypeScript
└── utils/                # Utilidades
```

## Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript, Vite
- **Estilos:** TailwindCSS, Shadcn/ui
- **Estado:** React Context, React Query
- **HTTP Client:** Axios
- **Formularios:** React Hook Form, Zod
- **Routing:** React Router DOM
- **UI Components:** Radix UI, Lucide React

## Despliegue

### Despliegue en Subcarpeta (/EMPACADORA/)

La aplicación está configurada para funcionar en una subcarpeta llamada `/EMPACADORA/`. Esto significa que la aplicación será accesible en `http://tu-servidor/EMPACADORA/`.

#### Configuración Automática

El proyecto ya incluye la configuración necesaria:

- **Vite Base Path:** `/EMPACADORA/` (en `vite.config.ts`)
- **React Router Basename:** `/EMPACADORA` (en `AppRouter.tsx`)
- **IIS URL Rewrite:** Configurado para manejar rutas de React Router

#### Despliegue con PowerShell

```powershell
# Despliegue a producción
.\deploy.ps1 -Environment production

# Despliegue a staging
.\deploy.ps1 -Environment staging

# Despliegue a desarrollo
.\deploy.ps1 -Environment development

# Personalizar ruta de despliegue
.\deploy.ps1 -Environment production -DeployPath "C:\inetpub\wwwroot\mi-empacadora"
```

#### Despliegue Manual

1. **Construir la aplicación:**
```bash
npm run build:prod
```

2. **Copiar archivos a la carpeta del servidor web:**
```bash
# Ejemplo para IIS
xcopy dist\* C:\inetpub\wwwroot\EMPACADORA\ /E /Y
```

3. **Verificar que el web.config esté presente** en la carpeta de despliegue

#### URLs de Acceso

- **Aplicación principal:** `http://localhost/EMPACADORA/`
- **Login:** `http://localhost/EMPACADORA/login`
- **Dashboard:** `http://localhost/EMPACADORA/dashboard`

### IIS (Windows)

Consulta [deploy-iis.md](deploy-iis.md) para instrucciones detalladas.

### Otros Servidores

1. **Construir para producción:**
```bash
npm run build:prod
```

2. **Servir archivos estáticos** desde la carpeta `dist/`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y confidencial.

---

Para más información sobre la configuración de variables de entorno, consulta la [documentación completa](docs/environment-setup.md).
