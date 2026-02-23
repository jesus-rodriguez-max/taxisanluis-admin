import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Trip, Driver } from '@/types';

interface TripsListProps {
  trips: (Trip & { id: string })[];
  drivers: (Driver & { id: string })[];
  selectedTrip?: string | null;
  onSelectTrip: (tripId: string) => void;
}

export function TripsList({ trips, drivers, selectedTrip, onSelectTrip }: TripsListProps) {
  if (trips.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No hay viajes activos</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      <h3 className="font-bold text-sm text-gray-700 mb-2">
        Viajes Activos ({trips.length})
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {trips.map((trip) => {
          const driver = trip.driverId ? drivers.find((d) => d.id === trip.driverId) : null;

          return (
            <TripCard
              key={trip.id}
              trip={trip}
              driver={driver}
              isSelected={selectedTrip === trip.id}
              onClick={() => onSelectTrip(trip.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TripCardProps {
  trip: Trip & { id: string };
  driver?: (Driver & { id: string }) | null;
  isSelected: boolean;
  onClick: () => void;
}

function TripCard({ trip, driver, isSelected, onClick }: TripCardProps) {
  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-blue-100 text-blue-800' },
    requested: { label: 'Solicitado', color: 'bg-blue-100 text-blue-800' },
    accepted: { label: 'Aceptado', color: 'bg-green-100 text-green-800' },
    on_the_way: { label: 'En camino', color: 'bg-yellow-100 text-yellow-800' },
    arrived: { label: 'Llegó', color: 'bg-purple-100 text-purple-800' },
    started: { label: 'Iniciado', color: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Completado', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  };

  const { label, color } = statusConfig[trip.status];

  const timeAgo = trip.createdAt
    ? formatDistanceToNow(trip.createdAt.toDate(), { addSuffix: true, locale: es })
    : 'Hace un momento';

  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-xs font-mono text-gray-500">ID: {trip.id.slice(0, 8)}</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${color}`}>
            {label}
          </span>
        </div>
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>

      {driver && (
        <div className="text-sm mb-2">
          <p className="font-semibold">🚕 {driver.name}</p>
          <p className="text-xs text-gray-600">
            {driver.vehicle?.brand || 'Sin marca'} - {driver.vehicle?.plates || 'Sin placas'}
          </p>
        </div>
      )}

      <div className="text-xs space-y-1">
        <div className="flex items-start gap-1">
          <span className="text-blue-600">📍</span>
          <p className="flex-1 text-gray-700 line-clamp-1">{trip.pickup?.address || 'Sin dirección'}</p>
        </div>
        <div className="flex items-start gap-1">
          <span className="text-red-600">🎯</span>
          <p className="flex-1 text-gray-700 line-clamp-1">{trip.destination?.address || 'Sin dirección'}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs font-semibold text-gray-700">
          Tarifa: ${typeof trip.fareEstimated === 'number' ? trip.fareEstimated.toFixed(2) : '0.00'} MXN
        </p>

        {(trip.status === 'pending' || trip.status === 'requested') && (
          <span className="text-xs text-red-600 font-semibold animate-pulse">
            ⚠️ Sin conductor
          </span>
        )}
      </div>
    </div>
  );
}
