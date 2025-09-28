/**
 * Configuración centralizada de la aplicación
 * Configuración única para todos los entornos
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
 * Configuración única de la aplicación
 */
const appConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://18.217.220.233/EM001/api',
    timeout: 3600000,
  },
  app: {
    name: 'AppWebEmpacadora',
    version: '1.0.0',
    basename: '/empacadora',
  },
  auth: {
    timeout: 3600000,
  },
  logging: {
    enabled: true,
    level: 'info',
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
  const { api } = config;
  
  if (!api.baseUrl) {
    throw new Error('API Base URL no está configurada');
  }
  
  if (!api.baseUrl.startsWith('http')) {
    throw new Error('API Base URL debe ser una URL válida');
  }
  
  console.log(`Configuración cargada para: ${config.app.name}`);
  console.log(`API Base URL: ${config.api.baseUrl}`);
  console.log(`App Basename: ${config.app.basename}`);
};

// Validar configuración al cargar el módulo
validateConfig(); 