import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import UserProfile from "@/components/ProfileCard";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "@/components/PostCard";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [username, setUsername] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  const handleRegistrationnOnPress = () => {
    router.push("/SettingsScreen");
  };

  const handleInboxOnPress = () => {
    router.push("/InboxScreen")
  }

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername !== null) {
          setUsername(storedUsername);
          fetchUserData(storedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  const fetchUserData = async (username: string) => {
    try {
      // Fetch profile data
      const responseProfile = await axios.post(
        "http://192.168.1.110:5000/api/profiledata2",
        {
          username: username,
        }
      );

      setUserData(responseProfile.data);

      // Fetch user's posts
      const responsePosts = await axios.post(
        "http://192.168.1.110:5000/api/userposts",
        {
          username: username,
        }
      );

      setPosts(responsePosts.data.posts);
    } catch (error) {
      console.error("Error fetching user data or posts:", error);
      Alert.alert("Error", "Failed to fetch user data or posts");
    }
  };

  // Show loading screen if userData is still being fetched
  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const calculateLevel = (exp: number) => {
    return Math.floor(exp / 100);
  };

  const level = calculateLevel(userData.exp); // Calculate level based on exp

  const navigateToQuests = () => {
    router.push("/ExpScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <UserProfile
            profile_pic={userData.profilepic}
            name={userData.client_name}
            bio={userData.bio}
            buddy_count={userData.buddy_count}
            checkins={userData.checkins_count}
            posts={posts.length}
            level={level + 1}
            exp={userData.exp}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegistrationnOnPress}>
              <Text style={styles.buttons}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInboxOnPress}>
              <Text style={styles.buttons}>Inbox</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToQuests}>
              <Text style={styles.buttons}>Quests</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.postsContainer}>
          {posts.length > 0 ? (
            <ScrollView>
              {posts.map((post) => (
                <PostCard
                  key={post.post_id}
                  client_id={post.client_id}
                  client_name={userData.client_name}
                  profile_picture={userData.profilepic}
                  post_id={post.post_id}
                  post_time={new Date(post.post_time)}
                  image_url={post.image_url}
                  post_title={post.post_title}
                  likes={post.likes}
                  comments={post.comments}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.postText}>No posts yet</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8f4f4",
  },
  profileContainer: {
    height: 200,
    backgroundColor: "#f8f4f4",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    backgroundColor: "#f8f4f4",
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f8f4f4",
  },
  buttons: {
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: "lightblue",
    borderColor: "lightblue",
    borderWidth: 1,
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  postsContainer: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    padding: 20,
  },
  postText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
