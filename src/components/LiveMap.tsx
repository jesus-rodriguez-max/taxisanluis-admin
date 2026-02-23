import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Driver, Trip } from '@/types';

// Solucionar problema de iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icono para conductores online
const driverOnlineIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="3"/>
      <text x="16" y="21" font-size="16" text-anchor="middle" fill="white">🚕</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Icono para conductores offline
const driverOfflineIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#6b7280" stroke="white" stroke-width="3"/>
      <text x="16" y="21" font-size="16" text-anchor="middle" fill="white">🚕</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Icono para pickup
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Icono para destination
const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface MapProps {
  drivers: (Driver & { id: string })[];
  trips: (Trip & { id: string })[];
  selectedTrip?: string | null;
}

// Componente para auto-centrar el mapa
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function LiveMap({ drivers, trips, selectedTrip }: MapProps) {
  // Centro en San Luis Potosí
  const defaultCenter: [number, number] = [22.1565, -100.9855];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterController center={defaultCenter} />

        {/* MOSTRAR CONDUCTORES */}
        {drivers.map((driver) => {
          if (!driver.location || typeof driver.location.lat !== 'number' || typeof driver.location.lng !== 'number') return null;
          return (
            <Marker
              key={driver.id}
              position={[driver.location.lat, driver.location.lng]}
              icon={driver.online ? driverOnlineIcon : driverOfflineIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{driver.name}</p>
                  <p className="text-xs text-gray-600">{driver.vehicle?.brand} {driver.vehicle?.model}</p>
                  <p className="text-xs">{driver.vehicle?.plates}</p>
                  <p className={`text-xs font-semibold ${driver.online ? 'text-green-600' : 'text-gray-500'}`}>
                    {driver.online ? '🟢 Online' : '⚫ Offline'}
                  </p>
                  <p className={`text-xs ${driver.subscriptionActive ? 'text-green-600' : 'text-red-600'}`}>
                    {driver.subscriptionActive ? '✓ Suscripción activa' : '✗ Suscripción vencida'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* MOSTRAR VIAJES ACTIVOS */}
        {trips.map((trip) => {
          const isSelected = selectedTrip === trip.id;
          if (!trip.pickup || !trip.destination ||
            typeof trip.pickup.lat !== 'number' || typeof trip.pickup.lng !== 'number' ||
            typeof trip.destination.lat !== 'number' || typeof trip.destination.lng !== 'number') {
            return null;
          }

          return (
            <div key={trip.id}>
              {/* Pickup marker */}
              <Marker position={[trip.pickup.lat, trip.pickup.lng]} icon={pickupIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-blue-600">Origen</p>
                    <p className="text-xs">{trip.pickup?.address || 'Sin dirección'}</p>
                    <p className="text-xs text-gray-500">Viaje: {trip.id.slice(0, 8)}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Destination marker */}
              <Marker position={[trip.destination.lat, trip.destination.lng]} icon={destinationIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-red-600">Destino</p>
                    <p className="text-xs">{trip.destination?.address || 'Sin dirección'}</p>
                    <p className="text-xs text-gray-500">Viaje: {trip.id.slice(0, 8)}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Línea de ruta */}
              <Polyline
                positions={[
                  [trip.pickup.lat, trip.pickup.lng],
                  [trip.destination.lat, trip.destination.lng],
                ]}
                color={isSelected ? '#f59e0b' : '#3b82f6'}
                weight={isSelected ? 4 : 2}
                opacity={isSelected ? 1 : 0.5}
              />
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
