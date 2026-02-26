import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
  sender_id: number;
  text: string;
  timestamp: Date;
  isSender: boolean;
}

export default function MessageScreen() {
  const [friendMessages, setFriendMessages] = useState<Message[]>([]); // initialize as empty array in case no mesages
  const [clientMessages, setClientMessages] = useState<Message[]>([]); // Messages from the client
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { friend_id, friend_profile_pic, friend_name } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
          console.log("Username fetched:", storedUsername);
        } else {
          console.log("No username found in AsyncStorage");
        }
      } catch (error) {
        console.log("Error fetching username from AsyncStorage:", error);
      }
    };
  
    fetchUsername();
  }, []);
  

  useEffect(() => {
    const fetchMessages = async () => {
      if (!username) return;
  
      try {
        const response = await fetch(
          `http://192.168.1.110:5000/get_messages?username=${username}&friend_id=${friend_id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
  
        const data = await response.json();

        //clear old messages before stting the new ones
        setFriendMessages([]);
        setClientMessages([]);
  

        setFriendMessages(
          Array.isArray(data.friend)
            ? data.friend.map((msg: any) => ({
                sender_id: parseInt(friend_id as string),
                text: msg.message,
                timestamp: new Date(msg.time_sent),
                isSender: false,
              }))
            : []
        );
  
        setClientMessages(
          Array.isArray(data.client)
            ? data.client.map((msg: any) => ({
                sender_id: parseInt(friend_id as string),
                text: msg.message,
                timestamp: new Date(msg.time_sent),
                isSender: true,
              }))
            : []
        );
      } catch (error) {
        console.error("An error occurred while fetching messages:", error);
        setFriendMessages([]);
        setClientMessages([]);
      }
    };
  
    fetchMessages();
  }, [username, friend_id]);
  

  // Scroll to the bottom after the component layout is complete
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [friendMessages, clientMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("http://192.168.1.110:5000/send_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friend_id,
          username,
          text: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setClientMessages((prev) => [
        ...prev,
        {
          sender_id: parseInt(friend_id as string), // Add the sent message to client messages
          text: sentMessage.text,
          timestamp: new Date(sentMessage.timestamp), // Convert the timestamp
          isSender: true, // It's a message from the client
        },
      ]);
      setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.log("An error occurred while sending message:", error);
    }
  };

  // Render messages function that ensures messages are sorted with the oldest last
  const renderMessages = () => {
    const allMessages = [...friendMessages, ...clientMessages];

    // Sort the messages in chronological order (newest first)
    allMessages.sort((b, a) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
      <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
        {allMessages.length === 0 ? (
          <Text style={styles.noMessagesText}>No messages yet.</Text>
        ) : (
          allMessages.map((message, index) => {
            const messageDate = new Date(message.timestamp);
            const validTimestamp = messageDate.toLocaleTimeString();

            return (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.isSender
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageText}>
                  {message.text || "No message"}
                </Text>
                <Text style={styles.timestamp}>{validTimestamp}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with friend profile picture and name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        {friend_profile_pic && (
          <Image
            source={{
              uri: Array.isArray(friend_profile_pic)
                ? friend_profile_pic[0]
                : friend_profile_pic, // Handle if it's an array
            }}
            style={styles.profilePic}
          />
        )}

        <Text style={styles.headerTitle}>{friend_name}</Text>
      </View>

      {/* Messages Area */}
      {renderMessages()}

      {/* Reply Box */}
      <View style={styles.replyBox}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  backButton: {
    color: "lightblue",
    fontSize: 16,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "lightblue",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightblue",
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    textAlign: "right",
    marginTop: 5,
  },
  replyBox: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#ffffff",
    marginTop: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "lightblue",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
  noMessagesText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
});
