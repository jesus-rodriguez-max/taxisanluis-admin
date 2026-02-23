import { useAuth } from '@/hooks/useAuth';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';

function App() {
  const { user, loading, isAdmin } = useAuth();

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <Login />;
  }

  // Usuario autenticado pero NO es admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            Lo sentimos, tu cuenta no tiene permisos de administrador para acceder a este panel.
          </p>
          <div className="text-sm text-gray-500 border-t pt-4">
            <p className="mb-2">Usuario autenticado:</p>
            <p className="font-mono bg-gray-50 px-2 py-1 rounded">{user.email}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Intentar recargar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado y es admin
  return <Dashboard />;
}

export default App;
