
import { Customer } from '@/types/store';

export const useCustomersLogic = (
  customers: Customer[],
  setCustomers: (fn: (prev: Customer[]) => Customer[]) => void,
  cities: string[],
  setCities: (fn: (prev: string[]) => string[]) => void,
  operations: any
) => {
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: operations.generateUniqueId() };
    setCustomers(prev => [...prev, newCustomer]);
    
    if (customer.city && !cities.includes(customer.city)) {
      setCities(prev => [...prev, customer.city!]);
    }
  };

  return {
    addCustomer,
    searchCustomers: (query: string) => operations.searchCustomers(customers, query)
  };
};
