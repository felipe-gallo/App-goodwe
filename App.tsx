import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SignUpScreen,LoginScreen} from './src/screens/AuthScreens';
import {MapScreen,ChargerDetailsScreen} from './src/screens/ChargerScreens';
import {CameraScreen,PaymentScreen,PaymentSuccessScreen} from './src/screens/CameraPaymentScreens';
import {ChargingSessionScreen,ChargingCompleteScreen} from './src/screens/ChargingScreens';
import type {RootStackParamList} from './src/types';
const Stack=createNativeStackNavigator<RootStackParamList>();
export default function App(){return <SafeAreaProvider><NavigationContainer><Stack.Navigator initialRouteName="SignUp" screenOptions={{headerBackTitle:'Voltar',headerTintColor:'#e30613'}}><Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/><Stack.Screen name="Login" component={LoginScreen} options={{title:'Entrar'}}/><Stack.Screen name="Map" component={MapScreen} options={{headerShown:false}}/><Stack.Screen name="ChargerDetails" component={ChargerDetailsScreen} options={{title:'Detalhes do carregador'}}/><Stack.Screen name="Camera" component={CameraScreen} options={{title:'Leitor demonstrativo',headerShown:false}}/><Stack.Screen name="Payment" component={PaymentScreen} options={{title:'Pagamento'}}/><Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{headerShown:false}}/><Stack.Screen name="ChargingSession" component={ChargingSessionScreen} options={{headerShown:false}}/><Stack.Screen name="ChargingComplete" component={ChargingCompleteScreen} options={{headerShown:false}}/></Stack.Navigator></NavigationContainer></SafeAreaProvider>}
