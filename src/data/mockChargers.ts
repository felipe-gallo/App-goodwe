import type { Charger } from '../types';

const empsLogo = require('../../assets/emps-logo.jpeg');

export const mockChargers: Charger[] = [
  {
    id: 'emps-paulista',
    name: 'EMPS Paulista',
    address: 'Av. Paulista, 1.578 — Bela Vista, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5613,
    longitude: -46.6565,
    status: 'available',
    chargingType: 'Carga AC',
    connectorType: 'Tipo 2',
    powerKw: 22,
    availableConnectors: 3,
    totalConnectors: 4,
    distanceKm: 1.2,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Estacionamento', 'Cafeteria', 'Wi-Fi'],
    description:
      'Eletroposto de acesso público com monitoramento de disponibilidade em tempo real.',
  },
  {
    id: 'emps-ibirapuera',
    name: 'EMPS Ibirapuera',
    address: 'Av. Pedro Álvares Cabral, s/n — Vila Mariana, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5874,
    longitude: -46.6576,
    status: 'in_use',
    chargingType: 'Carga rápida DC',
    connectorType: 'CCS 2',
    powerKw: 60,
    availableConnectors: 0,
    totalConnectors: 2,
    distanceKm: 3.8,
    openingHours: '06:00 às 23:00',
    operator: 'Rede EMPS',
    amenities: ['Estacionamento', 'Parque', 'Iluminação 24h'],
    description:
      'Eletroposto de carga rápida com duas vagas exclusivas para veículos elétricos.',
  },
  {
    id: 'emps-vila-madalena',
    name: 'EMPS Vila Madalena',
    address: 'R. Harmonia, 797 — Vila Madalena, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5502,
    longitude: -46.6918,
    status: 'offline',
    chargingType: 'Carga AC',
    connectorType: 'Tipo 2',
    powerKw: 11,
    availableConnectors: 0,
    totalConnectors: 2,
    distanceKm: 5.4,
    openingHours: '07:00 às 22:00',
    operator: 'Rede EMPS',
    amenities: ['Estacionamento coberto', 'Conveniência'],
    description:
      'Eletroposto temporariamente indisponível para manutenção preventiva.',
  },
];

export const findCharger = (id: string) =>
  mockChargers.find(charger => charger.id === id);

export const searchChargers = (term: string) => {
  const query = term.trim().toLocaleLowerCase('pt-BR');
  return query
    ? mockChargers.filter(charger =>
        `${charger.name} ${charger.address} ${charger.connectorType}`
          .toLocaleLowerCase('pt-BR')
          .includes(query),
      )
    : mockChargers;
};
