import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MisRespuestas = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Respuestas</Text>
            <Text style={styles.content}>Aquí se mostrarán tus respuestas.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        color: '#333',
    },
});

export default MisRespuestas;