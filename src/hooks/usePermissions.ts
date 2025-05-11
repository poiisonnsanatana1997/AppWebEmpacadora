import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (requiredRole: string | string[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.roleName);
    }
    
    return user.roleName === requiredRole;
  };

  const hasAnyPermission = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.roleName);
  };

  const hasAllPermissions = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.every(role => user.roleName === role);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.roleName
  };
} 