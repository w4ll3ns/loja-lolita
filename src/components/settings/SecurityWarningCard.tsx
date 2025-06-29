
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const SecurityWarningCard = () => {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-800">
              Atenção: Configurações de Segurança
            </p>
            <p className="text-sm text-yellow-700">
              Alterações nas políticas de segurança serão aplicadas no próximo login dos usuários. 
              Certifique-se de comunicar as mudanças para toda a equipe.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
