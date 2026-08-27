import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignUpScreen, LoginScreen } from './src/screens/AuthScreens';
import { MapScreen, ChargerDetailsScreen } from './src/screens/ChargerScreens';
import {
  CameraScreen,
  PaymentScreen,
  PaymentSuccessScreen,
} from './src/screens/CameraPaymentScreens';
import {
  ChargingSessionScreen,
  ChargingCompleteScreen,
} from './src/screens/ChargingScreens';
import { ChargingModeScreen } from './src/screens/ChargingModeScreen';
import { colors } from './src/constants/theme';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUp"
          screenOptions={{
            headerBackTitle: 'Voltar',
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.mapPanel },
            headerTitleStyle: { fontWeight: '800', color: colors.ink },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Acessar conta' }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChargerDetails"
            component={ChargerDetailsScreen}
            options={{ title: 'Painel do eletroposto' }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChargingMode"
            component={ChargingModeScreen}
            options={{ title: 'Tipo de recarga' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Pagamento' }}
          />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChargingSession"
            component={ChargingSessionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChargingComplete"
            component={ChargingCompleteScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
