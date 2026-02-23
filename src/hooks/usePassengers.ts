import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Passenger } from '@/types';

export function usePassengers() {
    const [passengers, setPassengers] = useState<(Passenger & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query users collection. Assuming 'role' field differentiates or we just fetch all 'users' collection as passengers.
        // Based on previous chats, 'users' collection is likely for passengers.
        const q = query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const passengerList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as (Passenger & { id: string })[];

            setPassengers(passengerList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching passengers:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { passengers, loading };
}
