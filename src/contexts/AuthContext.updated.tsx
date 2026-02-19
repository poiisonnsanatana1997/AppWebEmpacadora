import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginResponse } from '../api/auth';
import { redirectToLogin } from '../lib/utils';
import { logger, logAuthEvent } from '../utils/logger';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');

    if (!token || !expiration) {
      logger.debug('Token o expiración no encontrados');
      return false;
    }

    const expirationTime = new Date(expiration).getTime();
    const currentTime = new Date().getTime();

    logger.debug('Verificando expiración del token', {
      currentTime: new Date(currentTime).toISOString(),
      expirationTime: new Date(expirationTime).toISOString(),
      isExpired: currentTime >= expirationTime
    });

    if (currentTime >= expirationTime) {
      logAuthEvent('Token expirado, ejecutando logout');
      logout();
      return false;
    }

    return true;
  };

  useEffect(() => {
    // Verificar si hay un token al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const expiration = localStorage.getItem('tokenExpiration');

    if (token && userData && expiration) {
      const expirationTime = new Date(expiration).getTime();
      const currentTime = new Date().getTime();

      logger.debug('Verificando token al cargar', {
        hasToken: !!token,
        hasUser: !!userData,
        hasExpiration: !!expiration,
        currentTime: new Date(currentTime).toISOString(),
        expirationTime: new Date(expirationTime).toISOString(),
        isExpired: currentTime >= expirationTime
      });

      if (currentTime < expirationTime) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
          logAuthEvent('Sesión restaurada correctamente', { username: parsedUser.username });
        } catch (error) {
          logger.error('Error al parsear datos del usuario', error);
          // Si hay error al parsear, limpiar datos corruptos
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          redirectToLogin(true);
        }
      } else {
        // Token expirado, limpiar datos y redirigir
        logAuthEvent('Token expirado al cargar, redirigiendo al login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        redirectToLogin(true);
      }
    } else {
      logger.debug('No se encontraron datos de sesión al cargar');
    }
    setLoading(false);
  }, []);

  // Verificar expiración del token cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && !checkTokenExpiration()) {
        // Si el token expiró, redirigir al login
        logAuthEvent('Redirigiendo al login por expiración de sesión');
        redirectToLogin(true);
      }
    }, 300000); // 300000 ms = 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('tokenExpiration', response.expiration);
      setIsAuthenticated(true);
      setUser(response.user);
      logAuthEvent('Login exitoso, sesión establecida', { username: response.user.username });
      return response;
    } catch (error) {
      logger.error('Error en login', error);
      throw error;
    }
  };

  const logout = () => {
    logAuthEvent('Ejecutando logout', { username: user?.username });
    authService.logout();
    localStorage.removeItem('tokenExpiration');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, checkTokenExpiration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
