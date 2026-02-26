import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UserProfile from '@/components/ProfileCard';
import PostCard from '@/components/PostCard'; // Import PostCard component
import axios from 'axios';
import AppButton from '@/components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtherProfileScreen = () => {
  const { client_id } = useLocalSearchParams(); // Get client ID from route params
  const [clientData, setClientData] = useState<any>(null); // State to store profile data
  const [postsData, setPostsData] = useState<any[]>([]); // State to store posts data
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [username, setUsername] = useState<string>(''); // State to store the username
  const [buddyRequestSent, setBuddyRequestSent] = useState<boolean>(false); // Track buddy request state

  useEffect(() => {
    fetchUsername(); // Fetch username from AsyncStorage
  }, []);

  useEffect(() => {
    if (client_id) {
      const id = Array.isArray(client_id) ? parseInt(client_id[0], 10) : parseInt(client_id, 10);

      if (!isNaN(id)) {
        fetchProfileData(id);
        fetchPostsData(id);
      } else {
        Alert.alert('Invalid Client ID', 'The client ID is not valid.');
        setIsLoading(false);
      }
    }
  }, [client_id]);

  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        console.log('Username retrieved:', storedUsername);
      } else {
        console.warn('No username found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching username from AsyncStorage:', error);
    }
  };

  const fetchProfileData = async (clientId: number) => {
    try {
      const response = await axios.post(
        'http://192.168.1.110:5000/api/getClientData',
        { client_id: clientId }
      );
      if (response.data) {
        console.log('Fetched Client Profile Data:', response.data);
        setClientData(response.data);
      } else {
        Alert.alert('Error', 'No profile data found.');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to fetch client profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostsData = async (clientId: number) => {
    try {
      const response = await axios.post(
        'http://192.168.1.110:5000/api/otheruserposts',
        { client_id: clientId }
      );
      console.log('Fetched Posts Data:', response.data);
      setPostsData(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts data:', error);
      Alert.alert('Error', 'Failed to fetch client posts');
    } finally {
      setIsLoading(false); // Stop loading after both calls
    }
  };

  const calculateLevel = (exp: number) => {
    return Math.floor(exp / 100);
  };

  const level = clientData ? calculateLevel(clientData.exp) : 0;

  const handleAddBuddyOnPress = async () => {
    try {
      if (!clientData || !username) {
        Alert.alert('Error', 'User data is incomplete.');
        return;
      }

      const payload = {
        username: username,
        client_id: client_id,
      };

      // Log the payload before sending the request
      console.log('Sending payload:', payload);

      // Send request to add or cancel buddy request based on current state
      const response = await axios.post(
        buddyRequestSent
          ? 'http://192.168.1.110:5000/api/cancelBuddyRequest'
          : 'http://192.168.1.110:5000/api/addBuddy',
        payload
      );

      if (response.data.success) {
        console.log(
          buddyRequestSent ? 'Buddy request canceled' : 'Buddy request sent',
          response.data
        );

        // Show appropriate pop-up and toggle button state
        Alert.alert(
          buddyRequestSent ? 'Request Canceled' : 'Buddy Request Sent',
          buddyRequestSent
            ? 'Request has been canceled.'
            : 'Request sent'
        );

        // Toggle buddy request state after successful action
        setBuddyRequestSent(!buddyRequestSent); // Toggle state after success
      } else {
        console.warn(
          buddyRequestSent ? 'Cancel request response' : 'Add buddy response',
          response.data
        );
        Alert.alert('Error', response.data.message || 'Request failed.');
      }
    } catch (error) {
      console.error(
        buddyRequestSent ? 'Error canceling request' : 'Error sending request',
        error
      );
      Alert.alert(
        'Error',
        buddyRequestSent
          ? 'Failed to cancel the request. Please try again.'
          : 'Failed to send buddy request. Please try again.'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text> // Show loading message while data is being fetched
      ) : (
        <>
          {clientData ? (
            <UserProfile
              profile_pic={clientData.profilepic}
              name={clientData.client_name}
              bio={clientData.bio}
              buddy_count={clientData.buddy_count}
              checkins={clientData.checkins_count}
              posts={clientData.posts_count}
              level={level}
              exp={clientData.exp}
            />
          ) : (
            <Text>Loading profile...</Text> // or some other placeholder until data is available
          )}

          {/* Add AppButton below the bio */}
          {clientData && (
            <View style={styles.buttonContainer}>
              <AppButton
                title={buddyRequestSent ? "Cancel Buddy Request" : "Add Buddy"}
                onPress={handleAddBuddyOnPress}
              />
            </View>
          )}

          {/* Render PostCards below the UserProfile */}
          {postsData.length > 0 ? (
            postsData.map((post: any) => (
              <PostCard
                key={post.post_id}
                client_id={post.client_id}
                client_name={clientData.client_name} // Use the client name from profile data
                profile_picture={clientData.profilepic} // Use the profile picture from profile data
                post_id={post.post_id}
                post_time={new Date(post.post_time)}
                image_url={post.image_url}
                post_title={post.post_title}
                likes={post.likes}
                comments={post.comments}
              />
            ))
          ) : (
            <Text>No posts available.</Text> // If there are no posts
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f4f4',
  },
});

export default OtherProfileScreen;
