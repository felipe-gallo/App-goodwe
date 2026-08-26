import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CameraSurface from '../components/CameraSurface';
import { Button, DemoNotice } from '../components/UI';
import { colors } from '../constants/theme';
import { findCharger } from '../data/mockChargers';
import type { PaymentMethod, RootStackParamList } from '../types';
export function CameraScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Camera'>) {
  const c = findCharger(route.params?.chargerId);
  const [denied, setDenied] = useState(false);
  const [count, setCount] = useState(3);
  const moved = useRef<boolean>(false);
  const go = useCallback(() => {
    if (!moved.current && c) {
      moved.current = true;
      navigation.replace('Payment', { chargerId: c.id });
    }
  }, [c, navigation]);
  useEffect(() => {
    const id = setInterval(
      () =>
        setCount(v => {
          if (v <= 1) {
            clearInterval(id);
            go();
            return 0;
          }
          return v - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [go]);
  if (!c)
    return (
      <View style={s.center}>
        <Text>Parâmetro de carregador inválido.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  return (
    <View style={s.camera}>
      <CameraSurface onDenied={() => setDenied(true)} />
      <View style={s.overlay}>
        <Text style={s.cameraTitle}>
          Aponte a câmera para o QR Code do carregador
        </Text>
        <View style={s.frame} />
        <Text style={s.count}>{count || 'Identificado!'}</Text>
        {denied && (
          <View style={s.denied}>
            <Text style={s.white}>
              Permissão negada ou câmera indisponível.
            </Text>
            <Button title="Continuar simulação" onPress={go} />
          </View>
        )}
        <Button
          secondary
          title="Cancelar"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}
export function PaymentScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Payment'>) {
  const c = findCharger(route.params?.chargerId);
  const [method, setMethod] = useState<PaymentMethod>();
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  if (!c)
    return (
      <View style={s.center}>
        <Text>Carregador não encontrado.</Text>
      </View>
    );
  const pay = () => {
    if (!method) return;
    setProcessing(true);
    timer.current = setTimeout(
      () => navigation.replace('PaymentSuccess', { chargerId: c.id, method }),
      2000,
    );
  };
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.title}>Pagamento fictício</Text>
      <View style={s.summary}>
        <Image source={c.image} style={s.thumb} />
        <View>
          <Text style={s.bold}>{c.name}</Text>
          <Text>{c.address}</Text>
          <Text>
            {c.chargingType} · {c.powerKw} kW
          </Text>
        </View>
      </View>
      <Text style={s.price}>Valor demonstrativo: R$ 24,90</Text>
      <DemoNotice>
        Pagamento demonstrativo — nenhuma cobrança será realizada.
      </DemoNotice>
      {(['Cartão', 'Pix', 'Carteira digital'] as PaymentMethod[]).map(m => (
        <Button
          key={m}
          secondary={method !== m}
          title={m}
          onPress={() => setMethod(m)}
        />
      ))}
      {method === 'Cartão' && (
        <View style={s.demo}>
          <Text style={s.bold}>FELIPE TESTE</Text>
          <Text>•••• •••• •••• 1234 · 12/30</Text>
          <Text>Bandeira demonstrativa</Text>
        </View>
      )}
      {method === 'Pix' && (
        <View style={s.demo}>
          <Text style={s.fakeQr}>▦</Text>
          <Text>QR Code ilustrativo — não abre banco.</Text>
        </View>
      )}
      <Button
        disabled={!method || processing}
        title={
          processing
            ? 'Processando pagamento fictício...'
            : 'Confirmar pagamento fictício'
        }
        onPress={pay}
      />
    </ScrollView>
  );
}
export function PaymentSuccessScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>) {
  const c = findCharger(route.params?.chargerId);
  if (!c) return null;
  return (
    <View style={s.success}>
      <Text style={s.check}>✓</Text>
      <Text style={s.title}>Pagamento concluído</Text>
      <DemoNotice>Nenhuma cobrança aconteceu.</DemoNotice>
      <Text style={s.bold}>{c.name}</Text>
      <Text>Método: {route.params.method}</Text>
      <Text>Operação fictícia: DEMO-{c.id.toUpperCase()}</Text>
      <Button
        title="Iniciar recarga"
        onPress={() =>
          navigation.replace('ChargingSession', { chargerId: c.id })
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
    justifyContent: 'space-around',
    padding: 22,
  },
  cameraTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 19,
    textAlign: 'center',
    backgroundColor: '#0009',
    padding: 10,
    borderRadius: 10,
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 24,
  },
  count: { fontSize: 34, color: '#fff', fontWeight: '900' },
  denied: { backgroundColor: '#000c', padding: 16, borderRadius: 14 },
  white: { color: '#fff' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  page: { padding: 20, maxWidth: 620, width: '100%', alignSelf: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginVertical: 12,
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  thumb: { width: 80, height: 80, resizeMode: 'contain' },
  bold: { fontWeight: '800', color: colors.ink },
  price: { fontSize: 20, fontWeight: '800', marginTop: 18 },
  demo: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  fakeQr: { fontSize: 80 },
  success: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
    gap: 12,
  },
  check: { fontSize: 70, color: colors.green, fontWeight: '900' },
});
