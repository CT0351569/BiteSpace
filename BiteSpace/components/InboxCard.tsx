import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export interface InboxCardProps {
  friend_id: number;
  friend_name: string;
  friend_profile_pic: string;
  last_message?: string;
  time_of_last_message?: string;
  conversation_id?: number;
}

const InboxCard = ({
  friend_id,
  friend_name,
  friend_profile_pic,
  last_message,
  time_of_last_message,
  conversation_id,
}: InboxCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: friend_profile_pic }} style={styles.profilePic} />
        <View style={styles.headerText}>
          <Text style={styles.senderName}>{friend_name}</Text>
          <Text style={styles.timestamp}>
            {time_of_last_message ? new Date(time_of_last_message).toLocaleString() : "no date"}
          </Text>
        </View>
      </View>
      <Text style={styles.lastMessage}>
  {last_message ? last_message : "No Message"}
</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flexDirection: "column",
  },
  senderName: {
    fontWeight: "bold",
  },
  timestamp: {
    color: "gray",
    fontSize: 10,
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
    color: "#666",
  },
});

export default InboxCard;
