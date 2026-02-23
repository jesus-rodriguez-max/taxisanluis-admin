import { Timestamp } from 'firebase/firestore';

// TIPOS DE DATOS según la estructura real de Firestore

export interface Driver {
  uid: string;
  name: string;
  phone: string;
  email: string;
  status: 'verified' | 'active' | 'inactive' | 'suspended';
  online: boolean;
  stripeAccountId: string | null;
  stripeStatus: 'pending' | 'verified' | 'restricted';
  stripeChargesEnabled: boolean;
  stripeDetailsSubmitted: boolean;
  subscriptionActive: boolean;
  subscriptionExpiresAt: Timestamp | null;
  location: {
    lat: number;
    lng: number;
    updatedAt: Timestamp;
  };
  vehicle: {
    brand: string;
    model: string;
    plates: string;
    color?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // New fields for Detailed View
  photoUrl?: string;
  rating?: number;
  totalTrips?: number;
  acceptanceRate?: number;
  cancellationRate?: number;
  avgArrivalTime?: number;
  documents?: {
    sctLicense?: { photoUrl?: string; expiresAt?: Timestamp | null };
    vehicleCard?: { photoUrl?: string; expiresAt?: Timestamp | null };
    insurance?: { photoUrl?: string; expiresAt?: Timestamp | null };
  };
  subscriptionDetails?: {
    status: 'active' | 'expired' | 'suspended';
    nextPaymentDate?: Timestamp | null;
    paymentHistory?: Array<{
      date: Timestamp;
      amount: number;
      status: 'paid' | 'pending' | 'rejected';
    }>;
  };
}

export interface Passenger {
  name: string;
  phone: string;
  email: string;
  fcmToken: string;
  createdAt: Timestamp;
}

export type TripStatus =
  | 'pending'
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'started'
  | 'completed'
  | 'cancelled';

export interface Trip {
  passengerId: string;
  driverId: string | null;
  status: TripStatus;
  paymentMethod: 'cash';
  pickup: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  fareEstimated: number;
  fareFinal: number | null;
  fareBreakdown?: {
    base: number;
    distance: number;
    time: number;
    surge: number;
  };
  rating?: {
    passenger?: number; // Calificación dada por el conductor al pasajero
    driver?: number; // Calificación dada por el pasajero al conductor
    passengerComment?: string;
    driverComment?: string;
  };
  createdAt: Timestamp;
  acceptedAt: Timestamp | null;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
}

// Tipos para el panel
export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  tripId?: string;
  driverId?: string;
  message: string;
  timestamp: Date;
}

export interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  onlineDrivers: number;
  withValidSubscription: number;
  withStripeIssues: number;
}

export interface TripStats {
  requested: number;
  inProgress: number;
  completedToday: number;
}
