# EMPS — aplicativo de mobilidade elétrica

Aplicativo em TypeScript e React Native Community CLI para localização de eletropostos, consulta de disponibilidade, leitura de QR Code, autorização de pagamento e acompanhamento da sessão de recarga.

## Tecnologias

- React Native Community CLI para Android e iOS
- React Native Web e Webpack para validação no navegador
- OpenStreetMap com Leaflet na web
- OpenStreetMap com `react-native-maps` e `UrlTile` no aplicativo nativo
- `react-native-vision-camera` para câmera e leitura de QR Code no Android/iOS
- `BarcodeDetector` quando disponível no navegador

## Como executar

```bash
npm install
npm run web
```

Abra `http://localhost:8080`.

Para Android, inicie um emulador pelo Android Studio e execute:

```bash
npm run android
```

## Configuração da tarifa

O valor oficial por kWh fica centralizado em `src/constants/theme.ts`, na constante `energyPricePerKwh`. Até que a tarifa seja definida, as telas exibem “Tarifa em atualização”.

## Fluxo principal

Cadastro → mapa → painel do eletroposto → QR Code → escolha entre recarga rápida ou completa → pagamento → sessão → resumo.

## Verificações

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
npm run web:build
```

As operações financeiras e de recarga desta versão são executadas em ambiente de homologação e não acionam bancos nem equipamentos físicos.
