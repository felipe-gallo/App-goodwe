import type { Charger } from '../types';

const empsLogo = require('../../assets/emps-logo.jpeg');

export const mockChargers: Charger[] = [
  {
    id: 'emps-aclimacao',
    name: 'Eletroposto EMPS • Shell Aclimação',
    address: 'Av. da Aclimação, 11 — Aclimação, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5668182,
    longitude: -46.6331888,
    status: 'available',
    chargingType: 'Carga rápida DC',
    connectorType: 'CCS 2',
    powerKw: 60,
    availableConnectors: 4,
    totalConnectors: 6,
    distanceKm: 0.8,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Calibragem', 'Iluminação 24h'],
    description:
      'Hub urbano EMPS com carregadores rápidos e vagas exclusivas para veículos elétricos.',
  },
  {
    id: 'emps-pedra-azul',
    name: 'Eletroposto EMPS • Posto Pedra Azul',
    address: 'R. Pedra Azul, 670 — Aclimação, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5771693,
    longitude: -46.629042,
    status: 'available',
    chargingType: 'Carga AC e DC',
    connectorType: 'Tipo 2 · CCS 2',
    powerKw: 60,
    availableConnectors: 3,
    totalConnectors: 6,
    distanceKm: 1.1,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Banheiros', 'Área de espera'],
    description:
      'Eletroposto EMPS com recarga rápida e infraestrutura para permanências curtas.',
  },
  {
    id: 'emps-cambuci',
    name: 'Eletroposto EMPS • Shell Cambuci',
    address: 'Largo do Cambuci, 172 — Cambuci, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5636293,
    longitude: -46.6207264,
    status: 'available',
    chargingType: 'Carga ultrarrápida DC',
    connectorType: 'CCS 2',
    powerKw: 120,
    availableConnectors: 5,
    totalConnectors: 8,
    distanceKm: 1.5,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Cafeteria', 'Wi-Fi'],
    description:
      'Unidade de alta capacidade no eixo do Cambuci com monitoramento de ocupação.',
  },
  {
    id: 'emps-vila-monumento',
    name: 'Eletroposto EMPS • Posto Vila Monumento',
    address: 'Av. Dom Pedro I, 297 — Vila Monumento, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5677674,
    longitude: -46.6110009,
    status: 'available',
    chargingType: 'Carga rápida DC',
    connectorType: 'CCS 2',
    powerKw: 90,
    availableConnectors: 4,
    totalConnectors: 7,
    distanceKm: 2.2,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Lavagem', 'Área de espera'],
    description:
      'Eletroposto EMPS com sete posições e acesso direto pela Avenida Dom Pedro I.',
  },
  {
    id: 'emps-jardim-da-gloria',
    name: 'Eletroposto EMPS • Posto Xaranga',
    address: 'R. Coronel Diogo, 650 — Jardim da Glória, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5783287,
    longitude: -46.6216578,
    status: 'available',
    chargingType: 'Carga AC e DC',
    connectorType: 'Tipo 2 · CCS 2',
    powerKw: 60,
    availableConnectors: 3,
    totalConnectors: 6,
    distanceKm: 1.8,
    openingHours: '06:00 às 23:00',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Banheiros', 'Estacionamento coberto'],
    description:
      'Unidade de bairro com carregamento combinado e vagas cobertas para recarga.',
  },
  {
    id: 'emps-lins',
    name: 'Eletroposto EMPS • Ipiranga Jardim da Glória',
    address:
      'Av. Lins de Vasconcelos, 1.867 — Jardim da Glória, São Paulo — SP',
    image: empsLogo,
    latitude: -23.5798856,
    longitude: -46.624086,
    status: 'available',
    chargingType: 'Carga ultrarrápida DC',
    connectorType: 'CCS 2',
    powerKw: 120,
    availableConnectors: 5,
    totalConnectors: 8,
    distanceKm: 2,
    openingHours: '24 horas, todos os dias',
    operator: 'Rede EMPS',
    amenities: ['Conveniência', 'Cafeteria', 'Wi-Fi', 'Iluminação 24h'],
    description:
      'Hub EMPS de maior capacidade na região, preparado para recargas de alta potência.',
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
