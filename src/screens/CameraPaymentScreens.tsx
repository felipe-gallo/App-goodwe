import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CameraSurface from '../components/CameraSurface';
import { TariffPanel } from '../components/TariffPanel';
import { Button } from '../components/UI';
import { chargingPlans, colors } from '../constants/theme';
import { findCharger } from '../data/mockChargers';
import type { PaymentMethod, RootStackParamList } from '../types';

export function CameraScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Camera'>) {
  const charger = findCharger(route.params?.chargerId);
  const [denied, setDenied] = useState(false);
  const [detected, setDetected] = useState(false);
  const moved = useRef(false);
  const go = useCallback(() => {
    if (!moved.current && charger) {
      moved.current = true;
      navigation.replace('ChargingMode', { chargerId: charger.id });
    }
  }, [charger, navigation]);
  const identify = useCallback(
    (_value: string) => {
      setDetected(true);
      const timer = setTimeout(go, 650);
      return () => clearTimeout(timer);
    },
    [go],
  );

  if (!charger) {
    return (
      <View style={s.center}>
        <Text>Eletroposto não identificado.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }
  return (
    <View style={s.camera}>
      <CameraSurface onDenied={() => setDenied(true)} onDetected={identify} />
      <View style={s.overlay}>
        <View style={s.cameraHeader}>
          <Text style={s.cameraEyebrow}>IDENTIFICAÇÃO DO ELETROPOSTO</Text>
          <Text style={s.cameraTitle}>Aponte para o QR Code</Text>
          <Text style={s.cameraStation}>{charger.name}</Text>
        </View>
        <View style={[s.frame, detected && s.frameDetected]}>
          {detected && <Text style={s.detected}>✓</Text>}
        </View>
        <View style={s.cameraActions}>
          {denied && (
            <Text style={s.cameraMessage}>
              Permita o uso da câmera no navegador ou nas configurações do
              aparelho.
            </Text>
          )}
          <Button
            title="Confirmar identificação"
            onPress={go}
            label="Continuar após identificar o eletroposto"
          />
          <Button
            secondary
            title="Cancelar"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
}

export function PaymentScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Payment'>) {
  const charger = findCharger(route.params?.chargerId);
  const selectedPlan = chargingPlans[route.params.plan];
  const [method, setMethod] = useState<PaymentMethod>();
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  if (!charger) {
    return (
      <View style={s.center}>
        <Text>Eletroposto não encontrado.</Text>
      </View>
    );
  }
  const estimatedEnergy = selectedPlan.energyEstimateKwh;
  const pay = () => {
    if (!method) return;
    setProcessing(true);
    timer.current = setTimeout(
      () =>
        navigation.replace('PaymentSuccess', {
          chargerId: charger.id,
          method,
          plan: route.params.plan,
        }),
      1200,
    );
  };
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.eyebrow}>AUTORIZAÇÃO DE RECARGA</Text>
      <Text style={s.title}>Revise os dados</Text>
      <View style={s.summary}>
        <Image source={charger.image} style={s.thumb} />
        <View style={s.summaryText}>
          <Text style={s.bold}>{charger.name}</Text>
          <Text style={s.muted}>{charger.address}</Text>
          <Text style={s.summaryLine}>
            {charger.chargerName} · {charger.chargerModel}
          </Text>
          <Text style={s.summaryLine}>
            {charger.connectorType} · {charger.powerKw} kW
          </Text>
          <Text style={s.planLine}>{selectedPlan.title}</Text>
        </View>
      </View>
      <View style={s.tariffWrap}>
        <TariffPanel energyKwh={estimatedEnergy} />
      </View>
      <Text style={s.sectionTitle}>Forma de pagamento</Text>
      {(['Cartão', 'Pix', 'Carteira digital'] as PaymentMethod[]).map(item => (
        <Button
          key={item}
          secondary={method !== item}
          title={item}
          onPress={() => setMethod(item)}
        />
      ))}
      {method && (
        <View style={s.methodPanel}>
          <Text style={s.methodIcon}>
            {method === 'Cartão' ? '▰' : method === 'Pix' ? '◆' : '◉'}
          </Text>
          <View>
            <Text style={s.bold}>{method} selecionado</Text>
            <Text style={s.muted}>Pronto para autorizar a sessão</Text>
          </View>
        </View>
      )}
      <Button
        disabled={!method || processing}
        title={processing ? 'Autorizando...' : 'Autorizar e continuar'}
        onPress={pay}
      />
    </ScrollView>
  );
}

export function PaymentSuccessScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>) {
  const charger = findCharger(route.params?.chargerId);
  const selectedPlan = chargingPlans[route.params.plan];
  if (!charger) return null;
  return (
    <View style={s.success}>
      <Image
        source={require('../../assets/emps-logo.jpeg')}
        style={s.successLogo}
      />
      <View style={s.checkCircle}>
        <Text style={s.check}>✓</Text>
      </View>
      <Text style={s.title}>Sessão autorizada</Text>
      <Text style={s.successText}>
        Conecte o cabo ao veículo para iniciar a recarga.
      </Text>
      <View style={s.receipt}>
        <Text style={s.bold}>{charger.name}</Text>
        <Text style={s.muted}>Modalidade: {selectedPlan.title}</Text>
        <Text style={s.muted}>Método: {route.params.method}</Text>
        <Text style={s.muted}>Protocolo: EMPS-{charger.id.toUpperCase()}</Text>
      </View>
      <Button
        title="Iniciar recarga"
        onPress={() =>
          navigation.replace('ChargingSession', {
            chargerId: charger.id,
            plan: route.params.plan,
          })
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  camera: { flex: 1, backgroundColor: '#000' },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
    backgroundColor: '#0003',
  },
  cameraHeader: {
    marginTop: 18,
    backgroundColor: '#101419e8',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 460,
  },
  cameraEyebrow: {
    color: '#ff6c78',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  cameraTitle: { color: '#fff', fontWeight: '900', fontSize: 21, marginTop: 5 },
  cameraStation: { color: '#cbd1d6', marginTop: 4 },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0001',
  },
  frameDetected: { borderColor: colors.green, backgroundColor: '#14824a33' },
  detected: { fontSize: 74, color: '#fff', fontWeight: '900' },
  cameraActions: { width: '100%', maxWidth: 460 },
  cameraMessage: {
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#101419e8',
    padding: 10,
    borderRadius: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  page: {
    padding: 20,
    paddingBottom: 38,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginVertical: 10,
  },
  summary: {
    backgroundColor: '#101419',
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
  },
  thumb: { width: 86, height: 78, resizeMode: 'contain', borderRadius: 11 },
  summaryText: { flex: 1, gap: 4 },
  summaryLine: { color: '#fff', fontWeight: '700', fontSize: 12 },
  planLine: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  bold: { fontWeight: '900', color: colors.ink },
  muted: { color: colors.muted, lineHeight: 18 },
  tariffWrap: { marginTop: 14 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 20,
  },
  methodPanel: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: { fontSize: 28, color: colors.primary },
  success: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
    gap: 10,
  },
  successLogo: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontSize: 50, color: colors.green, fontWeight: '900' },
  successText: { textAlign: 'center', color: colors.muted, maxWidth: 360 },
  receipt: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 5,
  },
});
