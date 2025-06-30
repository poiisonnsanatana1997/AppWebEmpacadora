/**
 * Configuración centralizada de variables de entorno
 * Este archivo centraliza todas las variables de entorno para mayor seguridad y flexibilidad
 */

interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    environment: string;
    basename: string;
  };
  auth: {
    timeout: number;
  };
  logging: {
    enabled: boolean;
    level: string;
  };
}

/**
 * Obtiene el valor de una variable de entorno con validación
 * @param key - Nombre de la variable de entorno
 * @param defaultValue - Valor por defecto si la variable no está definida
 * @returns El valor de la variable de entorno o el valor por defecto
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Variable de entorno ${key} no está definida`);
    return '';
  }
  return value || defaultValue || '';
};

/**
 * Configuración del entorno de desarrollo
 */
const developmentConfig: EnvironmentConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost/AppAPIEmpacadora/api'),
    timeout: 10000,
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'AppWebEmpacadora (Dev)'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    environment: 'development',
    basename: getEnvVar('VITE_APP_BASENAME', '/empacadora'),
  },
  auth: {
    timeout: parseInt(getEnvVar('VITE_AUTH_TIMEOUT', '3600000')),
  },
  logging: {
    enabled: getEnvVar('VITE_ENABLE_LOGGING', 'true') === 'true',
    level: getEnvVar('VITE_LOG_LEVEL', 'info'),
  },
};

/**
 * Configuración del entorno de producción
 */
const productionConfig: EnvironmentConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://18.217.220.233/EM001/api'),
    timeout: 15000,
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'AppWebEmpacadora'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    environment: 'production',
    basename: getEnvVar('VITE_APP_BASENAME', '/empacadora'),
  },
  auth: {
    timeout: parseInt(getEnvVar('VITE_AUTH_TIMEOUT', '3600000')),
  },
  logging: {
    enabled: getEnvVar('VITE_ENABLE_LOGGING', 'false') === 'true',
    level: getEnvVar('VITE_LOG_LEVEL', 'error'),
  },
};

/**
 * Configuración del entorno de staging
 */
const stagingConfig: EnvironmentConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'https://staging-api.tu-servidor.com/api'),
    timeout: 12000,
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'AppWebEmpacadora (Staging)'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    environment: 'staging',
    basename: getEnvVar('VITE_APP_BASENAME', '/empacadora'),
  },
  auth: {
    timeout: parseInt(getEnvVar('VITE_AUTH_TIMEOUT', '3600000')),
  },
  logging: {
    enabled: getEnvVar('VITE_ENABLE_LOGGING', 'true') === 'true',
    level: getEnvVar('VITE_LOG_LEVEL', 'warn'),
  },
};

/**
 * Obtiene la configuración según el entorno actual
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = import.meta.env.MODE || 'development';
  
  switch (environment) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

/**
 * Configuración actual del entorno
 */
export const config = getEnvironmentConfig();

/**
 * Utilidades para validar la configuración
 */
export const validateConfig = (): void => {
  const { api } = config;
  
  if (!api.baseUrl) {
    throw new Error('VITE_API_BASE_URL no está configurada');
  }
  
  if (!api.baseUrl.startsWith('http')) {
    throw new Error('VITE_API_BASE_URL debe ser una URL válida');
  }
  
  console.log(`Configuración cargada para entorno: ${config.app.environment}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
};

// Validar configuración al cargar el módulo
if (import.meta.env.DEV) {
  validateConfig();
} 