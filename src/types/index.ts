import type {ImageSourcePropType} from 'react-native';

export type ChargerStatus = 'available' | 'in_use' | 'offline';
export type Charger = {id:string; name:string; address:string; image:ImageSourcePropType; latitude:number; longitude:number; status:ChargerStatus; chargingType:string; connectorType?:string; powerKw:number; chargerBatteryLevel:number; distanceKm?:number; description?:string};
export type PaymentMethod = 'Cartão'|'Pix'|'Carteira digital';
export type ChargingSummary = {battery:number; elapsedSeconds:number; energyKwh:number; stopped?:boolean};
export type RootStackParamList = {SignUp:undefined; Login:undefined; Map:undefined; ChargerDetails:{chargerId:string}; Camera:{chargerId:string}; Payment:{chargerId:string}; PaymentSuccess:{chargerId:string;method:PaymentMethod}; ChargingSession:{chargerId:string}; ChargingComplete:{chargerId:string;summary:ChargingSummary}};
