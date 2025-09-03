import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';

const AuthLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      // This will attempt to retrieve the session from localStorage and refresh it if needed
      await supabase.auth.getSession(); 
      setLoading(false);
    };

    loadSession();
  }, []);

  if (loading) {
    // You can render a loading spinner or a blank page here
    return <div>Loading authentication...</div>; 
  }

  return <>{children}</>;
};

export default AuthLoader;
