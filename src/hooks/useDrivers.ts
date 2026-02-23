import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Driver } from '@/types';

export function useDrivers() {
  const [drivers, setDrivers] = useState<(Driver & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Escuchar todos los conductores activos en tiempo real
    const q = query(
      collection(db, 'drivers'),
      where('status', '!=', 'suspended')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const driversData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (Driver & { id: string })[];

        setDrivers(driversData);
        setLoading(false);
      },
      (err) => {
        console.error('Error escuchando conductores:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { drivers, loading, error };
}

export function useOnlineDrivers() {
  const [onlineDrivers, setOnlineDrivers] = useState<(Driver & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar solo conductores online
    const q = query(
      collection(db, 'drivers'),
      where('online', '==', true),
      where('status', '==', 'verified')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driversData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Driver & { id: string })[];

      setOnlineDrivers(driversData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { onlineDrivers, loading };
}
