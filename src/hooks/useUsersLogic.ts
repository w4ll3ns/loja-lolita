
import { User } from '@/types/store';

export const useUsersLogic = (
  users: User[],
  setUsers: (fn: (prev: User[]) => User[]) => void,
  operations: any
) => {
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = { 
      ...user, 
      id: operations.generateUniqueId(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
    console.log('Usuário criado:', newUser);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    console.log('Usuário atualizado:', id, updates);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    console.log('Usuário removido:', id);
  };

  return {
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword: operations.resetUserPassword
  };
};
