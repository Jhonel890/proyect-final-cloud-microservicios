// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { API_URL } from './constants/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HacerPregunta = () => {
//     const [question, setQuestion] = useState('');

//     const handleQuestionChange = (text: string) => {
//         setQuestion(text);
//     };

//     const handleSubmit = async () => {
//         if (!question.trim()) {
//             Alert.alert("Error", "La pregunta no puede estar vacía.");
//             return;
//         }

//         try {
//             const personaId = await AsyncStorage.getItem('personaId');
//             const token = await AsyncStorage.getItem('userToken');
//             const response = await fetch(API_URL + "/inquietud/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     pregunta: question,
//                     persona: personaId,
//                     perfiles: [],
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 Alert.alert("Éxito", "Tu pregunta ha sido enviada.");
//                 setQuestion(""); // Limpia el campo
//             } else {
//                 Alert.alert("Error", data.message || "No se pudo enviar la pregunta.");
//             }
//         } catch (error) {
//             Alert.alert("Error", "Error al conectar con el servidor.");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Hacer una Pregunta</Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder="Escribe tu pregunta aquí"
//                 value={question}
//                 onChangeText={handleQuestionChange}
//             />
//             <Button title="Enviar" onPress={handleSubmit} />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 16,
//         paddingHorizontal: 8,
//     },
// });

// export default HacerPregunta;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import api from './constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HacerPregunta = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [perfiles, setPerfiles] = useState([]);
    const [selectedPerfiles, setSelectedPerfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPerfiles = async () => {
            try {
                const response = await api.get('/qa/perfil');
                setPerfiles(response.data.data);
            } catch (error) {
                console.error('Error al cargar los perfiles:', error);
                Alert.alert('Error', 'No se pudieron cargar los perfiles.');
            }
        };
        fetchPerfiles();
    }, []);

    const handlePerfilSelect = (perfilId) => {
        setSelectedPerfiles((prev) =>
            prev.includes(perfilId) ? prev.filter((id) => id !== perfilId) : [...prev, perfilId]
        );
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'El título y la descripción no pueden estar vacíos.');
            return;
        }

        if (selectedPerfiles.length === 0) {
            Alert.alert('Error', 'Debes seleccionar al menos un perfil.');
            return;
        }

        setLoading(true);
        const personaId = await AsyncStorage.getItem('personaId');

        try {
            const response = await api.post('/qa/inquietud', {
                titulo: title,
                descripcion: description,
                perfiles: selectedPerfiles,
                persona: personaId,
            });

            if (response.status === 200) {
                Alert.alert('Éxito', 'Tu pregunta ha sido enviada.');
                setTitle('');
                setDescription('');
                setSelectedPerfiles([]);
            }
        } catch (error) {
            console.error('Error al enviar la pregunta:', error);
            Alert.alert('Error', 'Hubo un problema al enviar tu pregunta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Hacer una Pregunta</Text>

            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                placeholder='Ingresa un título breve'
                value={title}
                onChangeText={setTitle}
                editable={!loading}
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder='Describe tu pregunta con más detalle'
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!loading}
            />

            <Text style={styles.label}>Selecciona Perfiles Relacionados:</Text>
            {perfiles.length > 0 ? (
                perfiles.map((perfil) => (
                    <TouchableOpacity
                        key={perfil.external_id}
                        style={[styles.perfilButton, selectedPerfiles.includes(perfil.external_id) && styles.perfilButtonSelected]}
                        onPress={() => handlePerfilSelect(perfil.external_id)}
                    >
                        <Text style={styles.perfilButtonText}>{perfil.nombre}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <ActivityIndicator size='large' color='#007bff' />
            )}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 5,
        width: '100%',
        backgroundColor: 'white',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    perfilButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
        width: '100%',
    },
    perfilButtonSelected: {
        backgroundColor: '#4CAF50',
    },
    perfilButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HacerPregunta;
