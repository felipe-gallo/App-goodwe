# Goodwe — demonstração de recarga elétrica

Protótipo front-end em TypeScript e React Native Community CLI. O fluxo permite criar uma conta fictícia, escolher um carregador local, simular QR Code e pagamento e acompanhar uma recarga acelerada. Nenhuma autenticação, leitura, cobrança ou recarga real acontece.

## Tecnologias

- React Native 0.86.2 e React 19.2
- React Navigation com rotas tipadas
- `react-native-maps` no Android/iOS e mapa demonstrativo responsivo na web
- `react-native-vision-camera` no Android/iOS e `getUserMedia` na web
- React Native Web, Webpack, TypeScript, ESLint e Jest

## Requisitos no Windows

Instale Node compatível com React Native 0.86, JDK 17 e Android Studio com SDK, Platform Tools e um emulador. Configure `JAVA_HOME` e `ANDROID_HOME` (normalmente `%LOCALAPPDATA%\Android\Sdk`) e adicione `%ANDROID_HOME%\platform-tools` ao `PATH`.

```powershell
npm install
npm start
npm run android
```

Para web:

```powershell
npm run web
npm run web:build
```

Abra o endereço exibido pelo servidor no navegador. Para testar no Safari do iPhone, use o IP local do computador na mesma rede e permita a câmera quando solicitado; HTTPS pode ser necessário para `getUserMedia`. A web valida a interface compartilhada, mas não substitui um build iOS nativo. O iOS nativo exige macOS, CocoaPods e Xcode.

## Fluxo e dados

Cadastro/Login → Mapa → Detalhes → câmera ou fallback de 3 segundos → pagamento fictício → recarga acelerada → resumo → mapa.

Os carregadores ficam em `src/data/mockChargers.ts`; valores da simulação ficam em `src/constants/theme.ts`. As telas passam apenas `chargerId` e parâmetros simples. A câmera não fotografa, grava ou envia mídia. O cartão e o Pix são somente elementos visuais de demonstração.

## Verificações

```powershell
npm run typecheck
npm run lint
npm test
npm run web:build
cd android
.\gradlew.bat assembleDebug
```

Nunca adicione chaves de mapas ou credenciais ao repositório. Caso uma integração futura precise delas, use variáveis locais e mantenha somente um `.env.example` vazio de segredos.
