import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';

interface UserProfileProps {
  profile_pic: string;
  name: string;
  bio: string;
  buddy_count: number;
  checkins: number;
  posts: number;
  level: number;
  exp: number;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile_pic,
  name,
  bio,
  buddy_count,
  checkins,
  posts,
  level,
  exp,
}) => {
  const router = useRouter(); // Use the hook to get the router instance

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: profile_pic }} style={styles.profilePic} />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{buddy_count}</Text>
            <Text style={styles.statLabel}>Buddies</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{checkins}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
          </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio} numberOfLines={4} ellipsizeMode="tail">{bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f4',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    width: '100%',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    paddingRight: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default UserProfile;
