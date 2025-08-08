
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useRateLimit } from '@/hooks/useRateLimit';

export type UserRole = 'admin' | 'vendedor' | 'caixa' | 'consultivo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { checkRateLimit, recordAttempt, resetRateLimit } = useRateLimit();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Get user profile from profiles table
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data: profile, error }) => {
              if (!mounted) return;
              
              if (profile) {
                const userData = {
                  id: profile.user_id,
                  name: profile.name,
                  email: session.user.email || '',
                  role: profile.role
                };
                setUser(userData);
              } else {
                setUser(null);
              }
              setIsLoading(false);
            });
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      // onAuthStateChange will handle this, but trigger it manually for initial load
      if (session) {
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Verificar rate limit antes de tentar login
      const rateLimitCheck = checkRateLimit();
      
      if (!rateLimitCheck.allowed) {
        const blockedUntil = new Date(rateLimitCheck.blockedUntil!);
        return { 
          success: false, 
          error: `Muitas tentativas de login. Tente novamente após ${blockedUntil.toLocaleTimeString()}` 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Registrar tentativa falhada
        recordAttempt(false);
        
        // Verificar se foi bloqueado após a tentativa
        const newRateLimitCheck = checkRateLimit();
        if (!newRateLimitCheck.allowed) {
          const blockedUntil = new Date(newRateLimitCheck.blockedUntil!);
          return { 
            success: false, 
            error: `Muitas tentativas de login. Tente novamente após ${blockedUntil.toLocaleTimeString()}` 
          };
        }
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Registrar tentativa bem-sucedida (reset do rate limit)
        recordAttempt(true);
        return { success: true };
      }

      // Registrar tentativa falhada
      recordAttempt(false);
      return { success: false, error: 'Login failed' };
    } catch (error) {
      // Registrar tentativa falhada
      recordAttempt(false);
      return { success: false, error: 'Erro interno no login' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Reset do rate limit no logout
    resetRateLimit();
  };

  const value = {
    user,
    session,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
