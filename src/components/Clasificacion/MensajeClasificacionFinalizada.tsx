import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, FileText, Lock } from 'lucide-react';
import React from 'react';

interface MensajeClasificacionFinalizadaProps {
  children?: React.ReactNode;
}

export const MensajeClasificacionFinalizada: React.FC<MensajeClasificacionFinalizadaProps> = ({ children }) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-green-800">
                Clasificación Finalizada
              </h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                CLASIFICADO
              </Badge>
            </div>
            <p className="text-green-700 mb-4">
              La clasificación de esta orden ha sido completada exitosamente. 
              Ya no se pueden realizar modificaciones a las tarimas, mermas o retornos.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Lock className="h-4 w-4" />
                  <span>Edición bloqueada</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <FileText className="h-4 w-4" />
                  <span>Reportes disponibles</span>
                </div>
              </div>
              {children && (
                <div className="flex justify-end md:justify-end mt-2 md:mt-0">{children}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 