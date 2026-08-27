import React, { useCallback, useRef } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, EnvironmentNotice } from '../components/UI';
import {
  chargingConfig,
  colors,
  energyPricePerKwh,
  formatCurrency,
} from '../constants/theme';
import { findCharger } from '../data/mockChargers';
import {
  type SimulationState,
  useChargingSimulation,
} from '../hooks/useChargingSimulation';
import type { RootStackParamList } from '../types';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={s.stat}>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={s.statValue}>{value}</Text>
  </View>
);

export function ChargingSessionScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'ChargingSession'>) {
  const charger = findCharger(route.params?.chargerId);
  const navigated = useRef(false);
  const done = useCallback(
    (state: SimulationState) => {
      if (charger && !navigated.current) {
        navigated.current = true;
        navigation.replace('ChargingComplete', {
          chargerId: charger.id,
          summary: {
            battery: state.battery,
            elapsedSeconds: state.elapsedSeconds,
            energyKwh: state.energyKwh,
          },
        });
      }
    },
    [charger, navigation],
  );
  const { state, stop } = useChargingSimulation(charger?.powerKw || 22, done);
  if (!charger) return null;

  const finishEarly = () =>
    Alert.alert(
      'Encerrar sessão?',
      'A entrega de energia será interrompida e o resumo ficará disponível.',
      [
        { text: 'Continuar recarga', style: 'cancel' },
        {
          text: 'Encerrar sessão',
          style: 'destructive',
          onPress: () => {
            stop();
            navigated.current = true;
            navigation.replace('ChargingComplete', {
              chargerId: charger.id,
              summary: {
                battery: state.battery,
                elapsedSeconds: state.elapsedSeconds,
                energyKwh: state.energyKwh,
                stopped: true,
              },
            });
          },
        },
      ],
    );

  const sessionCost =
    energyPricePerKwh === null ? null : state.energyKwh * energyPricePerKwh;
  return (
    <ScrollView contentContainerStyle={s.page}>
      <View style={s.topbar}>
        <Image source={require('../../assets/emps-logo.jpeg')} style={s.logo} />
        <View style={s.livePill}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>
            {state.status === 'starting' ? 'Conectando' : 'Recarga ativa'}
          </Text>
        </View>
      </View>
      <Text style={s.title}>{charger.name}</Text>
      <Text style={s.muted}>{charger.address}</Text>

      <View style={s.batteryPanel}>
        <Text style={s.batteryLabel}>BATERIA DO VEÍCULO</Text>
        <Text style={s.percent}>{state.battery}%</Text>
        <Text style={s.target}>
          Meta configurada: {chargingConfig.targetBattery}%
        </Text>
        <View style={s.track}>
          <View style={[s.bar, { width: `${state.battery}%` }]} />
        </View>
      </View>

      <View style={s.grid}>
        <Stat label="Tempo restante" value={`${state.remainingMinutes} min`} />
        <Stat label="Tempo decorrido" value={`${state.elapsedSeconds} s`} />
        <Stat label="Potência atual" value={`${charger.powerKw} kW`} />
        <Stat
          label="Energia fornecida"
          value={`${state.energyKwh.toFixed(2)} kWh`}
        />
        <Stat label="Conector" value={charger.connectorType} />
        <Stat
          label="Valor da sessão"
          value={
            sessionCost === null
              ? 'Em atualização'
              : formatCurrency(sessionCost)
          }
        />
      </View>
      <Button secondary title="Encerrar sessão" onPress={finishEarly} />
    </ScrollView>
  );
}

export function ChargingCompleteScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'ChargingComplete'>) {
  const charger = findCharger(route.params?.chargerId);
  if (!charger) return null;
  const summary = route.params.summary;
  const amount =
    energyPricePerKwh === null ? null : summary.energyKwh * energyPricePerKwh;
  return (
    <ScrollView contentContainerStyle={s.complete}>
      <Image
        source={require('../../assets/emps-logo.jpeg')}
        style={s.completeLogo}
      />
      <View style={s.completeIcon}>
        <Text style={s.check}>✓</Text>
      </View>
      <Text style={s.title}>
        {summary.stopped ? 'Sessão encerrada' : 'Recarga concluída'}
      </Text>
      <Text style={s.completeSubtitle}>Resumo da sessão em {charger.name}</Text>
      <View style={s.receipt}>
        <View style={s.receiptRow}>
          <Text style={s.receiptLabel}>Bateria final</Text>
          <Text style={s.receiptValue}>{summary.battery}%</Text>
        </View>
        <View style={s.receiptRow}>
          <Text style={s.receiptLabel}>Duração registrada</Text>
          <Text style={s.receiptValue}>{summary.elapsedSeconds} s</Text>
        </View>
        <View style={s.receiptRow}>
          <Text style={s.receiptLabel}>Energia fornecida</Text>
          <Text style={s.receiptValue}>{summary.energyKwh.toFixed(2)} kWh</Text>
        </View>
        <View style={[s.receiptRow, s.receiptTotal]}>
          <Text style={s.receiptLabel}>Valor total</Text>
          <Text style={s.totalValue}>
            {amount === null ? 'Em atualização' : formatCurrency(amount)}
          </Text>
        </View>
      </View>
      <EnvironmentNotice>
        Dados e cobrança registrados apenas no ambiente de homologação.
      </EnvironmentNotice>
      <Button
        title="Voltar ao mapa"
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: 'Map' }] })
        }
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 38,
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.background,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { width: 115, height: 56, resizeMode: 'contain', borderRadius: 10 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: colors.greenSoft,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  liveText: { color: colors.green, fontWeight: '900' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 16,
  },
  muted: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  batteryPanel: {
    backgroundColor: '#101419',
    borderRadius: 22,
    padding: 21,
    marginTop: 18,
  },
  batteryLabel: {
    color: '#aeb7bf',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  percent: {
    fontSize: 58,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  target: { textAlign: 'center', color: '#bfc6cc' },
  track: {
    height: 15,
    borderRadius: 8,
    backgroundColor: '#343b42',
    overflow: 'hidden',
    marginTop: 18,
  },
  bar: { height: '100%', backgroundColor: colors.primary, borderRadius: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  stat: {
    flexGrow: 1,
    width: '45%',
    minWidth: 145,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { color: colors.muted, fontSize: 12 },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 5,
  },
  complete: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  completeLogo: {
    width: 140,
    height: 66,
    resizeMode: 'contain',
    borderRadius: 11,
  },
  completeIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  check: { fontSize: 48, color: colors.green, fontWeight: '900' },
  completeSubtitle: { color: colors.muted, textAlign: 'center', marginTop: 5 },
  receipt: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 17,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f2',
  },
  receiptTotal: { borderBottomWidth: 0, paddingTop: 16 },
  receiptLabel: { color: colors.muted },
  receiptValue: { color: colors.ink, fontWeight: '900' },
  totalValue: { color: colors.primary, fontSize: 18, fontWeight: '900' },
});
