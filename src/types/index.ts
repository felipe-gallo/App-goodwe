import type { ImageSourcePropType } from 'react-native';

export type ChargerStatus = 'available' | 'in_use' | 'offline';

export type Charger = {
  id: string;
  name: string;
  address: string;
  image: ImageSourcePropType;
  latitude: number;
  longitude: number;
  status: ChargerStatus;
  chargingType: string;
  connectorType: string;
  powerKw: number;
  availableConnectors: number;
  totalConnectors: number;
  distanceKm?: number;
  openingHours: string;
  operator: string;
  amenities: string[];
  description: string;
};

export type PaymentMethod = 'Cartão' | 'Pix' | 'Carteira digital';
export type ChargingPlan = 'fast' | 'full';
export type ChargingSummary = {
  battery: number;
  elapsedSeconds: number;
  energyKwh: number;
  plan: ChargingPlan;
  stopped?: boolean;
};
export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Map: undefined;
  ChargerDetails: { chargerId: string };
  Camera: { chargerId: string };
  ChargingMode: { chargerId: string };
  Payment: { chargerId: string; plan: ChargingPlan };
  PaymentSuccess: {
    chargerId: string;
    method: PaymentMethod;
    plan: ChargingPlan;
  };
  ChargingSession: { chargerId: string; plan: ChargingPlan };
  ChargingComplete: { chargerId: string; summary: ChargingSummary };
};
