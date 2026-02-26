import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation';
import uploadToSupabase from '@/components/uploadToSupabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [postText, setPostText] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // Fetch the username from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
          console.log('usersname:',username, 'storedusername', storedUsername);
        }
      } catch (error) {
        console.error('Error fetching username from AsyncStorage:', error);
      }
    };

    fetchUsername();
  }, []);

  const verifyPermission = async (permission: 'media' | 'camera') => {
    const permissionResult = permission === 'media' 
      ? await ImagePicker.requestMediaLibraryPermissionsAsync() 
      : await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', `Permission to access the ${permission} is required!`);
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await verifyPermission('camera');
    if (!hasPermission) return;

    const cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (cameraResult.assets && cameraResult.assets.length > 0) {
      setImageUri(cameraResult.assets[0].uri);
    }
  };

  const deleteImage = () => {
    setImageUri(null);
  };

  const getFileExtension = (uri: string) => {
    const parts = uri.split('.');
    return parts[parts.length - 1];
  };

  const handlePost = async () => {
    if (!imageUri) {
      alert('Please add an image!');
      return;
    }
  
    const fileExtension = getFileExtension(imageUri);
    const fileName = `${Date.now()}.${fileExtension}`;
  
    try {
      const publicURL = await uploadToSupabase(imageUri, fileExtension, 'BiteSpace');
      if (!publicURL) {
        console.error('Error uploading image to Supabase');
        alert('Error uploading image to Supabase');
        return;
      }
  
      const postData = {
        username: username,
        post_title: postText || '',
        image_url: publicURL,
        post_time: new Date().toISOString(),
      };
  
      const backendResponse = await fetch('http://192.168.1.110:5000/userpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (backendResponse.ok) {
        alert('Post submitted successfully!');
        // Clear the image and text input after successful post submission
        setImageUri(null);
        setPostText('');
      } else {
        alert('Failed to submit post');
      }
    } catch (error) {
      console.error('Error during image upload or post submission:', error);
      alert('Error during image upload or post submission');
    }
  };
  
  return (
    <ImageBackground source={require('@/assets/images/HomeBackground.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.newPostText}>New Post</Text>

        {/* Display the selected image with delete button above the text input */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Text input for the post */}
        <TextInput
          style={styles.textInput}
          placeholder="Write something..."
          value={postText}
          onChangeText={setPostText}
          multiline
          textAlignVertical="top"
          textAlign="left"
        />

        {/* Container for the buttons */}
        <View style={styles.buttonContainer}>
          {/* Gallery button */}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Foundation name="photo" size={24} color="white" />
          </TouchableOpacity>

          {/* Take a photo button */}
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <MaterialIcons name="add-a-photo" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Post button to submit the post */}
        <View style={styles.postButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity: 0.8,
  },
  newPostText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    position: 'absolute',
    top: 40,
    left: '57%',
    transform: [{ translateX: -70 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  textInput: {
    height: 150,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  postButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 20,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
