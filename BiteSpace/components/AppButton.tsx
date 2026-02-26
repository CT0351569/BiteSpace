import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface AppButtonProps {
    title: string;
    onPress: () => void;
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        backgroundColor: "lightblue",
        borderRadius: 25,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default AppButton;
