import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type QuestProps = {
  quest_id: number;
  quest_name: string;
  quest_exp: number;
  start_date: string;
  end_date: string;
  image_url?: string;
};

const QuestCard: React.FC<QuestProps> = ({
  quest_id,
  quest_name,
  quest_exp,
  start_date,
  end_date,
  image_url,
}) => {
  // Convert start and end dates from string to Date object
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const currentDate = new Date();

  let statusMessage = "";
  let statusColor = "green";

  if (startDate > currentDate) {
    statusMessage = "Not started yet";
    statusColor = "red";
  } else if (endDate < currentDate) {
    statusMessage = "Quest is over";
    statusColor = "red";
  } else if (startDate <= currentDate && endDate >= currentDate) {
    statusMessage = "Available";
    statusColor = "green";
  }

  return (
    <View style={styles.card}>
      {image_url ? (
        <Image source={{ uri: image_url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={styles.questName}>{quest_name}</Text>
      <Text style={styles.questDetails}>EXP: {quest_exp}</Text>

      {/* Dates beside each other */}
      <View style={styles.datesContainer}>
        <Text style={styles.questDate}>Start: {start_date}</Text>
        <Text style={styles.questDate}>End: {end_date}</Text>
      </View>

      {/* Show the status message */}
      {statusMessage ? (
        <Text style={[styles.statusMessage, { color: statusColor }]}>
          {statusMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: "95%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  questName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  questDetails: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  questDate: {
    fontSize: 13,
    color: "#555",
  },
  statusMessage: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 6,
  },
});

export default QuestCard;
