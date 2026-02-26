import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostCard from "@/components/PostCard";
import ClientCard from "@/components/ClientCard";
import { router } from "expo-router";

const NewsFeedScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Friends");
  const [username, setUsername] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]); // State for storing client cards
  const [filteredClients, setFilteredClients] = useState<any[]>([]); // State for search results
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isSearchFocused, setIsSearchFocused] = useState(false); // To track if the search bar is focused
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername !== null) {
          setUsername(storedUsername);
          if (selectedTab === "Friends") {
            fetchFriendPosts(storedUsername);
          } else {
            fetchExplorePosts();
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        Alert.alert("Error", "Failed to fetch username");
      }
    };

    fetchUsername();
  }, [selectedTab]);

  const fetchFriendPosts = async (username: string) => {
    try {
      const response = await axios.post(
        "http://192.168.1.110:5000/postsfrombuddies",
        { username }
      );
      const sortedPosts = response.data.sort(
        (a: { post_time: string | Date }, b: { post_time: string | Date }) =>
          new Date(b.post_time).getTime() - new Date(a.post_time).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching friend posts:", error);
      Alert.alert("Error", "Failed to fetch friend posts");
    }
  };

  const fetchExplorePosts = async () => {
    try {
      const response = await axios.get("http://192.168.1.110:5000/explore");
      const sortedExplorePosts = response.data.sort(
        (a: { post_time: string | Date }, b: { post_time: string | Date }) =>
          new Date(b.post_time).getTime() - new Date(a.post_time).getTime()
      );
      setPosts(sortedExplorePosts);
    } catch (error) {
      console.error("Error fetching explore posts:", error);
      Alert.alert("Error", "Failed to fetch explore posts");
    }
  };

  // Function to fetch client cards
  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.110:5000/getClientsElasticSearch"
      );
      setClients(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      Alert.alert("Error", "Failed to fetch clients");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true); // Show the refresh spinner
    try {
      if (selectedTab === "Friends") {
        await fetchFriendPosts(username);
      } else {
        await fetchExplorePosts();
      }
    } catch (error) {
      console.error("Error refreshing posts:", error);
      Alert.alert("Error", "Failed to refresh posts");
    } finally {
      setRefreshing(false); // Hide the refresh spinner
    }
  };

  // Function to handle search query change and filter clients based on the search input
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredClients([]); // Clear filtered clients when search query is empty
    } else {
      const filtered = clients.filter((client) =>
        client.client_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    fetchClients();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const renderTabContent = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.post_id.toString()}
        renderItem={({ item }) => (
          <PostCard
            client_id={item.client_id}
            client_name={item.client_name}
            profile_picture={item.profile_picture}
            post_id={item.post_id}
            post_time={new Date(item.post_time)}
            image_url={item.image_url}
            post_title={item.post_title}
            likes={item.like_count}
            comments={item.comment_count}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
        refreshControl=
        {<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );

  const handleClientPress = (client: any) => {
    router.push({
      pathname: "/OtherProfileScreen",
      params: { client_id: client.client_id },
    });
  };

  const renderSearchResults = () => (
    <ScrollView contentContainerStyle={styles.flatListContainer}>
      {filteredClients.map((client) => (
        <TouchableOpacity
          key={client.client_id}
          onPress={() => handleClientPress(client)}
        >
          <ClientCard
            client_id={client.client_id}
            client_name={client.client_name}
            profilepic={client.profilepic}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Looking for someone..?"
        value={searchQuery}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        onChangeText={handleSearchQueryChange}
      />

      {/* Render search results when search bar is focused and there are filtered results */}
      {isSearchFocused && filteredClients.length > 0
        ? renderSearchResults()
        : renderTabContent()}

      {/* Tab button that toggles between Friends and Explore */}
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setSelectedTab(selectedTab === "Friends" ? "Explore" : "Friends")
          }
        >
          <Text style={styles.buttonText}>
            {selectedTab === "Friends" ? "Explore" : "View Friends Posts"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  searchBar: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  clientCard: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    width: "100%",
    justifyContent: "flex-start",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tabButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#ADD8E6",
    padding: 15,
    borderRadius: 5,
    margin: 5,
    width: "90%",
  },
  scrollViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  flatListContainer: {
    width: "100%",
  },
});

export default NewsFeedScreen;
