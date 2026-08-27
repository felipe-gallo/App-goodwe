import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components/UI';
import { chargingPlans, colors } from '../constants/theme';
import { findCharger } from '../data/mockChargers';
import type { ChargingPlan, RootStackParamList } from '../types';

const PlanCard = ({
  plan,
  selected,
  onPress,
}: {
  plan: ChargingPlan;
  selected: boolean;
  onPress: () => void;
}) => {
  const details = chargingPlans[plan];
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={details.title}
      onPress={onPress}
      style={({ pressed }) => [
        s.planCard,
        selected && s.planSelected,
        pressed && s.pressed,
      ]}
    >
      <View style={[s.planIcon, selected && s.planIconSelected]}>
        <Text style={s.planIconText}>{plan === 'fast' ? '⚡' : '◉'}</Text>
      </View>
      <View style={s.planContent}>
        <View style={s.planHeading}>
          <Text style={s.planTitle}>{details.title}</Text>
          <View style={[s.radio, selected && s.radioSelected]}>
            {selected && <View style={s.radioDot} />}
          </View>
        </View>
        <Text style={s.planDescription}>{details.shortDescription}</Text>
        <View style={s.metrics}>
          <View style={s.metric}>
            <Text style={s.metricValue}>Até {details.targetBattery}%</Text>
            <Text style={s.metricLabel}>nível da bateria</Text>
          </View>
          <View style={s.metric}>
            <Text style={s.metricValue}>~{details.estimatedMinutes} min</Text>
            <Text style={s.metricLabel}>tempo estimado</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export function ChargingModeScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'ChargingMode'>) {
  const charger = findCharger(route.params.chargerId);
  const [selectedPlan, setSelectedPlan] = useState<ChargingPlan>();
  if (!charger) return null;

  return (
    <ScrollView contentContainerStyle={s.page}>
      <Image
        source={require('../../assets/emps-logo.jpeg')}
        style={s.logo}
        accessibilityLabel="EMPS"
      />
      <Text style={s.eyebrow}>CONFIGURE SUA SESSÃO</Text>
      <Text style={s.title}>Como você quer recarregar?</Text>
      <Text style={s.subtitle}>
        Escolha a modalidade mais adequada para o seu trajeto.
      </Text>

      <View style={s.station}>
        <Text style={s.stationLabel}>ELETROPOSTO SELECIONADO</Text>
        <Text style={s.stationName}>{charger.name}</Text>
        <Text style={s.stationAddress}>{charger.address}</Text>
      </View>

      <View accessibilityRole="radiogroup" style={s.planList}>
        <PlanCard
          plan="fast"
          selected={selectedPlan === 'fast'}
          onPress={() => setSelectedPlan('fast')}
        />
        <PlanCard
          plan="full"
          selected={selectedPlan === 'full'}
          onPress={() => setSelectedPlan('full')}
        />
      </View>

      <Button
        disabled={!selectedPlan}
        title="Continuar para pagamento"
        onPress={() => {
          if (selectedPlan) {
            navigation.navigate('Payment', {
              chargerId: charger.id,
              plan: selectedPlan,
            });
          }
        }}
      />
      <Button secondary title="Voltar" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 36,
    backgroundColor: colors.background,
  },
  logo: {
    width: 135,
    height: 66,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 12,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 18,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },
  station: {
    backgroundColor: colors.mapPanel,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 20,
  },
  stationLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  stationName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
  stationAddress: { color: colors.muted, lineHeight: 18, marginTop: 4 },
  planList: { gap: 12, marginTop: 16 },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    gap: 13,
  },
  planSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  planIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planIconSelected: { backgroundColor: '#63232c' },
  planIconText: { fontSize: 22 },
  planContent: { flex: 1 },
  planHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  planTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  planDescription: { color: colors.muted, lineHeight: 19, marginTop: 4 },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 13 },
  metric: {
    flex: 1,
    backgroundColor: '#171b2099',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metricValue: { color: colors.ink, fontWeight: '900' },
  metricLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
});
