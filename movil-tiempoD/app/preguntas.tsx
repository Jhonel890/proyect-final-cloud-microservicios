import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getPreguntas } from './utilities/Preguntas';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Preguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPreguntas = async () => {
      const personaId = await AsyncStorage.getItem("personaId");
      const data = await getPreguntas(personaId);         
      setPreguntas(data.data);
      setLoading(false);
    };

    fetchPreguntas();
  }, []);

  const handleResponder = (preguntaId: string) => {    
    router.push(`/respuesta/${preguntaId}`);
  };

  // const handleDetalles = (preguntaId: string) => {
  //   router.push(`/DetallesInquietudScreen/${preguntaId}`);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas de acuerdo a tu perfil</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={preguntas}
          keyExtractor={(item) => item.external_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDescription}>{item.descripcion}</Text>
              {/* <Button
                title="Más detalles"
                onPress={() => handleDetalles(item.external_id)}
              /> */}
              <Button
                title="Responder"
                onPress={() => handleResponder(item.external_id)}
              />
            </View>
          )}
        />
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginVertical: 10,
  },
});

export default Preguntas;
