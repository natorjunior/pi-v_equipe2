# Como Executar o Frontend

- **Node.js**: Instale a versão LTS do Node.js.
- **Expo CLI**: Instale globalmente:

npm install -g expo-cli

## Passos

1. **Clone o repositório:**

git clone https://github.com/natorjunior/pi-v_equipe2.git cd pi-v_equipe2


2. **Instale as dependências:**

npm install

3. **Instale dependências adicionais do Expo:**

npm install @expo/config-plugins@~10.0.0 @expo/prebuild-config@~9.0.0 @react-native-async-storage/async-storage@2.1.2 @react-native-community/cli@^18.0.0 @react-navigation/bottom-tabs@^7.3.14 @react-navigation/drawer@^7.3.12 @react-navigation/native@^7.1.10 @react-navigation/stack@^7.3.3 axios@^1.9.0 expo@^53.0.10 expo-av@^15.1.5 expo-checkbox@~4.1.4 expo-doctor@^1.13.3 expo-file-system@^18.1.10 expo-image@~2.2.0 expo-image-picker@^16.1.4 expo-linear-gradient@~14.1.4 expo-secure-store@~14.2.3 expo-video@~2.2.0 jwt-decode@^4.0.0 react@19.0.0 react-dom@19.0.0 react-native@^0.79.3 react-native-dotenv@^3.4.11 react-native-gesture-handler@~2.24.0 react-native-image-picker@^8.2.1 react-native-paper@^5.14.5 react-native-permissions@^5.4.0 react-native-reanimated@~3.17.4 react-native-safe-area-context@^5.4.0 react-native-screens@~4.11.1 react-native-video@^6.14.1

**Atenção**: Certifique-se de que as dependências do Expo sejam atendidas corretamente. Se o comando `npm install` falhar, certifique-se de ter as dependências do Expo instaladas corretamente.

Caso não o tenha sucesso, tente `npm expo doctor` para descobrir qual dependencia não o foi atendida.

4. **Execute o projeto:**

npx expo start

5. **Escaneie o QR code** com o aplicativo **Expo Go** (disponível na App Store ou Google Play) ou execute em um emulador.

Pronto! O frontend estará rodando no seu dispositivo ou emulador. 🚀