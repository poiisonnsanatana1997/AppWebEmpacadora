import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from '@/config/environment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Función para redirigir al login considerando el basename de la aplicación
 * @param forceReload Si es true, fuerza la recarga de la página
 */
export const redirectToLogin = (forceReload: boolean = false) => {
  const loginPath = `${config.app.basename}/login`;
  
  console.log('Redirigiendo al login:', {
    loginPath,
    forceReload,
    currentPath: window.location.pathname
  });
  
  if (forceReload) {
    // Usar window.location.href para forzar recarga completa
    window.location.href = loginPath;
  } else {
    // Usar window.location.pathname para navegación sin recarga
    window.location.pathname = loginPath;
  }
};

/**
 * Función para obtener la ruta base de la aplicación
 */
export const getBasePath = () => {
  return config.app.basename;
};
