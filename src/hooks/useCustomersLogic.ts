
import { Customer } from '@/types/store';

export const useCustomersLogic = (
  customers: Customer[],
  setCustomers: (fn: (prev: Customer[]) => Customer[]) => void,
  cities: string[],
  setCities: (fn: (prev: string[]) => string[]) => void,
  operations: any
) => {
  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    const result = await operations.addCustomer(customer);
    if (result) {
      const newCustomer: Customer = {
        id: result.id,
        name: result.name,
        whatsapp: result.whatsapp,
        gender: result.gender as 'M' | 'F' | 'Outro',
        city: result.city || undefined,
        wantedToRegister: result.wanted_to_register || undefined,
        isGeneric: result.is_generic || undefined
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      
      if (customer.city && !cities.includes(customer.city)) {
        setCities(prev => [...prev, customer.city!]);
      }
    }
  };

  return {
    addCustomer,
    searchCustomers: (query: string) => operations.searchCustomers(customers, query)
  };
};
