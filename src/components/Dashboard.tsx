import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LiveMap } from '@/components/LiveMap';
// import { StatsPanel } from '@/components/StatsPanel'; 
import { AlertsPanel } from '@/components/AlertsPanel';
import { TripsList } from '@/components/TripsList';
import { DriversList } from '@/components/DriversList';
import { PassengersList } from '@/components/PassengersList';
import { useDrivers, useOnlineDrivers } from '@/hooks/useDrivers';
import { useActiveTrips } from '@/hooks/useTrips';
import { useAlerts } from '@/hooks/useAlerts';
import { usePassengers } from '@/hooks/usePassengers';
import { DriverDetailPanel } from '@/components/DriverDetailPanel';
import { LogOut, Menu, MapPin, Car, Users, Route, Settings } from 'lucide-react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabButton = ({ active, onClick, label, icon, collapsed, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors relative
        ${active ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        ${collapsed ? 'justify-center' : ''}
      `}
    title={label}
  >
    {icon && <span className={`${collapsed ? '' : 'mr-2'}`}>{icon}</span>}
    <span className={`${collapsed ? 'hidden lg:block' : 'block'} flex-1 text-left`}>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        } ${collapsed ? 'hidden lg:block' : ''}`}>
        {badge}
      </span>
    )}
  </button>
);
export function Dashboard() {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'drivers' | 'passengers' | 'trips' | 'settings'>('monitor');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null); // Added state


  // Cargar datos en tiempo real
  // Cargar datos en tiempo real
  const { drivers } = useDrivers();
  const { onlineDrivers } = useOnlineDrivers();
  const { trips } = useActiveTrips();
  // const { requestedTrips } = useRequestedTrips(); // Unused
  const { alerts } = useAlerts(drivers, trips);
  const { passengers } = usePassengers();

  const selectedDriver = drivers.find(d => d.id === selectedDriverId); // Derived state

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // ELIMINADO: Bloqueo de carga total.
  // if (loadingDrivers || loadingTrips) { ... }
  // Ahora permitimos que la UI cargue y mostramos spinners locales donde sea necesario.

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Driver Detail Panel */}
      {selectedDriver && (
        <DriverDetailPanel
          driver={selectedDriver}
          onClose={() => setSelectedDriverId(null)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-30
        w-64 h-full bg-white border-r border-gray-200 shadow-lg md:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-blue-600 text-white">
            <div className={`flex items-center gap-2 font-bold transition-all ${!sidebarOpen ? 'md:hidden lg:flex' : ''}`}>
              <span className="text-xl">🚖 Taxi San Luis</span>
            </div>
            {!sidebarOpen && <span className="hidden md:block lg:hidden text-xl">🚕</span>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            <TabButton
              active={activeTab === 'monitor'}
              onClick={() => setActiveTab('monitor')}
              label="Monitor en Vivo"
              icon={<MapPin size={20} />}
              collapsed={!sidebarOpen}
            />
            <TabButton
              active={activeTab === 'drivers'}
              onClick={() => setActiveTab('drivers')}
              label="Conductores"
              icon={<Car size={20} />}
              collapsed={!sidebarOpen}
            />
            <TabButton
              active={activeTab === 'passengers'}
              onClick={() => setActiveTab('passengers')}
              label="Pasajeros"
              icon={<Users size={20} />}
              collapsed={!sidebarOpen}
              badge={passengers.length}
            />
            <TabButton
              active={activeTab === 'trips'}
              onClick={() => setActiveTab('trips')}
              label="Viajes"
              icon={<Route size={20} />}
              collapsed={!sidebarOpen}
            />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <TabButton
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
                label="Configuración"
                icon={<Settings size={20} />}
                collapsed={!sidebarOpen}
              />
            </div>
          </nav>

          {/* Footer User Profile */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
              title="Cerrar Sessión"
            >
              <LogOut size={20} />
              <span className={`${!sidebarOpen ? 'hidden lg:block' : 'block'}`}>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === 'monitor' && 'Monitor de Flota'}
            {activeTab === 'drivers' && 'Gestión de Conductores'}
            {activeTab === 'passengers' && 'Directorio de Pasajeros'}
            {activeTab === 'trips' && 'Historial de Viajes'}
            {activeTab === 'settings' && 'Configuración del Sistema'}
          </h1>

          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'monitor' && (
            <div className="absolute inset-0 flex">
              <div className="flex-1 relative z-0">
                <LiveMap drivers={onlineDrivers} trips={trips} selectedTrip={selectedTrip} />

                {/* Stats Overlay */}
                <div className="absolute top-4 left-4 z-[400] w-64 space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Resumen en Vivo</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-2 rounded border border-green-100">
                        <p className="text-xs text-green-700">Online</p>
                        <p className="font-bold text-green-900 text-lg">{drivers.filter(d => d.isOnline).length}</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded border border-blue-100">
                        <p className="text-xs text-blue-700">Viajes</p>
                        <p className="font-bold text-blue-900 text-lg">{trips.length}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Total Conductores: {drivers.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Right (Trips & Alerts) */}
              <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
                <div className="flex-1 overflow-y-auto">
                  <AlertsPanel alerts={alerts} onSelectTrip={setSelectedTrip} />
                  <TripsList
                    trips={trips}
                    drivers={drivers}
                    selectedTrip={selectedTrip}
                    onSelectTrip={setSelectedTrip}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="h-full overflow-y-auto bg-gray-50 p-4">
              <DriversList
                drivers={drivers}
                onSelectDriver={(id) => setSelectedDriverId(id)}
              />
            </div>
          )}

          {activeTab === 'passengers' && (
            <PassengersList passengers={passengers} />
          )}

          {activeTab === 'trips' && (
            <div className="h-full overflow-y-auto bg-gray-50 p-4">
              <TripsList
                trips={trips} // Debería usar TripsHistory aquí en el futuro
                drivers={drivers}
                selectedTrip={selectedTrip}
                onSelectTrip={setSelectedTrip}
              />
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                Nota: Esta vista muestra viajes activos. Para historial completo, se implementará consulta a base de datos.
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8 text-center text-gray-500">
              <Settings size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">Configuración</h3>
              <p>Próximamente: tarifas, zonas, y gestión de administradores.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


