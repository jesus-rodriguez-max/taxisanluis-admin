import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Driver } from '@/types';

interface DriversListProps {
  drivers: (Driver & { id: string })[];
  onSelectDriver?: (driverId: string) => void;
}

export function DriversList({ drivers, onSelectDriver }: DriversListProps) {
  const [filter, setFilter] = useState<'all' | 'online' | 'issues'>('all');

  const filteredDrivers = useMemo(() => {
    switch (filter) {
      case 'online':
        return drivers.filter((d) => d.online);
      case 'issues':
        return drivers.filter((d) =>
          !d.subscriptionActive || !d.stripeChargesEnabled || (d.status !== 'verified' && d.status !== 'active')
        );
      default:
        return drivers;
    }
  }, [drivers, filter]);

  return (
    <div className="space-y-2 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm text-gray-700">
          Conductores ({filteredDrivers.length})
        </h3>

        <div className="flex gap-1">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="Todos"
          />
          <FilterButton
            active={filter === 'online'}
            onClick={() => setFilter('online')}
            label="Online"
          />
          <FilterButton
            active={filter === 'issues'}
            onClick={() => setFilter('issues')}
            label="Problemas"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredDrivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onClick={() => onSelectDriver?.(driver.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DriverCardProps {
  driver: Driver & { id: string };
  onClick?: () => void;
}

function DriverCard({ driver, onClick }: DriverCardProps) {
  let locationAge = 'Sin actualización';

  if (driver.location && driver.location.updatedAt) {
    try {
      let date: Date;
      if (typeof driver.location.updatedAt === 'object' && 'toDate' in driver.location.updatedAt) {
        date = (driver.location.updatedAt as any).toDate();
      } else if ((driver.location.updatedAt as any) instanceof Date) {
        date = driver.location.updatedAt;
      } else {
        date = new Date(driver.location.updatedAt as any);
      }
      locationAge = formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (e) {
      console.warn('Error formatting date', e);
    }
  }

  const hasIssues = !driver.subscriptionActive || !driver.stripeChargesEnabled || (driver.status !== 'verified' && driver.status !== 'active');

  return (
    <div
      className={`border rounded-lg p-3 transition-all ${hasIssues ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{driver.name}</p>
            {driver.rating && (
              <span className="text-xs flex items-center text-yellow-500 font-bold">
                ★ {driver.rating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600">{driver.vehicle?.brand || 'Sin marca'} {driver.vehicle?.model || ''}</p>
          <p className="text-xs font-mono text-gray-500">{driver.vehicle?.plates || 'Sin placas'}</p>
        </div>

        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${driver.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
            {driver.online ? '🟢 Online' : '⚫ Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <StatusRow
          label="Estado"
          value={(driver.status === 'verified' || driver.status === 'active') ? 'Verificado' : driver.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
          isGood={driver.status === 'verified' || driver.status === 'active'}
        />

        <StatusRow
          label="Suscripción"
          value={driver.subscriptionActive ? 'Activa' : 'Vencida'}
          isGood={driver.subscriptionActive}
        />

        <StatusRow
          label="Stripe"
          value={driver.stripeChargesEnabled ? 'Habilitado' : 'No habilitado'}
          isGood={driver.stripeChargesEnabled}
        />

        <div className="flex justify-between pt-1 border-t border-gray-200">
          <span className="text-gray-500">Ubicación:</span>
          <span className="text-gray-700">{locationAge}</span>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {label}
    </button>
  );
}

function StatusRow({ label, value, isGood }: { label: string; value: string; isGood: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className={`font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </span>
    </div>
  );
}
