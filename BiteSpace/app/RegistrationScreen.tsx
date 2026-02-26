import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import axios from 'axios';
import AppButton from '@/components/AppButton'; 
import { router } from 'expo-router';

const RegistrationScreen: React.FC = () => {
  const [name, setName] = useState<string>(''); 
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 

  const handleRegistration = async () => {
    if (!name || !username || !password || !email) {
      Alert.alert('Registration failed', 'Please fill out all fields.');
      return;
    }
    try {
      const response = await axios.post('http://192.168.1.110:5000/api/register', {
        name,
        username,
        password,
        email,
      });

      if (response.data.success) {
        Alert.alert('Registration successful', response.data.message);
        router.push({pathname:"/LoginScreen"})
      } else {
        Alert.alert('Registration failed', response.data.message);
      }
    } catch (error : any) {
      console.error('Error registering:', error);
      Alert.alert('Registration failed', error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('@/assets/images/HomeBackground.jpg')}>
      <View style={styles.container}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
        />
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
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Enter your email"
          placeholderTextColor="#ccc"
        />
        <AppButton title="Register" onPress={handleRegistration} />
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

export default RegistrationScreen;
