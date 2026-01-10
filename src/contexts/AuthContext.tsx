import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  id: string;
  tenant_id: string | null;
  role: 'super_admin' | 'tenant_admin' | 'agent';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);

  const isSuperAdmin = roles.some(r => r.role === 'super_admin');

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, tenant_id, role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      setRoles(data || []);
      
      // Set default tenant if user has one
      if (data && data.length > 0 && !currentTenantId) {
        const firstTenantRole = data.find(r => r.tenant_id);
        if (firstTenantRole) {
          setCurrentTenantId(firstTenantRole.tenant_id);
        }
      }
    } catch (err) {
      console.error('Error in fetchUserRoles:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetching with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setRoles([]);
          setCurrentTenantId(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
    setCurrentTenantId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        isLoading,
        isSuperAdmin,
        currentTenantId,
        setCurrentTenantId,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
