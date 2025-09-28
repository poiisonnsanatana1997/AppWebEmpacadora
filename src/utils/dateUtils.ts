/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Obtiene la fecha actual en formato ISO string pero en zona horaria de México
 * @returns string en formato YYYY-MM-DDTHH:mm:ss (sin Z al final)
 */
export function getMexicoLocalISOString(): string {
  const fecha = new Date();
  const offset = -6 * 60; // México GMT-6 en minutos
  const mexicoDate = new Date(fecha.getTime() + (offset * 60 * 1000));
  return mexicoDate.toISOString().slice(0, -1); // Remover la 'Z'
}

/**
 * Obtiene la fecha actual en formato ISO string pero en zona horaria de México
 * usando Intl.DateTimeFormat (más robusta para cambios de horario)
 * @returns string en formato YYYY-MM-DDTHH:mm:ss
 */
export function getMexicoLocalISOStringRobust(): string {
  const fecha = new Date();
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(fecha);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  const second = parts.find(p => p.type === 'second')?.value;
  
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

/**
 * Obtiene la fecha actual en formato legible para México
 * @returns string en formato DD/MM/YYYY HH:mm:ss
 */
export function getMexicoLocalReadable(): string {
  const fecha = new Date();
  return fecha.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD para inputs de fecha
 * Evita problemas de zona horaria al usar la fecha local
 * @returns string en formato YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}