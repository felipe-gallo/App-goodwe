import React, { useState } from 'react';
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

export const Field = (props: TextInputProps & { label: string }) => (
  <View style={s.field}>
    <Text style={s.label}>{props.label}</Text>
    <TextInput
      accessibilityLabel={props.label}
      placeholderTextColor="#87919b"
      {...props}
      style={[s.input, props.style]}
    />
  </View>
);

export const PasswordField = (
  props: Omit<TextInputProps, 'secureTextEntry'> & { label?: string },
) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.field}>
      <Text style={s.label}>{props.label || 'Senha'}</Text>
      <View style={s.passwordRow}>
        <TextInput
          accessibilityLabel={props.label || 'Senha'}
          placeholderTextColor="#87919b"
          {...props}
          secureTextEntry={!visible}
          style={s.passwordInput}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={() => setVisible(value => !value)}
          style={s.eyeButton}
        >
          <View style={s.eyeShape}>
            <View style={[s.eyePupil, visible && s.eyePupilVisible]} />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export const EnvironmentNotice = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <View style={s.notice}>
    <Text style={s.noticeText}>{children}</Text>
  </View>
);

export const StatusPill = ({ status }: Pick<Charger, 'status'>) => (
  <View style={[s.pill, s[`${status}Pill`]]}>
    <View style={[s.dot, s[`${status}Dot`]]} />
    <Text style={[s.status, s[status]]}>
      {status === 'available'
        ? 'Disponível'
        : status === 'in_use'
          ? 'Em uso'
          : 'Indisponível'}
    </Text>
  </View>
);

export const ChargerCard = ({
  charger,
  onPress,
}: {
  charger: Charger;
  onPress?: () => void;
}) => (
  <Pressable
    disabled={!onPress}
    onPress={onPress}
    accessibilityRole={onPress ? 'button' : undefined}
    accessibilityLabel={onPress ? `Abrir painel de ${charger.name}` : undefined}
    style={({ pressed }) => [s.card, pressed && s.cardPressed]}
  >
    <Image
      source={charger.image}
      style={s.thumb}
      accessibilityLabel={`${charger.chargerName} ${charger.chargerModel}`}
    />
    <View style={s.grow}>
      <Text style={s.cardTitle}>{charger.name}</Text>
      <Text style={s.chargerModel}>
        {charger.chargerName} · {charger.chargerModel}
      </Text>
      <Text style={s.muted} numberOfLines={2}>
        {charger.address}
      </Text>
      <View style={s.cardFooter}>
        <StatusPill status={charger.status} />
        <Text style={s.power}>
          {charger.availableConnectors}/{charger.totalConnectors} livres
        </Text>
      </View>
    </View>
  </Pressable>
);

const s = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 12,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 2,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  dim: { opacity: 0.52 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryText: { color: colors.ink },
  field: { marginBottom: 15 },
  label: { fontWeight: '700', color: colors.ink, marginBottom: 7 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  passwordRow: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: colors.ink,
    borderWidth: 0,
  },
  eyeButton: {
    width: 54,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeShape: {
    width: 23,
    height: 14,
    borderWidth: 2,
    borderColor: colors.muted,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
    opacity: 0.25,
  },
  eyePupilVisible: { opacity: 1, backgroundColor: colors.primary },
  notice: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: '#f2d7a0',
    marginVertical: 12,
  },
  noticeText: { color: '#f3d28f', textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 14,
    marginVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressed: { transform: [{ scale: 0.99 }], opacity: 0.94 },
  thumb: {
    width: 82,
    height: 82,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#08090b',
  },
  grow: { flex: 1, gap: 5 },
  cardTitle: { fontSize: 17, fontWeight: '900', color: colors.ink },
  chargerModel: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  muted: { color: colors.muted, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 99,
    gap: 6,
  },
  availablePill: { backgroundColor: colors.greenSoft },
  in_usePill: { backgroundColor: colors.amberSoft },
  offlinePill: { backgroundColor: colors.surfaceRaised },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontWeight: '800', fontSize: 12 },
  available: { color: colors.green },
  in_use: { color: colors.amber },
  offline: { color: colors.gray },
  availableDot: { backgroundColor: colors.green },
  in_useDot: { backgroundColor: colors.amber },
  offlineDot: { backgroundColor: colors.gray },
  power: { fontWeight: '900', color: colors.ink },
});
