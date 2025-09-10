import { useState } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { signIn, signUp, loading, error };
};
