import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { login } from './constants/authService';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async () => {
    try {
      const token = await login(correo, clave);
      Alert.alert('Login exitoso');
      router.push("/preguntas");
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Correo:</Text>
      <TextInput value={correo} onChangeText={setCorreo} style={{ borderWidth: 1, padding: 5 }} />
      <Text>Clave:</Text>
      <TextInput value={clave} onChangeText={setClave} secureTextEntry style={{ borderWidth: 1, padding: 5 }} />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}
