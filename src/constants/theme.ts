export const colors = {
  primary: '#e30620',
  primaryDark: '#a90016',
  primarySoft: '#44242a',
  ink: '#f4f6f8',
  inkSoft: '#d5dbe0',
  muted: '#aab3bb',
  surface: '#292e34',
  surfaceRaised: '#333940',
  background: '#1c2025',
  green: '#4fd18b',
  greenSoft: '#203e31',
  amber: '#f0ad4e',
  amberSoft: '#463821',
  gray: '#929ba4',
  border: '#414850',
  mapPanel: '#171b20',
};

export const chargingConfig = {
  initialBattery: 35,
  targetBattery: 80,
  durationSeconds: 24,
  estimatedMinutes: 45,
};

// Preencha este campo quando a tarifa oficial da EMPS for informada.
export const energyPricePerKwh: number | null = null;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const formatEnergyPrice = () =>
  energyPricePerKwh === null
    ? 'Tarifa em atualização'
    : `${formatCurrency(energyPricePerKwh)} / kWh`;
