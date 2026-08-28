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

Os horários, valores e regras ficam centralizados em `src/constants/tariff.ts`:

- Fora de ponta: R$ 1,59/kWh
- Intermediário: R$ 1,89/kWh
- Ponta: R$ 2,19/kWh
- Ativação: R$ 2,00, gratuita quando o subtotal de energia atinge R$ 20,00
- Tolerância de ociosidade: 15 minutos
- Ociosidade após a tolerância: R$ 0,50/minuto

## Fluxo principal

Cadastro → mapa → painel do eletroposto → QR Code → escolha entre recarga rápida ou completa → pagamento → sessão → resumo.

## Rede de eletropostos

O mapa apresenta oito unidades EMPS na região da Aclimação, Cambuci, Vila Monumento e Jardim da Glória. As unidades utilizam o carregador GoodWe HCA G2, modelo GW22K-HCA-20, com potência nominal de 22 kW e conector Tipo 2.

## Verificações

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
npm run web:build
```

As operações financeiras e de recarga desta versão são executadas em ambiente de homologação e não acionam bancos nem equipamentos físicos.
