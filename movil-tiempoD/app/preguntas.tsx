import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
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

  const handleResponder = (preguntaId) => {    
    router.push(`/respuesta/${preguntaId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preguntas de acuerdo a tu perfil</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={preguntas}
          keyExtractor={(item) => item.external_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDescription}>{item.descripcion}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleResponder(item.external_id)}>
                <Text style={styles.buttonText}>Responder</Text>
              </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Preguntas;
