import { useState } from 'react';
import { X, User, FileText, Clock, Star, AlertTriangle, Car } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Driver } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DriverDetailPanelProps {
    driver: Driver & { id: string };
    onClose: () => void;
}

export function DriverDetailPanel({ driver, onClose }: DriverDetailPanelProps) {
    const [activeTab, setActiveTab] = useState<'summary' | 'documents' | 'history'>('summary');

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                            <AvatarImage src={driver.photoUrl} alt={driver.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">
                                {driver.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{driver.name}</h2>
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${driver.online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {driver.online ? '🟢 Online' : '⚫ Offline'}
                                </span>
                                <span className="flex items-center text-yellow-500 font-bold">
                                    <Star size={14} className="fill-current mr-1" />
                                    {driver.rating?.toFixed(1) || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500 uppercase">Viajes</p>
                        <p className="font-bold text-gray-900">{driver.totalTrips || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500 uppercase">Aceptación</p>
                        <p className="font-bold text-gray-900">{driver.acceptanceRate || 0}%</p>
                    </div>
                    <div className="bg-white p-2 rounded border">
                        <p className="text-xs text-gray-500 uppercase">Antigüedad</p>
                        <p className="font-bold text-gray-900">
                            {driver.createdAt ? format((driver.createdAt as any).toDate(), 'MMM yyyy', { locale: es }) : '-'}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-6 border-b border-gray-200">
                    <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<User size={16} />} label="Resumen" />
                    <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<FileText size={16} />} label="Documentos" />
                    <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Clock size={16} />} label="Historial" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {activeTab === 'summary' && <SummaryTab driver={driver} />}
                {activeTab === 'documents' && <DocumentsTab driver={driver} />}
                {activeTab === 'history' && <HistoryTab driver={driver} />}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">
                    Ver todos los viajes
                </button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                    Mensaje
                </button>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            {icon} {label}
        </button>
    );
}

function SummaryTab({ driver }: { driver: Driver }) {
    return (
        <div className="space-y-6">
            <Section title="Estado Operativo">
                <InfoRow label="Suscripción" value={driver.subscriptionActive ? 'Activa' : 'Vencida'} isGood={driver.subscriptionActive} />
                <InfoRow label="Stripe" value={driver.stripeChargesEnabled ? 'Habilitado' : 'Pendiente'} isGood={driver.stripeChargesEnabled} />
                <InfoRow label="Teléfono" value={driver.phone} />
                <InfoRow label="Email" value={driver.email} />
            </Section>

            <Section title="Vehículo">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                        <Car size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{driver.vehicle?.brand} {driver.vehicle?.model}</p>
                        <p className="text-sm text-gray-500 font-mono mt-1">{driver.vehicle?.plates}</p>
                        <p className="text-xs text-gray-400 mt-1">Color: {driver.vehicle?.color || 'No especificado'}</p>
                    </div>
                </div>
            </Section>
        </div>
    );
}

function DocumentsTab({ driver }: { driver: Driver }) {
    const docs = driver.documents || {};

    const getStatusColor = (expiresAt?: any) => {
        if (!expiresAt) return 'border-gray-200';
        try {
            const date = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
            const now = Date.now();
            const daysLeft = Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24));
            if (daysLeft < 15) return 'border-red-500 ring-1 ring-red-500';
            if (daysLeft < 30) return 'border-yellow-500 ring-1 ring-yellow-500';
            return 'border-green-500 ring-1 ring-green-500';
        } catch (e) { return 'border-gray-200'; }
    };

    const formatDate = (expiresAt?: any) => {
        if (!expiresAt) return 'Sin fecha';
        try {
            const date = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
            return format(date, 'dd MMM yyyy', { locale: es });
        } catch (e) { return 'Fecha inválida'; }
    };

    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Revise cuidadosamente las fechas de vencimiento. Los documentos vencidos suspenden automáticamente la cuenta.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <DocumentCard
                    title="Licencia SCT"
                    url={docs.sctLicense?.photoUrl}
                    expiration={formatDate(docs.sctLicense?.expiresAt)}
                    borderColor={getStatusColor(docs.sctLicense?.expiresAt)}
                />
                <DocumentCard
                    title="Tarjetón Vehicular"
                    url={docs.vehicleCard?.photoUrl}
                    expiration={formatDate(docs.vehicleCard?.expiresAt)}
                    borderColor={getStatusColor(docs.vehicleCard?.expiresAt)}
                />
                <DocumentCard
                    title="Póliza de Seguro"
                    url={docs.insurance?.photoUrl}
                    expiration={formatDate(docs.insurance?.expiresAt)}
                    borderColor={getStatusColor(docs.insurance?.expiresAt)}
                />
            </div>
        </div>
    );
}

function DocumentCard({ title, url, expiration, borderColor }: { title: string; url?: string; expiration: string; borderColor: string }) {
    return (
        <div className={`bg-white rounded-lg p-3 border shadow-sm transition-all ${borderColor}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm text-gray-700">{title}</span>
                <span className="text-xs text-gray-500">{expiration}</span>
            </div>
            {url ? (
                <div className="h-32 bg-gray-100 rounded overflow-hidden">
                    <img src={url} alt={title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400 border border-dashed">
                    <span className="text-xs">No disponible</span>
                </div>
            )}
        </div>
    )
}

function HistoryTab({ driver }: { driver: Driver }) {
    return (
        <div className="space-y-6">
            <Section title="Suscripciones Recientes">
                {driver.subscriptionDetails?.paymentHistory?.length ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                        {driver.subscriptionDetails.paymentHistory.slice(0, 5).map((payment, idx) => (
                            <div key={idx} className="flex justify-between p-3 border-b last:border-0 text-sm">
                                <span className="text-gray-600">{format((payment.date as any).toDate(), 'dd MMM', { locale: es })}</span>
                                <span className="font-mono">${payment.amount}</span>
                                <span className={`capitalize ${payment.status === 'paid' ? 'text-green-600' : 'text-red-500'}`}>{payment.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No hay historial de pagos.</p>
                )}
            </Section>
        </div>
    )
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function InfoRow({ label, value, isGood }: { label: string; value: string; isGood?: boolean }) {
    return (
        <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className={`font-medium text-sm ${isGood === true ? 'text-green-600' : isGood === false ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
}
