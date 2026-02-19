/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_BASENAME: string;

  // Authentication
  readonly VITE_AUTH_TIMEOUT: string;

  // Logging
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'none';
  readonly VITE_LOGGING_ENABLED: string;

  // Vite built-ins
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
