import { AlertTriangle, XCircle, Info } from 'lucide-react';
import type { Alert } from '@/types';

interface AlertsPanelProps {
  alerts: Alert[];
  onSelectTrip?: (tripId: string) => void;
}

export function AlertsPanel({ alerts, onSelectTrip }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-700 font-medium">✓ Todo operando normalmente</p>
      </div>
    );
  }

  // Ordenar por tipo: danger > warning > info
  const sortedAlerts = [...alerts].sort((a, b) => {
    const order = { danger: 0, warning: 1, info: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm text-gray-700 mb-2">
        🚨 Alertas Activas ({alerts.length})
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedAlerts.map((alert) => (
          <AlertCard 
            key={alert.id} 
            alert={alert}
            onClick={() => {
              if (alert.tripId && onSelectTrip) {
                onSelectTrip(alert.tripId);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

function AlertCard({ alert, onClick }: AlertCardProps) {
  const config = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const { bg, border, text, icon: Icon, iconColor } = config[alert.type];

  return (
    <div
      className={`${bg} border ${border} rounded-lg p-3 ${onClick ? 'cursor-pointer hover:opacity-75' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={18} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${text}`}>{alert.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {alert.timestamp.toLocaleTimeString('es-MX')}
          </p>
        </div>
      </div>
    </div>
  );
}
