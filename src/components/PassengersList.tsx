import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Passenger } from '@/types';

interface PassengersListProps {
    passengers: (Passenger & { id: string })[];
}

export function PassengersList({ passengers }: PassengersListProps) {
    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-700">
                    Pasajeros Registrados ({passengers.length})
                </h3>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {passengers.map((passenger) => (
                            <tr key={passenger.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {passenger.name ? passenger.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{passenger.name || 'Sin nombre'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{passenger.email}</div>
                                    <div className="text-sm text-gray-500">{passenger.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {passenger.createdAt ? (
                                        // Handle Timestamp or Date
                                        (passenger.createdAt as any).toDate ?
                                            format((passenger.createdAt as any).toDate(), 'dd MMM yyyy', { locale: es }) :
                                            'Fecha desconocida'
                                    ) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                                    {passenger.id.slice(0, 8)}...
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {passengers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No hay pasajeros registrados aún.
                    </div>
                )}
            </div>
        </div>
    );
}
