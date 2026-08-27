export const colors = {
  primary: '#e30620',
  primaryDark: '#a90016',
  primarySoft: '#fff0f2',
  ink: '#121820',
  inkSoft: '#27313c',
  muted: '#66727d',
  surface: '#ffffff',
  background: '#f3f5f7',
  green: '#14824a',
  greenSoft: '#e9f7ef',
  amber: '#ad6500',
  amberSoft: '#fff5e3',
  gray: '#7d8790',
  border: '#dfe4e8',
  mapPanel: '#111820',
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
