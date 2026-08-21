import { useState } from 'react';

import { router } from 'expo-router';

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function fazerCadastro() {
    if (nome === '' || email === '' || senha === '') {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    router.replace('/mapa');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.areaLogo}>
            <Image
              source={require('../../assets/logo-goodwe.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.frase}>
              Energia para seguir o seu caminho
            </Text>
          </View>

          <View style={styles.formulario}>
            <Text style={styles.titulo}>Crie sua conta</Text>

            <Text style={styles.descricao}>
              Preencha seus dados para começar
            </Text>

            <Text style={styles.label}>Nome completo</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999999"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Pressable
              style={({ pressed }) => [
                styles.botao,
                pressed && styles.botaoPressionado,
              ]}
              onPress={fazerCadastro}
            >
              <Text style={styles.textoBotao}>Criar conta</Text>
            </Pressable>

            <Text style={styles.textoLogin}>
              Já possui uma conta?{' '}
              <Text style={styles.linkLogin}>Entrar</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  areaLogo: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 220,
    height: 140,
  },

  frase: {
    color: '#666666',
    fontSize: 14,
    marginTop: 5,
  },

  formulario: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  titulo: {
    color: '#222222',
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  descricao: {
    color: '#777777',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 25,
  },

  label: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    color: '#222222',
    fontSize: 15,
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  botao: {
    height: 54,
    backgroundColor: '#E60012',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  botaoPressionado: {
    backgroundColor: '#BF0010',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoLogin: {
    color: '#777777',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 22,
  },

  linkLogin: {
    color: '#E60012',
    fontWeight: 'bold',
  },
}
);