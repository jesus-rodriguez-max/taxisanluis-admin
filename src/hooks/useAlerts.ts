import { useEffect, useState } from 'react';
import type { Driver, Trip, Alert } from '@/types';

export function useAlerts(
  drivers: (Driver & { id: string })[],
  trips: (Trip & { id: string })[]
) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    try {
      const newAlerts: Alert[] = [];
      const now = new Date();

      // 1. DETECTAR VIAJES ACEPTADOS QUE NO AVANZAN (>5 minutos)
      trips.forEach((trip) => {
        try {
          if (trip.status === 'accepted' && trip.acceptedAt) {
            // Verificar si acceptedAt tiene el método toDate (Firestore Timestamp)
            let acceptedTime: Date;

            if (trip.acceptedAt && typeof trip.acceptedAt === 'object' && 'toDate' in trip.acceptedAt) {
              acceptedTime = (trip.acceptedAt as any).toDate();
            } else if ((trip.acceptedAt as any) instanceof Date) {
              acceptedTime = trip.acceptedAt;
            } else if (typeof trip.acceptedAt === 'string' || typeof trip.acceptedAt === 'number') {
              acceptedTime = new Date(trip.acceptedAt);
            } else {
              acceptedTime = new Date();
            }

            const minutesSinceAccepted = (now.getTime() - acceptedTime.getTime()) / 1000 / 60;

            if (minutesSinceAccepted > 5) {
              newAlerts.push({
                id: `trip-stuck-${trip.id}`,
                type: 'warning',
                tripId: trip.id,
                driverId: trip.driverId || undefined,
                message: `Viaje ${trip.id.slice(0, 8)} aceptado hace ${Math.floor(minutesSinceAccepted)} min pero no avanza`,
                timestamp: now,
              });
            }
          }
        } catch (err) {
          console.warn('Error processing trip alert:', trip.id, err);
        }

        // 2. DETECTAR VIAJES EN PROCESO PERO CONDUCTOR OFFLINE
        try {
          if (
            ['accepted', 'on_the_way', 'arrived', 'started'].includes(trip.status) &&
            trip.driverId
          ) {
            const driver = drivers.find((d) => d.id === trip.driverId);
            if (driver && !driver.online) {
              newAlerts.push({
                id: `driver-offline-${trip.id}`,
                type: 'danger',
                tripId: trip.id,
                driverId: trip.driverId,
                message: `Conductor ${driver.name || 'Desconocido'} tiene viaje activo pero está OFFLINE`,
                timestamp: now,
              });
            }
          }
        } catch (err) {
          console.warn('Error processing driver offline alert:', trip.id, err);
        }
      });

      // 3. DETECTAR CONDUCTORES ACTIVOS SIN STRIPE HABILITADO
      drivers.forEach((driver) => {
        try {
          const isVerified = driver.status === 'verified' || driver.status === 'active';
          if (
            driver.online &&
            isVerified &&
            !driver.stripeChargesEnabled
          ) {
            newAlerts.push({
              id: `stripe-disabled-${driver.id}`,
              type: 'danger',
              driverId: driver.id,
              message: `${driver.name || 'Conductor'} está online pero Stripe NO habilitado`,
              timestamp: now,
            });
          }
        } catch (err) {
          console.warn('Error processing Stripe alert:', driver.id, err);
        }
      });

      // 4. DETECTAR SUSCRIPCIONES VENCIDAS
      drivers.forEach((driver) => {
        try {
          const isVerified = driver.status === 'verified' || driver.status === 'active';
          if (isVerified && !driver.subscriptionActive) {
            newAlerts.push({
              id: `subscription-expired-${driver.id}`,
              type: 'warning',
              driverId: driver.id,
              message: `${driver.name || 'Conductor'} tiene suscripción vencida`,
              timestamp: now,
            });
          }
        } catch (err) {
          console.warn('Error processing subscription alert:', driver.id, err);
        }
      });

      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error generating alerts:', error);
      setAlerts([]);
    }
  }, [drivers, trips]);

  return { alerts };
}
