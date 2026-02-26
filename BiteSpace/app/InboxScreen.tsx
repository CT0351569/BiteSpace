import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import InboxCard, { InboxCardProps } from "@/components/InboxCard";

export default function InboxScreen() {
  const [messages, setMessages] = useState<InboxCardProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (!username) {
          console.log("No username found");
          return;
        }

        const response = await fetch("http://192.168.1.110:5000/get_inbox", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            username: username,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const messagesArray = Array.isArray(data) ? data : [data];

        const formattedMessages = messagesArray.map((item: any) => ({
          last_message: item.last_message,
          friend_id: item.friend_id,
          friend_name: item.friend_name,
          friend_profile_pic: item.friend_profile_pic,
          time_of_last_message: item.time_of_last_message,
          conversation_id: item.conversation_id,
        }));

        setMessages(formattedMessages);
      } catch (error: any) {
        console.log(error.message || "An unknown error occurred");
      }
    };

    fetchMessages();
  }, []);

  const handleCardPress = (
    friend_id: number,
    friend_profile_pic: string,
    friend_name: string,
    conversation_id?: number
  ) => {
    if (conversation_id) {
      console.log(
        `Conversation ID: ${conversation_id}, Friend ID: ${friend_id}, Pic: ${friend_profile_pic}, name:${friend_name}`
      );
      router.push({
        pathname: "/MessageScreen",
        params: {
          conversation_id: conversation_id,
          friend_id: friend_id,
          friend_profile_pic: friend_profile_pic,
          friend_name: friend_name,
        },
      });
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Inbox</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {messages.map((message, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              handleCardPress(
                message.friend_id,
                message.friend_profile_pic,
                message.friend_name,
                message.conversation_id
              )
            }
          >
            <InboxCard {...message} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.composeButton}
        onPress={() => router.push("/ComposeMessageScreen")}
      >
        <Text style={styles.composeButtonText}>Compose</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  titleContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8f4f4",
    padding: 10,
  },
  composeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "lightblue",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  composeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
