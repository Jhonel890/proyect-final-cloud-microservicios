import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getPreguntaDetalles } from '../utilities/Preguntas';
import { useLocalSearchParams } from 'expo-router';
import Respuesta from '../respuesta/[preguntaId]';
import { postRespuesta } from '../utilities/Respuestas';

const Detalles = ({ params }: any) => {
  const { preguntaId } = useLocalSearchParams<{ preguntaId: string }>();
  const [preguntaDetalles, setPreguntaDetalles] = useState<any>(null);
  const [respuesta, setRespuesta] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDetalles = async () => {
      const data = await getPreguntaDetalles(preguntaId);
      setPreguntaDetalles(data.data);
    };

    fetchDetalles();
  }, [preguntaId]);

  const handleEnviarRespuesta = async () => {
    try {
      const response = await postRespuesta({ descripcion: respuesta, preguntaId });

      if (response.code === 201) {
        Alert.alert("Comentario agregado", "Todo correcto", [
          { text: "Aceptar", onPress: () => router.push("/preguntas") },
        ]);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Alert.alert("Error", "Ups! algo salió mal", [{ text: "Aceptar" }]);
    }
  };

  return (
    <View style={styles.container}>
      {preguntaDetalles ? (
        <>
          <Respuesta></Respuesta>          
        </>
      ) : (
        <Text>Cargando detalles...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#6b7280',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default Detalles;
