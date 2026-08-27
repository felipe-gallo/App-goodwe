import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BarcodeResult = { rawValue?: string };
type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<BarcodeResult[]>;
};
type BarcodeDetectorConstructor = new (options: {
  formats: string[];
}) => BarcodeDetectorLike;

type Props = { onDenied: () => void; onDetected: (value: string) => void };

export default function CameraSurface({ onDenied, onDetected }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [scannerAvailable, setScannerAvailable] = useState(true);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let frame = 0;
    let cancelled = false;
    const Detector = (
      window as typeof window & {
        BarcodeDetector?: BarcodeDetectorConstructor;
      }
    ).BarcodeDetector;
    setScannerAvailable(Boolean(Detector));

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then(async mediaStream => {
        stream = mediaStream;
        if (!ref.current) return;
        ref.current.srcObject = mediaStream;
        await ref.current.play();
        if (!Detector) return;
        const detector = new Detector({ formats: ['qr_code'] });
        const scan = async () => {
          if (cancelled || !ref.current) return;
          try {
            const codes = await detector.detect(ref.current);
            const value = codes[0]?.rawValue;
            if (value) {
              onDetected(value);
              return;
            }
          } catch {
            // A próxima imagem da câmera será processada normalmente.
          }
          frame = window.requestAnimationFrame(scan);
        };
        frame = window.requestAnimationFrame(scan);
      })
      .catch(onDenied);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onDenied, onDetected]);

  return (
    <View style={s.area}>
      {React.createElement('video', {
        ref,
        style: { width: '100%', height: '100%', objectFit: 'cover' },
        muted: true,
        playsInline: true,
      })}
      {!scannerAvailable && (
        <Text style={s.caption}>
          Leitura automática indisponível neste navegador.
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#101419' },
  caption: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: '#000a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
