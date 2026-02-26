import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import axios from 'axios';
import AppButton from '@/components/AppButton';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.110:5000/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('username', username);
          router.push({pathname: "/(tabs)"})
      } else {
        Alert.alert('Login failed', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error logging in:', error.message);
        Alert.alert('Login failed', error.response?.data?.message || 'An error occurred');
      } else {
        console.error('Unknown error:', error);
        Alert.alert('Login failed', 'An unknown error occurred');
      }
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('@/assets/images/HomeBackground.jpg')}>
      <View style={styles.container}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
          placeholder="Enter your username"
          placeholderTextColor="#ccc"
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Enter your password"
          placeholderTextColor="#ccc"
          secureTextEntry={true} 
        />
        <AppButton title="Login" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default LoginScreen;
