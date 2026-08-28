import { findCharger, searchChargers } from '../data/mockChargers';
import { formatEnergyPrice } from '../constants/theme';
import { sessionAt } from '../hooks/useChargingSession';

describe('dados da rede EMPS', () => {
  it('pesquisa por nome, endereço e conector', () => {
    expect(searchChargers('Aclimação')).toHaveLength(3);
    expect(searchChargers('EMPS')).toHaveLength(8);
    expect(searchChargers('GoodWe HCA G2')).toHaveLength(8);
    expect(searchChargers('GW22K-HCA-20')).toHaveLength(8);
    expect(searchChargers('Tipo 2')).toHaveLength(8);
    expect(searchChargers('inexistente')).toEqual([]);
  });

  it('mantém informações operacionais consistentes', () => {
    const charger = findCharger('emps-cambuci');
    const paulaNey = findCharger('emps-paula-ney');
    const ajomar = findCharger('emps-ajomar');
    expect(charger?.powerKw).toBe(22);
    expect(paulaNey?.address).toContain('R. Paula Ney, 352');
    expect(ajomar?.address).toContain('R. Silveira da Mota, 118');
    expect(paulaNey?.chargerModel).toBe('GW22K-HCA-20');
    expect(ajomar?.chargerModel).toBe('GW22K-HCA-20');
    expect(charger?.availableConnectors).toBeLessThanOrEqual(
      charger?.totalConnectors ?? 0,
    );
    expect(
      searchChargers('EMPS').every(item => item.availableConnectors >= 3),
    ).toBe(true);
    expect(
      searchChargers('EMPS').every(item => item.availableConnectors <= 5),
    ).toBe(true);
  });

  it('mantém a tarifa sinalizada enquanto aguarda o valor oficial', () => {
    expect(formatEnergyPrice()).toBe('Tarifa em atualização');
  });

  it('calcula bateria, tempo e energia dentro dos limites', () => {
    const start = sessionAt(0, 22, 'fast');
    const middle = sessionAt(12, 22, 'fast');
    const end = sessionAt(99, 22, 'fast');
    const full = sessionAt(99, 22, 'full');
    expect(start.battery).toBe(35);
    expect(middle.battery).toBeGreaterThan(start.battery);
    expect(middle.remainingMinutes).toBeLessThan(start.remainingMinutes);
    expect(middle.energyKwh).toBeGreaterThan(0);
    expect(end.battery).toBe(80);
    expect(full.battery).toBe(100);
    expect(end.remainingMinutes).toBe(0);
    expect(end.status).toBe('completed');
  });
});
