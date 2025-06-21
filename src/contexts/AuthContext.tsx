import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginResponse } from '../api/auth';

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
      return false;
    }

    const expirationTime = new Date(expiration).getTime();
    const currentTime = new Date().getTime();
    
    if (currentTime >= expirationTime) {
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
      
      if (currentTime < expirationTime) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } else {
        // Token expirado, limpiar datos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
      }
    }
    setLoading(false);
  }, []);

  // Verificar expiración del token cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && !checkTokenExpiration()) {
        // Si el token expiró, redirigir al login
        window.location.href = '/login';
      }
    }, 60000); // 60000 ms = 1 minuto

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
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
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