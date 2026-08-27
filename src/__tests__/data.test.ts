import { findCharger, searchChargers } from '../data/mockChargers';
import { formatEnergyPrice } from '../constants/theme';
import { simulationAt } from '../hooks/useChargingSimulation';

describe('dados da rede EMPS', () => {
  it('pesquisa por nome, endereço e conector', () => {
    expect(searchChargers('Paulista')).toHaveLength(1);
    expect(searchChargers('EMPS')).toHaveLength(3);
    expect(searchChargers('CCS 2')).toHaveLength(1);
    expect(searchChargers('inexistente')).toEqual([]);
  });

  it('mantém informações operacionais consistentes', () => {
    const charger = findCharger('emps-paulista');
    expect(charger?.powerKw).toBe(22);
    expect(charger?.availableConnectors).toBeLessThanOrEqual(
      charger?.totalConnectors ?? 0,
    );
  });

  it('mantém a tarifa sinalizada enquanto aguarda o valor oficial', () => {
    expect(formatEnergyPrice()).toBe('Tarifa em atualização');
  });

  it('calcula bateria, tempo e energia dentro dos limites', () => {
    const start = simulationAt(0, 22);
    const middle = simulationAt(12, 22);
    const end = simulationAt(99, 22);
    expect(start.battery).toBe(35);
    expect(middle.battery).toBeGreaterThan(start.battery);
    expect(middle.remainingMinutes).toBeLessThan(start.remainingMinutes);
    expect(middle.energyKwh).toBeGreaterThan(0);
    expect(end.battery).toBe(80);
    expect(end.remainingMinutes).toBe(0);
    expect(end.status).toBe('completed');
  });
});
