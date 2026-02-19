import { config } from '@/config/environment';

/**
 * Niveles de logging disponibles
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none'
}

/**
 * Configuración del logger
 */
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  includeTimestamp: boolean;
  includeLocation: boolean;
}

/**
 * Obtiene la configuración del logger desde el config
 */
const getLoggerConfig = (): LoggerConfig => {
  const level = config.logging.level as LogLevel || LogLevel.INFO;

  return {
    enabled: config.logging.enabled,
    level,
    includeTimestamp: true,
    includeLocation: import.meta.env.DEV // Solo en desarrollo
  };
};

/**
 * Jerarquía de niveles para comparación
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.NONE]: 4
};

/**
 * Verifica si un nivel de log debe mostrarse
 */
const shouldLog = (messageLevel: LogLevel): boolean => {
  const cfg = getLoggerConfig();

  if (!cfg.enabled) return false;

  return LOG_LEVEL_PRIORITY[messageLevel] >= LOG_LEVEL_PRIORITY[cfg.level];
};

/**
 * Formatea el mensaje con timestamp y ubicación
 */
const formatMessage = (level: LogLevel, args: any[]): any[] => {
  const cfg = getLoggerConfig();
  const prefix: string[] = [];

  if (cfg.includeTimestamp) {
    const timestamp = new Date().toISOString();
    prefix.push(`[${timestamp}]`);
  }

  prefix.push(`[${level.toUpperCase()}]`);

  if (cfg.includeLocation) {
    const stack = new Error().stack;
    const callerLine = stack?.split('\n')[3]?.trim() || '';
    const match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
    if (match) {
      const [, , file, line] = match;
      const fileName = file.split('/').pop();
      prefix.push(`[${fileName}:${line}]`);
    }
  }

  return [...prefix, ...args];
};

/**
 * Logger centralizado para la aplicación
 *
 * Reemplaza console.log/error/warn con logging controlado por configuración
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * logger.debug('Mensaje de debug', { data: 'value' });
 * logger.info('Usuario autenticado', user);
 * logger.warn('Token próximo a expirar');
 * logger.error('Error al cargar datos', error);
 * ```
 */
export const logger = {
  /**
   * Log de debug - solo visible en nivel DEBUG
   * Usar para información detallada de desarrollo
   */
  debug: (...args: any[]): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.log(...formatMessage(LogLevel.DEBUG, args));
    }
  },

  /**
   * Log informativo - visible en nivel INFO y superiores
   * Usar para eventos importantes del sistema
   */
  info: (...args: any[]): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(...formatMessage(LogLevel.INFO, args));
    }
  },

  /**
   * Log de advertencia - visible en nivel WARN y superiores
   * Usar para situaciones que requieren atención pero no son errores
   */
  warn: (...args: any[]): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(...formatMessage(LogLevel.WARN, args));
    }
  },

  /**
   * Log de error - siempre visible excepto en nivel NONE
   * Usar para errores que afectan funcionalidad
   */
  error: (...args: any[]): void => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(...formatMessage(LogLevel.ERROR, args));
    }
  },

  /**
   * Log de grupo - para agrupar logs relacionados
   */
  group: (label: string, level: LogLevel = LogLevel.INFO): void => {
    if (shouldLog(level)) {
      console.group(...formatMessage(level, [label]));
    }
  },

  /**
   * Cierra un grupo de logs
   */
  groupEnd: (): void => {
    if (getLoggerConfig().enabled) {
      console.groupEnd();
    }
  },

  /**
   * Log de tabla - útil para arrays de objetos
   */
  table: (data: any, level: LogLevel = LogLevel.DEBUG): void => {
    if (shouldLog(level)) {
      console.table(data);
    }
  },

  /**
   * Mide el tiempo de ejecución de una operación
   */
  time: (label: string): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.time(label);
    }
  },

  /**
   * Finaliza la medición de tiempo
   */
  timeEnd: (label: string): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(label);
    }
  }
};

/**
 * Logger específico para desarrollo
 * Solo se ejecuta en modo desarrollo
 */
export const devLogger = {
  log: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      logger.debug(...args);
    }
  }
};

/**
 * Helper para logging de errores con contexto
 */
export const logError = (
  message: string,
  error: unknown,
  context?: Record<string, any>
): void => {
  logger.error(message, {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error,
    context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Helper para logging de eventos de autenticación
 */
export const logAuthEvent = (
  event: string,
  details?: Record<string, any>
): void => {
  logger.info('🔐 Auth Event:', event, details);
};

/**
 * Helper para logging de llamadas API
 */
export const logApiCall = (
  method: string,
  url: string,
  status?: number,
  duration?: number
): void => {
  const emoji = status && status >= 200 && status < 300 ? '✅' : '❌';
  logger.debug(`${emoji} API [${method}] ${url}`, {
    status,
    duration: duration ? `${duration}ms` : undefined
  });
};
