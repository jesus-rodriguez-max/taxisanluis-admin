import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setUser(null);
          setIsAdmin(false);
          return;
        }

        setUser(user);

        // Verificar si el usuario tiene el custom claim de admin
        // Forzamos refresh del token para obtener los claims actualizados
        const tokenResult = await user.getIdTokenResult(true);
        const isAdmin = tokenResult.claims.role === 'admin';
        setIsAdmin(isAdmin);

      } catch (error) {
        console.error('Error verifying admin status:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin };
}
