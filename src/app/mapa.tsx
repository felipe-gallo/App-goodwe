import { useEffect, useState } from 'react';

import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

export default function TelaMapa() {
  const [pesquisa, setPesquisa] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false);

  const [regiao, setRegiao] = useState<Region>({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [permissaoCamera, pedirPermissaoCamera] =
    useCameraPermissions();

  useEffect(() => {
    buscarLocalizacao();
  }, []);

  async function buscarLocalizacao() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à localização para mostrar sua posição no mapa.'
      );

      return;
    }

    try {
      const localizacao =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setRegiao({
        latitude: localizacao.coords.latitude,
        longitude: localizacao.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
    } catch (erro) {
      Alert.alert(
        'Localização',
        'Não foi possível encontrar sua localização.'
      );
    }
  }

  async function abrirCamera() {
    if (!permissaoCamera?.granted) {
      const resultado = await pedirPermissaoCamera();

      if (!resultado.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à câmera para utilizar o leitor de QR Code.'
        );

        return;
      }
    }

    setCameraAberta(true);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        region={regiao}
        onRegionChangeComplete={setRegiao}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: regiao.latitude + 0.003,
            longitude: regiao.longitude + 0.003,
          }}
          title="Carregador GOODWE"
          description="Ponto de recarga disponível"
          pinColor="#E60012"
        />
      </MapView>

      <SafeAreaView style={styles.areaSuperior}>
        <View style={styles.barraPesquisa}>
          <Ionicons
            name="search"
            size={21}
            color="#777777"
          />

          <TextInput
            style={styles.inputPesquisa}
            placeholder="Pesquisar endereço ou carregador"
            placeholderTextColor="#888888"
            value={pesquisa}
            onChangeText={setPesquisa}
          />

          {pesquisa !== '' && (
            <Pressable onPress={() => setPesquisa('')}>
              <Ionicons
                name="close-circle"
                size={21}
                color="#999999"
              />
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      <Pressable
        style={({ pressed }) => [
          styles.botaoQrCode,
          pressed && styles.botaoPressionado,
        ]}
        onPress={abrirCamera}
      >
        <Ionicons
          name="qr-code-outline"
          size={31}
          color="#FFFFFF"
        />

        <Text style={styles.textoQrCode}>
          Ler QR Code
        </Text>
      </Pressable>

      <Modal
        visible={cameraAberta}
        animationType="slide"
        onRequestClose={() => setCameraAberta(false)}
      >
        <View style={styles.areaCamera}>
          <CameraView
            style={styles.camera}
            facing="back"
          />

          <View style={styles.cabecalhoCamera}>
            <Pressable
              style={styles.botaoFechar}
              onPress={() => setCameraAberta(false)}
            >
              <Ionicons
                name="close"
                size={30}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.tituloCamera}>
              Aponte a câmera para o QR Code
            </Text>
          </View>

          <View style={styles.marcacaoQrCode} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapa: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  areaSuperior: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  barraPesquisa: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 7,
  },

  inputPesquisa: {
    flex: 1,
    color: '#222222',
    fontSize: 15,
    marginLeft: 10,
  },

  botaoQrCode: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    height: 65,
    backgroundColor: '#E60012',
    borderRadius: 33,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 8,
  },

  botaoPressionado: {
    backgroundColor: '#BF0010',
    transform: [{ scale: 0.97 }],
  },

  textoQrCode: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  areaCamera: {
    flex: 1,
    backgroundColor: '#000000',
  },

  camera: {
    flex: 1,
  },

  cabecalhoCamera: {
    position: 'absolute',
    top: 45,
    right: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  botaoFechar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tituloCamera: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 48,
  },

  marcacaoQrCode: {
    position: 'absolute',
    width: 250,
    height: 250,
    alignSelf: 'center',
    top: '32%',
    borderWidth: 3,
    borderColor: '#E60012',
    borderRadius: 20,
  },
});