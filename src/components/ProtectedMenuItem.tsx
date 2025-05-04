import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface ProtectedMenuItemProps {
  children: ReactNode;
  requiredRole?: string | string[];
  showIf?: boolean;
}

export default function ProtectedMenuItem({ 
  children, 
  requiredRole, 
  showIf = true 
}: ProtectedMenuItemProps) {
  const { hasPermission } = usePermissions();

  if (!showIf) {
    return null;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return null;
  }

  return <>{children}</>;
} 