import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image } from "react-native";
import ExpBar from "@/components/ExpBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuestCard from "@/components/QuestCard";

const ExpScreen = () => {
  const [currentExp, setCurrentExp] = useState<number>(0);
  const [quests, setQuests] = useState<any[]>([]);
  const [clientName, setClientName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpAndQuests = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (username !== null) {
          // Fetch experience points
          const expResponse = await axios.post(
            "http://192.168.1.110:5000/api/getExp",
            { username }
          );
          if (expResponse.data && expResponse.data.exp !== undefined) {
            setCurrentExp(expResponse.data.exp);
            setClientName(expResponse.data.client_name);
            setProfilePic(expResponse.data.profilepic);
          }

          // Fetch quests data
          const questsResponse = await axios.get(
            "http://192.168.1.110:5000/api/getQuests"
          );
          if (questsResponse.data && questsResponse.data.quests) {
            setQuests(questsResponse.data.quests);
          } else {
            Alert.alert("Error", "Failed to retrieve quests");
          }
        } else {
          Alert.alert("Error", "Username not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch experience points or quests");
      } finally {
        setLoading(false);
      }
    };

    fetchExpAndQuests();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Profile Pic and Client Name */}
        <View style={styles.profileInfo}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePic} />
          )}
          <Text style={styles.clientName}>{clientName}</Text>
        </View>
      </View>

      <ExpBar currentExp={currentExp} />
      <View style = {styles.divider}/>

      {/* Quests section*/}
      <View style={styles.questsContainer}>
        <Text style={styles.questsTitle}>Quests</Text>

        <ScrollView contentContainerStyle={styles.questsList}>
          {quests.length > 0 ? (
            quests.map((quest, index) => (
              <QuestCard
                key={index}
                quest_id={quest.quest_id}
                quest_name={quest.quest_name}
                quest_exp={quest.quest_exp}
                start_date={quest.start_date}
                end_date={quest.end_date}
                image_url={quest.image_url}
              />
            ))
          ) : (
            <Text>No quests available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  questsContainer: {
    width: "100%",
    paddingHorizontal: 10,
    flex: 1,
  },
  questsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questsList: {
    paddingBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },  
});

export default ExpScreen;
