import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function CameraSurface({ onDenied }: { onDenied: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        stream = s;
        if (ref.current) {
          ref.current.srcObject = s;
          ref.current.play();
        }
      })
      .catch(onDenied);
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [onDenied]);
  return (
    <View style={s.area}>
      {React.createElement('video', {
        ref,
        style: { width: '100%', height: '100%', objectFit: 'cover' },
        muted: true,
        playsInline: true,
      })}
      <Text style={s.caption}>A câmera não grava nem envia imagens.</Text>
    </View>
  );
}
const s = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#111' },
  caption: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    color: '#fff',
  },
});
