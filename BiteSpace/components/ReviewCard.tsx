import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Rating } from 'react-native-elements';

interface ReviewCardProps {
    name: string;
    rating: number;
    review: string;
    timeOfReview: Date;
    numberOfReviews: number;
    outlet_id?: number;
    client_id?: number;
    profile_pic: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
    name, 
    rating, 
    review, 
    timeOfReview, 
    numberOfReviews,
    profile_pic
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.profileContainer}>
            <Image style={styles.image} source={{ uri: profile_pic }} />
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.numberOfReviews}>{numberOfReviews} reviews</Text>
                </View>
            </View>
            <Rating 
                readonly 
                imageSize={20} 
                startingValue={rating} 
                style={styles.rating} 
            />
            <Text style={styles.review}>{review}</Text>
            <Text style={styles.timeOfReview}>{timeOfReview.toLocaleString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    nameContainer: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    numberOfReviews: {
        fontSize: 14,
        color: '#888',
    },
    rating: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    review: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    timeOfReview: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
});

export default ReviewCard;
