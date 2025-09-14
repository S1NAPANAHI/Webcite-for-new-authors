import { useState, useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User {
    id: string;
    role: string | null;
    privileges: string[] | null;
}

interface DecodedToken extends JwtPayload {
    sub: string;
    role?: string;
    privileges?: string[];
}

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        if (decodedToken.exp && Date.now() < decodedToken.exp * 1000) {
          const role = localStorage.getItem('role');
          const privilegesRaw = localStorage.getItem('privileges');
          const privileges = privilegesRaw ? JSON.parse(privilegesRaw) : [];

          setUser({
            id: decodedToken.sub,
            role: role,
            privileges: privileges,
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('privileges');
          setUser(null);
        }
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('privileges');
        setUser(null);
      }
    }
  }, []);

  return { user, setUser };
}
