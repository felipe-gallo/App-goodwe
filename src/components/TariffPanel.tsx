import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, formatCurrency } from '../constants/theme';
import {
  calculateTariff,
  getTariffPeriod,
  tariffConfig,
} from '../constants/tariff';

const Detail = ({ label, value }: { label: string; value: string }) => (
  <View style={s.detail}>
    <Text style={s.detailLabel}>{label}</Text>
    <Text style={s.detailValue}>{value}</Text>
  </View>
);

export function TariffPanel({
  energyKwh,
  idleMinutes,
  now = new Date(),
}: {
  energyKwh?: number;
  idleMinutes?: number;
  now?: Date;
}) {
  const period = getTariffPeriod(now);
  const currentTariff = tariffConfig.periods[period];
  const breakdown =
    energyKwh === undefined
      ? undefined
      : calculateTariff(energyKwh, idleMinutes, now);

  return (
    <View style={s.panel}>
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>TARIFA ATUAL</Text>
          <Text style={s.price}>
            {formatCurrency(currentTariff.pricePerKwh)}
            <Text style={s.unit}> / kWh</Text>
          </Text>
        </View>
        <View style={s.periodPill}>
          <Text style={s.periodText}>{currentTariff.label}</Text>
        </View>
      </View>

      <View style={s.details}>
        <Detail
          label="Taxa de ativação"
          value={`${formatCurrency(tariffConfig.activationFee)} · grátis a partir de ${formatCurrency(tariffConfig.activationWaiverSubtotal)} em energia`}
        />
        <Detail
          label="Taxa de ociosidade"
          value={`${formatCurrency(tariffConfig.idleFeePerMinute)} / min após a tolerância`}
        />
        <Detail
          label="Período de tolerância"
          value={`${tariffConfig.idleGraceMinutes} minutos`}
        />
      </View>

      {breakdown && (
        <View style={s.estimateBox}>
          <View style={s.estimateRow}>
            <Text style={s.estimateLabel}>
              Energia estimada ({breakdown.energyKwh.toFixed(2)} kWh)
            </Text>
            <Text style={s.estimateValue}>
              {formatCurrency(breakdown.energySubtotal)}
            </Text>
          </View>
          <View style={s.estimateRow}>
            <Text style={s.estimateLabel}>Ativação</Text>
            <Text style={s.estimateValue}>
              {breakdown.activationFee === 0
                ? 'Grátis'
                : formatCurrency(breakdown.activationFee)}
            </Text>
          </View>
          {breakdown.idleMinutes !== undefined && (
            <View style={s.estimateRow}>
              <Text style={s.estimateLabel}>Ociosidade</Text>
              <Text style={s.estimateValue}>
                {formatCurrency(breakdown.idleFee)}
              </Text>
            </View>
          )}
          <View style={[s.estimateRow, s.totalRow]}>
            <Text style={s.totalLabel}>Total estimado</Text>
            <Text style={s.totalValue}>{formatCurrency(breakdown.total)}</Text>
          </View>
        </View>
      )}

      <Text style={s.notice}>{tariffConfig.estimateNotice}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  panel: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#7b323c',
    padding: 17,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  price: { color: colors.primary, fontSize: 27, fontWeight: '900', marginTop: 3 },
  unit: { color: colors.inkSoft, fontSize: 14, fontWeight: '700' },
  periodPill: {
    borderRadius: 99,
    backgroundColor: '#63232c',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  periodText: { color: '#ffdfe2', fontSize: 12, fontWeight: '900' },
  details: { marginTop: 13, gap: 9 },
  detail: { gap: 2 },
  detailLabel: { color: colors.muted, fontSize: 11 },
  detailValue: { color: colors.ink, fontWeight: '800', lineHeight: 18 },
  estimateBox: {
    backgroundColor: '#171b20aa',
    borderRadius: 13,
    padding: 12,
    marginTop: 14,
    gap: 8,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  estimateLabel: { color: colors.muted, flex: 1 },
  estimateValue: { color: colors.ink, fontWeight: '800' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 9,
    marginTop: 2,
  },
  totalLabel: { color: colors.ink, fontWeight: '900' },
  totalValue: { color: colors.primary, fontSize: 19, fontWeight: '900' },
  notice: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 12 },
});
