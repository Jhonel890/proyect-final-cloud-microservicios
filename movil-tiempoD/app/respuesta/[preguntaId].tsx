import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from "react-native";
import { getRespuestas, postRespuesta } from "../utilities/Respuestas";
import { getPreguntaDetalles } from "../utilities/Preguntas";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPersonaId } from "../constants/authService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Respuesta = () => {
    const { preguntaId } = useLocalSearchParams<{ preguntaId: string }>();
    const [respuesta, setRespuesta] = useState('');
    const [pregunta, setPregunta] = useState('');
    const [loading, setLoading] = useState(true);
    const [respuestas, setRespuestas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchDetalles = async () => {
            const data = await getPreguntaDetalles(preguntaId);
            // console.log(data.data.titulo);

            setPregunta(data.data);
            setLoading(false);
        };

        const fetchRespuestas = async () => {
            const dataPregunta = await getPreguntaDetalles(preguntaId);
            const dataRespuestas = await getRespuestas();

            const dataUtil = dataRespuestas.data.filter(respuesta =>
                respuesta.inquietud.titulo === dataPregunta.data.titulo
            );
            console.log(dataUtil);
            setRespuestas(dataUtil);
            setLoading(false);
        };

        fetchDetalles();
        fetchRespuestas();
    }, [preguntaId]);

    const handleSubmit = async () => {
        try {
            const personaId = await AsyncStorage.getItem("personaId");

            const response = await postRespuesta({ descripcion: respuesta, inquietud: preguntaId, persona: personaId });

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
        <View style={styles.pageContainer}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Responder Pregunta</Text>
                <Button
                    title="Volver a Principal"
                    onPress={() => router.push("/preguntas")}
                    color="#2563eb"
                />
            </View>

            <View style={styles.questionContainer}>
                {loading ? (
                    <Text style={styles.loadingText}>Cargando pregunta...</Text>
                ) : (
                    <>
                        <Text style={styles.questionTitle}>{pregunta?.titulo}</Text>
                        <Text style={styles.questionDescription}>{pregunta?.descripcion}</Text>
                    </>
                )}
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tu Respuesta</Text>
                    <TextInput
                        style={styles.textarea}
                        value={respuesta}
                        onChangeText={setRespuesta}
                        multiline
                        numberOfLines={4}
                        placeholder="Escribe tu respuesta"
                    // required
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Enviar Respuesta"
                        onPress={handleSubmit}
                        disabled={loading}
                        color="#2563eb"
                    />
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Respuestas Brindadas</Text>
                
                <FlatList
                    data={respuestas}
                    keyExtractor={(item) => item.external_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.descripcion}</Text>
                            <Text style={styles.cardDescription}>{item.persona.nombres}{item.persona.apellidos}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f3f4f6',
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
    pageContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f3f4f6",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
    },
    questionContainer: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 16,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    questionDescription: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 8,
    },
    formContainer: {
        marginTop: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    textarea: {
        borderColor: "#d1d5db",
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },
    buttonContainer: {
        marginTop: 16,
    },
    loadingText: {
        fontSize: 16,
        color: "#6b7280",
    },
});

export default Respuesta;