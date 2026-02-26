import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ClientCardProps {
  client_id: string;
  client_name: string;
  profilepic: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ client_id, client_name, profilepic }) => {
  return (
    <View style={styles.clientCard}>
      <Image source={{ uri: profilepic }} style={styles.profilePic} />
      <Text style={styles.clientName}>{client_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  clientCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    width: '100%',
    justifyContent: 'flex-start',  // Ensure the content aligns to the left
    alignItems: 'center',  // Ensure vertical centering within the card
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientCard;
