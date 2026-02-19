/**
 * Configuración centralizada de la aplicación
 * Usa variables de entorno de Vite con fallbacks seguros
 */

interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    basename: string;
    environment: 'development' | 'staging' | 'production';
  };
  auth: {
    timeout: number;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error' | 'none';
  };
}

/**
 * Helper para acceder a variables de entorno de forma segura
 * En runtime con Vite, import.meta.env estará disponible
 * En TypeScript CLI sin Vite, usamos fallbacks
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - import.meta.env es inyectado por Vite en runtime
  return import.meta?.env?.[key] ?? defaultValue;
};

/**
 * Determina el entorno actual
 */
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // Acceso directo para que Vite pueda hacer tree-shaking y reemplazo estático
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mode = import.meta.env.MODE;
  if (mode === 'production') return 'production';
  if (mode === 'staging') return 'staging';
  return 'development';
};

/**
 * Obtiene el nivel de logging según el entorno
 */
const getLoggingLevel = (): 'debug' | 'info' | 'warn' | 'error' | 'none' => {
  const envLevel = getEnvVar('VITE_LOG_LEVEL');
  const validLevels = ['debug', 'info', 'warn', 'error', 'none'];

  if (envLevel && validLevels.includes(envLevel)) {
    return envLevel as any;
  }

  // Defaults por entorno
  const environment = getEnvironment();
  switch (environment) {
    case 'development':
      return 'debug';
    case 'staging':
      return 'info';
    case 'production':
      return 'error';
    default:
      return 'info';
  }
};

/**
 * Variables de entorno - Acceso directo para que Vite haga reemplazo estático
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_APP_VERSION = import.meta.env.VITE_APP_VERSION;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_APP_BASENAME = import.meta.env.VITE_APP_BASENAME;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_AUTH_TIMEOUT = import.meta.env.VITE_AUTH_TIMEOUT;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const VITE_LOGGING_ENABLED = import.meta.env.VITE_LOGGING_ENABLED;

/**
 * Configuración de la aplicación usando variables de entorno
 */
const appConfig: EnvironmentConfig = {
  api: {
    baseUrl: getEnvironment() === 'development' ? '/api' : (VITE_API_BASE_URL || 'http://localhost:57664/api'),
    timeout: Number(VITE_API_TIMEOUT) || 3600000,
  },
  app: {
    name: VITE_APP_NAME || 'AppWebEmpacadora',
    version: VITE_APP_VERSION || '1.0.0',
    basename: VITE_APP_BASENAME || '/empacadora',
    environment: getEnvironment(),
  },
  auth: {
    timeout: Number(VITE_AUTH_TIMEOUT) || 3600000,
  },
  logging: {
    enabled: VITE_LOGGING_ENABLED !== 'false',
    level: getLoggingLevel(),
  },
};

/**
 * Configuración actual de la aplicación
 */
export const config = appConfig;

/**
 * Utilidades para validar la configuración
 */
export const validateConfig = (): void => {
  const { api, app } = config;

  if (!api.baseUrl) {
    throw new Error('API Base URL no está configurada');
  }

  // En desarrollo permitir rutas relativas para usar proxy de Vite
  if (app.environment !== 'development' && !api.baseUrl.startsWith('http')) {
    throw new Error('API Base URL debe ser una URL válida en producción');
  }

  console.log(`Configuración cargada para: ${config.app.name}`);
  console.log(`Entorno: ${config.app.environment}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`App Basename: ${config.app.basename}`);
};

// Validar configuración al cargar el módulo
validateConfig();
