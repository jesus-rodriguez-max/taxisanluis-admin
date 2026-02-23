import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Trip } from '@/types';

export function useActiveTrips() {
  const [trips, setTrips] = useState<(Trip & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar viajes que NO estén completados o cancelados
    const q = query(
      collection(db, 'trips'),
      where('status', 'in', ['pending', 'requested', 'accepted', 'on_the_way', 'arrived', 'started']),
      orderBy('timestamps.createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Trip & { id: string })[];

      setTrips(tripsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { trips, loading };
}

export function useRequestedTrips() {
  const [requestedTrips, setRequestedTrips] = useState<(Trip & { id: string })[]>([]);

  useEffect(() => {
    // Solo viajes solicitados (sin conductor asignado)
    const q = query(
      collection(db, 'trips'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Trip & { id: string })[];

      setRequestedTrips(tripsData);
    });

    return () => unsubscribe();
  }, []);

  return { requestedTrips };
}
