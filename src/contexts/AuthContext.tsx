
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
          console.log('User found in session:', session.user);
          // Get user profile from profiles table
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data: profile, error }) => {
              if (!mounted) return;
              
              console.log('Profile query result:', { profile, error });
              
              if (profile) {
                const userData = {
                  id: profile.user_id,
                  name: profile.name,
                  email: session.user.email || '',
                  role: profile.role
                };
                console.log('Setting user data:', userData);
                setUser(userData);
              } else {
                console.log('No profile found for user');
                setUser(null);
              }
              setIsLoading(false);
            });
        } else {
          console.log('No user in session');
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
        console.log('Initial session found:', session);
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
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login result:', { data, error });

      if (error) {
        console.log('Login error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful, user:', data.user);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno no login' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
