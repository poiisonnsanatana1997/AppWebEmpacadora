import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, FileText, Lock } from 'lucide-react';
import React from 'react';

interface MensajeClasificacionFinalizadaProps {
  children?: React.ReactNode;
}

export const MensajeClasificacionFinalizada: React.FC<MensajeClasificacionFinalizadaProps> = ({ children }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-green-50 border-l-4 border-green-400 rounded-r">
      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
      <span className="text-sm text-green-800 font-medium">Clasificación Finalizada</span>
      {children && <div className="ml-auto">{children}</div>}
    </div>
  );
}; 