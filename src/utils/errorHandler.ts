import { AxiosError } from 'axios';
import { logger } from './logger';
import toast from 'react-hot-toast';

/**
 * Tipos de errores de la aplicación
 */
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Clase base para errores de la aplicación
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public details?: any,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de autenticación
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'No autenticado', details?: any) {
    super(message, ErrorType.AUTHENTICATION, 401, details);
  }
}

/**
 * Error de autorización
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'No autorizado', details?: any) {
    super(message, ErrorType.AUTHORIZATION, 403, details);
  }
}

/**
 * Error de validación
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Datos inválidos', details?: any) {
    super(message, ErrorType.VALIDATION, 400, details);
  }
}

/**
 * Error de recurso no encontrado
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado', details?: any) {
    super(message, ErrorType.NOT_FOUND, 404, details);
  }
}

/**
 * Error de red
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Error de conexión', details?: any) {
    super(message, ErrorType.NETWORK, undefined, details);
  }
}

/**
 * Error del servidor
 */
export class ServerError extends AppError {
  constructor(message: string = 'Error del servidor', statusCode: number = 500, details?: any) {
    super(message, ErrorType.SERVER, statusCode, details);
  }
}

/**
 * Determina el tipo de error desde un error de Axios
 */
const getErrorTypeFromAxios = (error: AxiosError): ErrorType => {
  if (!error.response) {
    return ErrorType.NETWORK;
  }

  const status = error.response.status;

  switch (status) {
    case 401:
      return ErrorType.AUTHENTICATION;
    case 403:
      return ErrorType.AUTHORIZATION;
    case 404:
      return ErrorType.NOT_FOUND;
    case 400:
    case 422:
      return ErrorType.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return status >= 400 && status < 500 ? ErrorType.CLIENT : ErrorType.SERVER;
  }
};

/**
 * Obtiene el mensaje de error amigable para el usuario
 */
const getUserFriendlyMessage = (error: AppError): string => {
  // Mensajes personalizados por tipo
  const messages: Record<ErrorType, string> = {
    [ErrorType.AUTHENTICATION]: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    [ErrorType.AUTHORIZATION]: 'No tienes permisos para realizar esta acción.',
    [ErrorType.VALIDATION]: error.message || 'Los datos ingresados no son válidos.',
    [ErrorType.NOT_FOUND]: 'No se encontró el recurso solicitado.',
    [ErrorType.NETWORK]: 'No se pudo conectar con el servidor. Verifica tu conexión.',
    [ErrorType.SERVER]: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.',
    [ErrorType.CLIENT]: error.message || 'Ocurrió un error al procesar tu solicitud.',
    [ErrorType.UNKNOWN]: 'Ocurrió un error inesperado. Intenta nuevamente.'
  };

  return messages[error.type];
};

/**
 * Convierte un error de Axios a AppError
 */
export const parseAxiosError = (error: AxiosError): AppError => {
  const errorType = getErrorTypeFromAxios(error);
  const statusCode = error.response?.status;
  const responseData = error.response?.data as any;

  // Intentar obtener mensaje del servidor
  const serverMessage =
    responseData?.message ||
    responseData?.error ||
    responseData?.msg ||
    error.message;

  switch (errorType) {
    case ErrorType.AUTHENTICATION:
      return new AuthenticationError(serverMessage, responseData);
    case ErrorType.AUTHORIZATION:
      return new AuthorizationError(serverMessage, responseData);
    case ErrorType.VALIDATION:
      return new ValidationError(serverMessage, responseData);
    case ErrorType.NOT_FOUND:
      return new NotFoundError(serverMessage, responseData);
    case ErrorType.NETWORK:
      return new NetworkError(serverMessage, responseData);
    case ErrorType.SERVER:
      return new ServerError(serverMessage, statusCode, responseData);
    default:
      return new AppError(serverMessage, errorType, statusCode, responseData);
  }
};

/**
 * Maneja un error y decide qué hacer con él
 */
interface HandleErrorOptions {
  /** Si debe mostrar toast al usuario */
  showToast?: boolean;
  /** Si debe loggear el error */
  logError?: boolean;
  /** Contexto adicional para logging */
  context?: Record<string, any>;
  /** Callback personalizado */
  onError?: (error: AppError) => void;
  /** Mensaje personalizado para el toast */
  customMessage?: string;
}

/**
 * Función principal para manejar errores
 */
export const handleError = (
  error: unknown,
  options: HandleErrorOptions = {}
): AppError => {
  const {
    showToast = true,
    logError: shouldLog = true,
    context,
    onError,
    customMessage
  } = options;

  // Convertir a AppError
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof AxiosError) {
    appError = parseAxiosError(error);
  } else if (error instanceof Error) {
    appError = new AppError(
      error.message,
      ErrorType.UNKNOWN,
      undefined,
      { originalError: error }
    );
  } else {
    appError = new AppError(
      'Error desconocido',
      ErrorType.UNKNOWN,
      undefined,
      { error }
    );
  }

  // Logging
  if (shouldLog) {
    logger.error('Error capturado:', {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
      details: appError.details,
      context,
      stack: appError.stack
    });
  }

  // Toast para el usuario
  if (showToast) {
    const message = customMessage || getUserFriendlyMessage(appError);

    switch (appError.type) {
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        toast.error(message, { duration: 5000, icon: '🔒' });
        break;
      case ErrorType.VALIDATION:
        toast.error(message, { duration: 4000, icon: '⚠️' });
        break;
      case ErrorType.NETWORK:
        toast.error(message, { duration: 6000, icon: '🌐' });
        break;
      default:
        toast.error(message, { duration: 4000 });
    }
  }

  // Callback personalizado
  if (onError) {
    onError(appError);
  }

  return appError;
};

/**
 * Wrapper para funciones async con manejo de errores
 */
export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: HandleErrorOptions
): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      throw error; // Re-lanzar para que el caller pueda manejarlo si necesita
    }
  }) as T;
};

/**
 * Helper para retry de operaciones con exponential backoff
 */
interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: AppError) => boolean;
}

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.type === ErrorType.NETWORK || error.type === ErrorType.SERVER
  } = options;

  let lastError: AppError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof AppError ? error : handleError(error, { showToast: false });

      const isLastAttempt = attempt === maxAttempts;
      const canRetry = shouldRetry(lastError);

      if (isLastAttempt || !canRetry) {
        throw lastError;
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      logger.warn(`Intento ${attempt} falló, reintentando en ${delay}ms...`, {
        error: lastError.message
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Maneja errores específicos de autenticación
 */
export const handleAuthError = (error: unknown): void => {
  const appError = handleError(error, {
    showToast: true,
    logError: true,
    context: { component: 'Authentication' }
  });

  // Si es error de autenticación, la redirección ya la maneja el interceptor de axios
  if (appError.type === ErrorType.AUTHENTICATION) {
    logger.warn('Error de autenticación detectado, el interceptor manejará la redirección');
  }
};

/**
 * Maneja errores de API genéricos
 */
export const handleApiError = (
  error: unknown,
  context?: string
): AppError => {
  return handleError(error, {
    showToast: true,
    logError: true,
    context: { api: context }
  });
};
