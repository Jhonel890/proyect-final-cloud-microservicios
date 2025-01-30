// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import InquietudScreen from './preguntas';
// import RespuestaScreen from './respuesta/[preguntaId]';
// import PreguntaId from './detalles/[preguntaId]';
// import LoginScreen from './login';
// import MisRespuestas from './mis-respuestas';

// const Stack = createStackNavigator();

// export default function IndexScreen() {
//   return (
//     <Stack.Navigator initialRouteName="Login">
//       <Stack.Screen
//         name="Mis Respuestas"
//         component={MisRespuestas}
//         options={{
//           title: "Mis Respuestas",  // Título personalizado
//           headerShown: true // No mostrar cabecera
//         }}
//       />
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ 
//           title: "Iniciar Sesión",  // Título personalizado
//           headerShown: true // No mostrar cabecera
//         }} 
//       />
//       {/*
//       <Stack.Screen
//         name="Inquietud"
//         component={InquietudScreen}
//         options={{ title: "Lista de Inquietudes",  // Título personalizado
//           headerShown: true }}
//       />

//       <Stack.Screen
//         name="Responder Pregunta"
//         component={RespuestaScreen}
//         options={{ title: "Responder Pregunta",  // Título personalizado
//           headerShown: false }}
//       />
//       <Stack.Screen
//         name="DetallesInquietudScreen"
//         component={PreguntaId}
//         options={{ title: "Detalles de la Inquietud",  // Título personalizado
//           headerShown: false }}
//       /> */}
//       {/* <Stack.Screen name="Perfil" component={PerfilScreen} /> */}
//       {/* <Stack.Screen name="Cuenta" component={CuentaScreen} /> */}
//       {/* <Stack.Screen name="Persona" component={PersonaScreen} /> */}
//     </Stack.Navigator>
//   );
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const obtenerToken = async () => {
      const tokenA = await AsyncStorage.getItem("userToken");
      console.log(tokenA);

      if (tokenA) {
        setIsLoggedIn(true);
      }
    };

    obtenerToken();
  }, [isLoggedIn]);

  return isLoggedIn ? <Redirect href="/preguntas" /> : <Redirect href="/login" />;
}
