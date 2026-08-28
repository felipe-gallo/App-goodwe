export type TariffPeriod = 'offPeak' | 'intermediate' | 'peak';

export type TariffBreakdown = {
  period: TariffPeriod;
  periodLabel: string;
  pricePerKwh: number;
  energyKwh: number;
  energySubtotal: number;
  activationFee: number;
  idleMinutes?: number;
  billableIdleMinutes: number;
  idleFee: number;
  total: number;
};

export const tariffConfig = {
  periods: {
    offPeak: { label: 'Fora de ponta', pricePerKwh: 1.59 },
    intermediate: { label: 'Intermediário', pricePerKwh: 1.89 },
    peak: { label: 'Ponta', pricePerKwh: 2.19 },
  },
  activationFee: 2,
  activationWaiverSubtotal: 20,
  idleGraceMinutes: 15,
  idleFeePerMinute: 0.5,
  estimateNotice:
    'Valores estimados e sujeitos a variação conforme o local e a distribuidora.',
} as const;

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export const getTariffPeriod = (date = new Date()): TariffPeriod => {
  const day = date.getDay();
  const hour = date.getHours();

  if (day === 0 || day === 6) return 'offPeak';
  if (hour === 17 || hour === 21) return 'intermediate';
  if (hour >= 18 && hour <= 20) return 'peak';
  return 'offPeak';
};

export const calculateTariff = (
  energyKwh: number,
  idleMinutes: number | undefined = undefined,
  date = new Date(),
): TariffBreakdown => {
  const period = getTariffPeriod(date);
  const periodConfig = tariffConfig.periods[period];
  const normalizedEnergy = Math.max(0, energyKwh);
  const normalizedIdleMinutes =
    idleMinutes === undefined ? undefined : Math.max(0, idleMinutes);
  const rawEnergySubtotal = normalizedEnergy * periodConfig.pricePerKwh;
  const energySubtotal = roundCurrency(rawEnergySubtotal);
  const activationFee =
    energySubtotal >= tariffConfig.activationWaiverSubtotal
      ? 0
      : tariffConfig.activationFee;
  const billableIdleMinutes = Math.max(
    0,
    (normalizedIdleMinutes ?? 0) - tariffConfig.idleGraceMinutes,
  );
  const idleFee = roundCurrency(
    billableIdleMinutes * tariffConfig.idleFeePerMinute,
  );

  return {
    period,
    periodLabel: periodConfig.label,
    pricePerKwh: periodConfig.pricePerKwh,
    energyKwh: normalizedEnergy,
    energySubtotal,
    activationFee,
    idleMinutes: normalizedIdleMinutes,
    billableIdleMinutes,
    idleFee,
    total: roundCurrency(energySubtotal + activationFee + idleFee),
  };
};
