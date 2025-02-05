// import { Stack } from 'expo-router';

// export default function Layout() {
//     return (
//         <Stack>
//             {/* <Stack.Screen name="IndexScreen" options={{ title: "Inicio" }} /> */}
//             {/* <Stack.Screen name="CuentaScreen" options={{ title: "Cuenta" }} />
//             <Stack.Screen name="PersonaScreen" options={{ title: "Persona" }} /> */}
//             {/* <Stack.Screen name="InquietudScreen" options={{ title: "Inquietud" }} />
//             <Stack.Screen name="RespuestaScreen/[preguntaId]" options={{ title: "Respuesta" }} />
//             <Stack.Screen name="DetallesInquietudScreen/[preguntaId]" options={{ title: "DetallesInquietud" }} /> */}
//             {/* <Stack.Screen name="PerfilScreen" options={{ title: "Perfil" }} /> */}
//         </Stack>
//     );
// }
// import { Stack } from "expo-router";

// export default function Layout() {
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ title: "Tiempo Digital" }} />
//       <Stack.Screen name="login" options={{ title: "Iniciar Sesión" }} />
//       <Stack.Screen name="inquietud" options={{ title: "Inquietudes" }} />
//       <Stack.Screen name="respuesta/[preguntaId]" options={{ title: "Responder" }} />
//       <Stack.Screen name="detallesInquietud/[preguntaId]" options={{ title: "Detalles" }} />
//     </Stack>
//   );
// }
// import { Drawer } from "expo-router/drawer";
// import { Ionicons } from "@expo/vector-icons";
// import { useState } from "react";
// import { Alert } from "react-native";
// import { getToken } from "./constants/authService";

// export default function Layout() {
//     const [token, settoken] = useState(false);

//     const handleLogout = () => {
//         settoken(false);
//         Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
//     };

//     return (
//         // <Drawer>
//         //     <Drawer.Screen name="index" options={{ title: "Inicio" }} />
//         //     <Drawer.Screen name="inquietud" options={{ title: "Inquietudes" }} />
//         //     <Drawer.Screen name="login" options={{ title: "Perfil" }} />
//         //     <Drawer.Screen
//         //         name="DetallesInquietudScreen/[preguntaId]"
//         //         options={{ drawerItemStyle: { display: "none" } }}
//         //     />
//         //     <Drawer.Screen
//         //         name="LoginScreen"
//         //         options={{ drawerItemStyle: { display: "none" } }}
//         //     />
//         //     <Drawer.Screen
//         //         name="constants/api"
//         //         options={{ drawerItemStyle: { display: "none" } }}
//         //     />
//         //     <Drawer.Screen
//         //         name="InquietudScreen"
//         //         options={{ drawerItemStyle: { display: "none" } }}
//         //     />
//         //     <Drawer.Screen
//         //         name="RespuestaScreen/[preguntaId]"
//         //         options={{ drawerItemStyle: { display: "none" } }}
//         //     />
//         // </Drawer>
//         <Drawer>
//             {token ? (
//                 <>
//                     <Drawer.Screen
//                         name="preguntas"
//                         options={{ title: "Preguntas" }}
//                     />
//                     <Drawer.Screen
//                         name="hacer-pregunta"
//                         options={{ title: "Hacer Pregunta" }}
//                     />
//                     <Drawer.Screen
//                         name="mis-respuestas"
//                         options={{ title: "Mis Respuestas" }}
//                     />
//                     <Drawer.Screen
//                         name="logout"
//                         options={{
//                             title: "Logout",
//                             drawerItemStyle: { marginTop: 30 }, // Lo coloca al final
//                         }}
//                         listeners={{
//                             focus: handleLogout, // Ejecuta logout cuando el usuario entra
//                         }}
//                     />
//                 </>
//             ) : (
//                 <Drawer.Screen
//                     name="login"
//                     options={{ title: "Iniciar Sesión" }}
//                 />
//             )}
//         </Drawer>
//     );
// }
// import { Drawer } from "expo-router/drawer";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import { Alert } from "react-native";

// export default function Layout() {
//   const [token, settoken] = useState(false); // Estado de sesión
//   const router = useRouter();

//   // Función para cerrar sesión
//   const handleLogout = () => {
//     settoken(false);
//     Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
//     router.replace("/login"); // Redirige al login al cerrar sesión
//   };

//   return (
//     <Drawer>
//       {/* {token ? (
//         <>
//           <Drawer.Screen name="Preguntas" options={{ title: "Preguntas" }} />
//           <Drawer.Screen name="HacerPregunta" options={{ title: "Hacer Pregunta" }} />
//           <Drawer.Screen name="Mis-Respuestas" options={{ title: "Mis Respuestas" }} />
//           <Drawer.Screen 
//             name="logout" 
//             options={{ title: "Logout", drawerItemStyle: { marginTop: 30 } }} 
//             listeners={{ focus: handleLogout }} // Ejecuta logout al hacer clic
//           />
//         </>
//       ) : (
//         <Drawer.Screen name="login" options={{ title: "Iniciar Sesión" }} />
//       )} */}
//     </Drawer>
//   );
// }

import { createDrawerNavigator } from '@react-navigation/drawer';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from './constants/authService';
import PreguntasScreen from './preguntas'; 
import HacerPreguntaScreen from './hacer-pregunta'; 
import LoginScreen from './login'; 
import RespuestaScreen from './respuesta/[preguntaId]';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ router }) {
    return (
        <View style={{ flex: 1, paddingTop: 50, backgroundColor: '#f3f4f6' }}>
            <TouchableOpacity onPress={() => router.push('/preguntas')} style={{ padding: 15 }}>
                <Text style={{ fontSize: 16 }}>Preguntas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/hacer-pregunta')} style={{ padding: 15 }}>
                <Text style={{ fontSize: 16 }}>Hacer Pregunta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                await logout();
                await AsyncStorage.removeItem('userToken');
                Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
                router.replace('/login');
            }} style={{ padding: 15 }}>
                <Text style={{ fontSize: 16 }}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function Layout() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const obtenerToken = async () => {
                const tokenA = await AsyncStorage.getItem('userToken');
                setToken(tokenA);
            };
            obtenerToken();
        }, [])
    );

    return (
        <Drawer.Navigator drawerContent={() => <CustomDrawerContent router={router} /> }>
            <Drawer.Screen name="login" component={LoginScreen} />
            <Drawer.Screen name="preguntas" component={PreguntasScreen} />
            {token && <Drawer.Screen name="hacer-pregunta" component={HacerPreguntaScreen} />}
            {token && <Drawer.Screen name="respuesta/[preguntaId]" component={RespuestaScreen} />}
            {/* {token && <Drawer.Screen name="hacer-pregunta" component={HacerPreguntaScreen} />} */}
        </Drawer.Navigator>
    );
}

