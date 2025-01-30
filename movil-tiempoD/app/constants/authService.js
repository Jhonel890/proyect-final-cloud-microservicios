import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (correo, clave) => {  
  try {
    const response = await api.post('/auth/cuenta/auth', { correo, clave });
      
    const { token, external_id } = response.data.data;

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('personaId', external_id);
    return token;
  } catch (error) {
    
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('personaId');
};

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const getPersonaId = async () => {
  return await AsyncStorage.getItem('personaId');
};
