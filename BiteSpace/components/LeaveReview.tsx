import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert, Modal, Button } from 'react-native';
import axios from 'axios';
import StarRating from './StarRating';

interface LeaveReviewProps {
    profilepic: string;
    name: string;
    numberOfReviews: number;
    outlet_id?: any;
    client_id?: number;
    review_datetime?: Date;
    questStatus: boolean;
    questID?: number | null;
}

const LeaveReview: React.FC<LeaveReviewProps> = ({
    profilepic,
    name,
    numberOfReviews,
    outlet_id,
    client_id,
    questID,
    questStatus
}) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [questCompletedModalVisible, setQuestCompletedModalVisible] = useState(false);
    const [exp, setExp] = useState(0);
    const [updatedTier, setUpdatedTier] = useState('');

    const handleQuestCompletion = (expPoints: number, tier: string) => {
        setExp(expPoints);
        setUpdatedTier(tier);
        setQuestCompletedModalVisible(true); // Show the modal
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleReviewChange = (text: string) => {
        setReviewText(text);
    };

    const submitReview = async () => {
        const review_datetime = new Date().toISOString();
    
        console.log('Rating:', rating);
        console.log('Review Text:', reviewText);
        console.log('outlet_id', outlet_id);
        console.log('client_id', client_id);
        console.log('datetime', review_datetime);
        console.log('quest_id', questID);
    
        try {
            const reviewData: any = {
                outlet_id,
                client_id,
                rating,
                review: reviewText,
                review_datetime,
            };
    
            const response = await axios.post('http://192.168.1.110:5000/api/submitreview', reviewData);
            console.log('Review response:', response.data); // Log the review response
    
            if (response.data.success) {
                Alert.alert('Success', 'Review submitted successfully.');
                setRating(0);
                setReviewText('');
    
                // Check if quest is completed and questID exists
                if (questStatus && questID !== null) {
                    const questData = {
                        client_id,
                        quest_id: questID,
                    };
    
                    const questResponse = await axios.post('http://192.168.1.110:5000/api/submitQuestData', questData);
                    console.log('Quest response:', questResponse.data); // Log the quest response
    
                    if (questResponse.data.success) {
                        console.log('Quest data submitted successfully');
                        // Assuming the quest completion returns exp points and updated tier
                        console.log('Exp:', questResponse.data.exp); // Log the exp
                        console.log('Updated Tier:', questResponse.data.updated_tier); // Log the updated tier
                        handleQuestCompletion(questResponse.data.exp, questResponse.data.updated_tier);
                    } else {
                        Alert.alert('Error', 'Failed to submit quest data. Please try again.');
                    }
                }
            } else {
                Alert.alert('Error', 'Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', 'An error occurred while submitting your review. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                <Image style={styles.profilePic} source={{ uri: profilepic }} />
                <View>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.numberOfReviews}>{numberOfReviews} reviews</Text>
                </View>
            </View>
            <StarRating onChangeRating={handleRatingChange} />
            <TextInput
                style={styles.input}
                placeholder="Type your review here..."
                value={reviewText}
                onChangeText={handleReviewChange}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                textAlign="left"
            />
            <View style={styles.characterCountContainer}>
                <Text style={styles.characterCountText}>{reviewText.length}/500</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={submitReview}>
                <Text style={styles.buttonText}>{"Leave Review"}</Text>
            </TouchableOpacity>

            {/* Modal for Quest Completion */}
            <Modal
                visible={questCompletedModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setQuestCompletedModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Quest Completed!</Text>
                        <Text style={styles.modalText}>You now have {exp} experience points.</Text>
                        <Text style={styles.modalText}>Your new tier is: {updatedTier}</Text>
                        <Button title="Close" onPress={() => setQuestCompletedModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        minHeight: 120,
        textAlignVertical: 'top',
        textAlign: 'left',
    },
    characterCountContainer: {
        alignItems: 'flex-end',
        marginTop: 5,
    },
    characterCountText: {
        fontSize: 12,
        color: '#999',
    },
    button: {
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    numberOfReviews: {
        fontSize: 14,
        color: '#888',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default LeaveReview;
