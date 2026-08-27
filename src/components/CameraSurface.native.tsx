import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

type Props = { onDenied: () => void; onDetected: (value: string) => void };

export default function CameraSurface({ onDenied, onDetected }: Props) {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (value) onDetected(value);
    },
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(granted => {
        if (!granted) onDenied();
      });
    }
  }, [hasPermission, onDenied, requestPermission]);

  if (!hasPermission || !device) {
    return (
      <View style={s.fallback}>
        <Text style={s.text}>Aguardando acesso à câmera.</Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive
      codeScanner={codeScanner}
    />
  );
}

const s = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: '#101419',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff' },
});
