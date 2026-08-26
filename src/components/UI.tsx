import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../constants/theme';
import type { Charger } from '../types';
export const Button = ({
  title,
  onPress,
  disabled = false,
  secondary = false,
  label,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  label?: string;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label || title}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      s.button,
      secondary && s.secondary,
      (pressed || disabled) && s.dim,
    ]}
  >
    <Text style={[s.buttonText, secondary && s.secondaryText]}>{title}</Text>
  </Pressable>
);
export const Field = (p: TextInputProps & { label: string }) => (
  <View style={s.field}>
    <Text style={s.label}>{p.label}</Text>
    <TextInput
      accessibilityLabel={p.label}
      placeholderTextColor="#87919b"
      {...p}
      style={[s.input, p.style]}
    />
  </View>
);
export const DemoNotice = ({
  children = 'Demonstração — nenhum dado ou serviço real é utilizado.',
}: {
  children?: React.ReactNode;
}) => (
  <View style={s.notice}>
    <Text style={s.noticeText}>{children}</Text>
  </View>
);
export const ChargerCard = ({
  charger,
  onPress,
}: {
  charger: Charger;
  onPress?: () => void;
}) => (
  <View style={s.card}>
    <Image
      source={charger.image}
      style={s.thumb}
      accessibilityLabel={`Imagem de ${charger.name}`}
    />
    <View style={s.grow}>
      <Text style={s.cardTitle}>{charger.name}</Text>
      <Text style={s.muted}>{charger.address}</Text>
      <Text style={[s.status, s[charger.status]]}>
        {charger.status === 'available'
          ? 'Disponível'
          : charger.status === 'in_use'
            ? 'Em uso'
            : 'Offline'}{' '}
        · {charger.powerKw} kW
      </Text>
      {onPress && <Button title="Ver carregador" onPress={onPress} />}
    </View>
  </View>
);
const s = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 12,
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dim: { opacity: 0.55 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryText: { color: colors.primary },
  field: { marginBottom: 14 },
  label: { fontWeight: '700', color: colors.ink, marginBottom: 6 },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: colors.ink,
    backgroundColor: '#fff',
  },
  notice: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff4d8',
    marginVertical: 12,
  },
  noticeText: { color: '#725000', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    marginVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  thumb: {
    width: 82,
    height: 82,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f4f4f4',
  },
  grow: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  muted: { color: colors.muted },
  status: {fontWeight: '700'},
  available: {color: colors.green},
  in_use: {color: colors.amber},
  offline: {color: colors.gray},
});
