import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

interface Friend {
  friend_id: number;
  friend_name: string;
  friend_profile_pic: string;
}

const ComposeMessageScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);


  const handleOnpress = (
    friend_id: number,
    friend_name: string,
    friend_profile_pic: string
  ) => {
    console.log(
      `id: ${friend_id}, name: ${friend_name}, pic: ${friend_profile_pic}`
    );
    router.push({
      pathname: "/MessageScreen",
      params: { friend_id, friend_name, friend_profile_pic },
    });
  };

  const fetchFriends = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        throw new Error("Username not found");
      }

      const response = await fetch(
        `http://192.168.1.110:5000/friends?username=${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data.friends);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.friend_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading your friends...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Compose a Message</Text>
      <TextInput
        style={styles.searchBox}
        placeholder="Search for a friend..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.friend_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              handleOnpress(
                item.friend_id,
                item.friend_name,
                item.friend_profile_pic
              )
            }
          >
            <Image
              source={{ uri: item.friend_profile_pic }}
              style={styles.profilePic}
            />
            <Text style={styles.friendName}>{item.friend_name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No friends found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Adjust as needed to space it below the search bar
  },
  emptyText: {
    fontSize: 16,
    color: "#666", // A subtle gray color
    textAlign: "center",
  },
});

export default ComposeMessageScreen;
