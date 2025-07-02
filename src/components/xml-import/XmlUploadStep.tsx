
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle } from 'lucide-react';

interface XmlUploadStepProps {
  xmlFile: File | null;
  isProcessing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessXml: () => void;
  onCancel: () => void;
}

export const XmlUploadStep: React.FC<XmlUploadStepProps> = ({
  xmlFile,
  isProcessing,
  onFileUpload,
  onProcessXml,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload do XML da NF-e</CardTitle>
          <CardDescription>
            Selecione o arquivo XML da Nota Fiscal Eletrônica para extrair os produtos e dados do fornecedor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xmlFile">Arquivo XML</Label>
            <Input
              id="xmlFile"
              type="file"
              accept=".xml"
              onChange={onFileUpload}
              className="cursor-pointer"
            />
          </div>
          
          {xmlFile && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Arquivo selecionado: {xmlFile.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          onClick={onProcessXml} 
          disabled={!xmlFile || isProcessing}
          className="bg-store-blue-600 hover:bg-store-blue-700"
        >
          {isProcessing ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Processar XML
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
