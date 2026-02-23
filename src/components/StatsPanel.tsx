import { useMemo } from 'react';
import type { Driver, Trip } from '@/types';

interface StatsProps {
  drivers: (Driver & { id: string })[];
  trips: (Trip & { id: string })[];
}

export function StatsPanel({ drivers, trips }: StatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return {
      // Conductores
      totalDrivers: drivers.length,
      onlineDrivers: drivers.filter((d) => d.online).length,
      activeDrivers: drivers.filter((d) => d.status === 'active').length,
      withValidSubscription: drivers.filter((d) => d.subscriptionActive).length,
      withStripeIssues: drivers.filter((d) => !d.stripeChargesEnabled && d.status === 'active').length,

      // Viajes
      requestedTrips: trips.filter((t) => t.status === 'requested').length,
      inProgressTrips: trips.filter((t) => ['accepted', 'on_the_way', 'arrived', 'started'].includes(t.status)).length,
      completedToday: trips.filter((t) => {
        if (t.status !== 'completed' || !t.completedAt) return false;

        let completedTime: Date;
        if (typeof t.completedAt === 'object' && 'toDate' in t.completedAt) {
          completedTime = (t.completedAt as any).toDate();
        } else if ((t.completedAt as any) instanceof Date) {
          completedTime = t.completedAt;
        } else {
          completedTime = new Date(t.completedAt as any);
        }

        return completedTime >= todayStart;
      }).length,
    };
  }, [drivers, trips]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border-b">
      {/* Conductores Online */}
      <StatCard
        label="Conductores Online"
        value={stats.onlineDrivers}
        total={stats.totalDrivers}
        color="green"
      />

      {/* Viajes Solicitados */}
      <StatCard
        label="Viajes Solicitados"
        value={stats.requestedTrips}
        color={stats.requestedTrips > 0 ? 'blue' : 'gray'}
        pulse={stats.requestedTrips > 0}
      />

      {/* Viajes en Proceso */}
      <StatCard
        label="Viajes en Proceso"
        value={stats.inProgressTrips}
        color="yellow"
      />

      {/* Completados Hoy */}
      <StatCard
        label="Completados Hoy"
        value={stats.completedToday}
        color="gray"
      />

      {/* Suscripciones Activas */}
      <StatCard
        label="Suscripciones Activas"
        value={stats.withValidSubscription}
        total={stats.totalDrivers}
        color={stats.withValidSubscription === stats.totalDrivers ? 'green' : 'yellow'}
      />

      {/* Problemas Stripe */}
      <StatCard
        label="Problemas Stripe"
        value={stats.withStripeIssues}
        color={stats.withStripeIssues > 0 ? 'red' : 'green'}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  pulse?: boolean;
}

function StatCard({ label, value, total, color, pulse }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  return (
    <div className={`border rounded-lg p-3 ${colorClasses[color]} ${pulse ? 'animate-pulse' : ''}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        {total !== undefined && (
          <span className="text-sm font-normal opacity-60">/{total}</span>
        )}
      </p>
    </div>
  );
}
