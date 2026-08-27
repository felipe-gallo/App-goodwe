import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Field, PasswordField } from '../components/UI';
import { colors } from '../constants/theme';
import type { RootStackParamList } from '../types';

const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

const Shell = ({ children }: { children: React.ReactNode }) => (
  <KeyboardAvoidingView
    style={s.fill}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView
      contentContainerStyle={s.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.brandPanel}>
        <Image
          source={require('../../assets/emps-logo.jpeg')}
          style={s.logo}
          accessibilityLabel="Logotipo EMPS"
        />
        <Text style={s.tagline}>
          Mobilidade elétrica com energia e confiança
        </Text>
      </View>
      <View style={s.panel}>{children}</View>
    </ScrollView>
  </KeyboardAvoidingView>
);

export function SignUpScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SignUp'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (!name.trim() || !password || !validEmail(email)) {
      setError('Preencha nome, e-mail válido e senha.');
      return;
    }
    navigation.reset({ index: 0, routes: [{ name: 'Map' }] });
  };
  return (
    <Shell>
      <Text style={s.eyebrow}>BEM-VINDO À EMPS</Text>
      <Text style={s.title}>Crie sua conta</Text>
      <Text style={s.sub}>Localize eletropostos e acompanhe sua recarga.</Text>
      <Field label="Nome completo" value={name} onChangeText={setName} />
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <PasswordField value={password} onChangeText={setPassword} />
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Button title="Criar conta" onPress={submit} />
      <Button
        secondary
        title="Já possui uma conta? Entrar"
        onPress={() => navigation.navigate('Login')}
      />
    </Shell>
  );
}

export function LoginScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (!validEmail(email) || !password) {
      setError('Informe um e-mail válido e uma senha.');
      return;
    }
    navigation.reset({ index: 0, routes: [{ name: 'Map' }] });
  };
  return (
    <Shell>
      <Text style={s.eyebrow}>ÁREA DO CLIENTE</Text>
      <Text style={s.title}>Acesse sua conta</Text>
      <Text style={s.sub}>
        Gerencie recargas e consulte eletropostos próximos.
      </Text>
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <PasswordField value={password} onChangeText={setPassword} />
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Button title="Entrar" onPress={submit} />
      <Button
        secondary
        title="Voltar ao cadastro"
        onPress={() => navigation.goBack()}
      />
    </Shell>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  page: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  brandPanel: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#08090b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  logo: { width: 220, height: 105, resizeMode: 'contain', alignSelf: 'center' },
  tagline: { textAlign: 'center', color: '#d3d7db', marginTop: -4 },
  panel: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 3,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 5,
  },
  sub: {
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },
  error: { color: colors.primary, fontWeight: '700', marginTop: 4 },
});
