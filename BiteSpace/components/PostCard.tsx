import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type PostCardProps = {
  client_id: number;
  client_name: string;
  profile_picture: string;
  post_id: number;
  post_time: Date;
  image_url: string;
  post_title: string;
  likes: number;
  comments: number;
};

const PostCard = ({
  client_id,
  client_name,
  profile_picture,
  post_id,
  post_time,
  image_url,
  post_title,
  likes,
  comments,
}: PostCardProps) => {
  // State to track if the like button has been clicked
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: profile_picture }} style={styles.profilePic} />
        <View style={styles.headerText}>
          <Text style={styles.clientName}>{client_name}</Text>
          <Text style={styles.postTime}>{post_time.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{post_title}</Text>
      <Image source={{ uri: image_url }} style={styles.postImage} />
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
          {/* Heart icon that turns red when liked */}
          <Icon 
            name={liked ? 'heart' : 'heart-o'} 
            size={24} 
            color={liked ? 'red' : 'gray'} 
          />
          <Text style={styles.likeText}>{likes} Likes</Text>
        </TouchableOpacity>
        <Text> Comments {comments}</Text>
      </View>
    </View>
  );
};
5
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flexDirection: 'column',
  },
  clientName: {
    fontWeight: 'bold',
  },
  postTime: {
    color: 'gray',
  },
  postTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default PostCard;
