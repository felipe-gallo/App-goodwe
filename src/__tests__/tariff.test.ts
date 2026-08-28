import {
  calculateTariff,
  getTariffPeriod,
  tariffConfig,
} from '../constants/tariff';

const weekdayAt = (hour: number, minute = 0) =>
  new Date(2026, 7, 24, hour, minute);

describe('tarifação EMPS', () => {
  it('classifica todos os períodos nos dias úteis', () => {
    expect(getTariffPeriod(weekdayAt(16, 59))).toBe('offPeak');
    expect(getTariffPeriod(weekdayAt(17))).toBe('intermediate');
    expect(getTariffPeriod(weekdayAt(17, 59))).toBe('intermediate');
    expect(getTariffPeriod(weekdayAt(18))).toBe('peak');
    expect(getTariffPeriod(weekdayAt(20, 59))).toBe('peak');
    expect(getTariffPeriod(weekdayAt(21))).toBe('intermediate');
    expect(getTariffPeriod(weekdayAt(21, 59))).toBe('intermediate');
    expect(getTariffPeriod(weekdayAt(22))).toBe('offPeak');
  });

  it('usa sempre a tarifa fora de ponta nos fins de semana', () => {
    const saturdayAtPeakHour = new Date(2026, 7, 29, 19);
    const sundayAtIntermediateHour = new Date(2026, 7, 30, 21);
    expect(getTariffPeriod(saturdayAtPeakHour)).toBe('offPeak');
    expect(getTariffPeriod(sundayAtIntermediateHour)).toBe('offPeak');
  });

  it.each([
    [16, 1.59, 63.6],
    [17, 1.89, 75.6],
    [19, 2.19, 87.6],
  ])(
    'calcula 40 kWh no horário %ih com tarifa %f',
    (hour, pricePerKwh, subtotal) => {
      const result = calculateTariff(40, 0, weekdayAt(hour));
      expect(result.pricePerKwh).toBe(pricePerKwh);
      expect(result.energySubtotal).toBe(subtotal);
      expect(result.activationFee).toBe(0);
      expect(result.total).toBe(subtotal);
    },
  );

  it('cobra ativação quando o subtotal fica abaixo de R$ 20,00', () => {
    const result = calculateTariff(10, 0, weekdayAt(10));
    expect(result.energySubtotal).toBe(15.9);
    expect(result.activationFee).toBe(2);
    expect(result.total).toBe(17.9);
  });

  it('isenta a ativação quando o subtotal é igual ou superior a R$ 20,00', () => {
    const exactThresholdEnergy =
      tariffConfig.activationWaiverSubtotal /
      tariffConfig.periods.offPeak.pricePerKwh;
    const result = calculateTariff(
      exactThresholdEnergy,
      0,
      weekdayAt(10),
    );
    expect(result.energySubtotal).toBe(20);
    expect(result.activationFee).toBe(0);
  });

  it('aplica ociosidade somente após os 15 minutos de tolerância', () => {
    const withoutIdleInformation = calculateTariff(
      10,
      undefined,
      weekdayAt(10),
    );
    expect(withoutIdleInformation.idleMinutes).toBeUndefined();
    expect(withoutIdleInformation.idleFee).toBe(0);
    expect(calculateTariff(10, 14, weekdayAt(10)).idleFee).toBe(0);
    expect(calculateTariff(10, 15, weekdayAt(10)).idleFee).toBe(0);
    expect(calculateTariff(10, 16, weekdayAt(10)).idleFee).toBe(0.5);
    expect(calculateTariff(10, 25, weekdayAt(10)).idleFee).toBe(5);
  });
});
