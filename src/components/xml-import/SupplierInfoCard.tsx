
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { XmlSupplier } from '@/types/xml-import';

interface SupplierInfoCardProps {
  supplier: XmlSupplier;
  supplierExists: boolean;
  existingSupplierName: string;
  shouldImportSupplier: boolean;
  setShouldImportSupplier: (value: boolean) => void;
  canManageSuppliers: boolean;
  supplierFormData: {
    name: string;
    cnpj: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    phone: string;
    email: string;
  };
  setSupplierFormData: (data: any) => void;
  onRegisterSupplier: () => void;
}

export const SupplierInfoCard: React.FC<SupplierInfoCardProps> = ({
  supplier,
  supplierExists,
  existingSupplierName,
  shouldImportSupplier,
  setShouldImportSupplier,
  canManageSuppliers,
  supplierFormData,
  setSupplierFormData,
  onRegisterSupplier
}) => {
  return (
    <Card className={supplierExists ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${supplierExists ? 'text-green-700' : 'text-blue-700'}`}>
          <Building2 className="h-5 w-5" />
          {supplierExists ? 'Fornecedor Identificado (Cadastrado)' : 'Novo Fornecedor Encontrado'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Razão Social:</strong> {supplier.razaoSocial}
          </div>
          {supplier.nomeFantasia && (
            <div>
              <strong>Nome Fantasia:</strong> {supplier.nomeFantasia}
            </div>
          )}
          <div><strong>CNPJ:</strong> {supplier.cnpj}</div>
        </div>
        
        {supplierExists && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Este fornecedor já está cadastrado como "{existingSupplierName}". Os produtos serão vinculados automaticamente.
            </AlertDescription>
          </Alert>
        )}

        {!supplierExists && !canManageSuppliers && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span>Apenas usuários com permissão podem cadastrar novos fornecedores. Os produtos serão importados com fornecedor "A definir".</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!supplierExists && canManageSuppliers && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="importSupplier"
                checked={shouldImportSupplier}
                onCheckedChange={(checked) => setShouldImportSupplier(checked === true)}
              />
              <Label htmlFor="importSupplier" className="text-blue-700 font-medium">
                Cadastrar este fornecedor no sistema
              </Label>
            </div>

            {shouldImportSupplier && (
              <Card className="bg-white border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">Dados do Fornecedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome/Razão Social *</Label>
                      <Input
                        value={supplierFormData.name}
                        onChange={(e) => setSupplierFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nome do fornecedor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <Input
                        value={supplierFormData.cnpj}
                        onChange={(e) => setSupplierFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                        placeholder="CNPJ"
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={onRegisterSupplier}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Cadastrar Fornecedor
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
