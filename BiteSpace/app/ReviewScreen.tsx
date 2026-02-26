import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import ReviewCard from '@/components/ReviewCard';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import LeaveReview from '@/components/LeaveReview';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewData {
    client_id: number;
    client_name: string;
    outlet_id: number;
    profile_pic: string;
    rating: number;
    review: string;
    review_datetime: string;
    review_id: number;
    num_reviews: number;
}

interface ClientData {
    client_name: string;
    review_count: number;
    profilepic: string;
    client_id: number;
}

const ReviewScreen: React.FC = () => {
    const { outlet_id } = useLocalSearchParams();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [clientData, setClientData] = useState<ClientData | null>(null);
    const [username, setUsername] = useState<string>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [questStatus, setQuestStatus] = useState<boolean>(false);
    const [questId, setQuestID] = useState<number | null>(null);

    

    useEffect(() => {
        fetchUsername();
        fetchReviews();
    }, []);

    const fetchUsername = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
                fetchClientData(storedUsername);
                checkQuestStatus(storedUsername);
            } else {
                console.log('No username found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://192.168.1.110:5000/api/reviewCard');
            const filteredReviews = response.data.filter((review: ReviewData) => review.outlet_id === Number(outlet_id));
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchClientData = async (username: string) => {
        try {
            const response = await axios.post('http://192.168.1.110:5000/api/leavereviewdata', { username });
            setClientData(response.data);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const checkQuestStatus = async (username: string) => {
        try {
            const response = await axios.get('http://192.168.1.110:5000/api/checkQuestStatusReview', {
                params: { username }
            });
            const { status, quest_id } = response.data;
            setQuestStatus(status);
            setQuestID(quest_id);
            console.log(response.data);
        } catch (error) {
            console.error('Error checking quest status:', error);
        }
    };
    

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReviews();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={reviews}
                renderItem={({ item }) => (
                    <ReviewCard
                        profile_pic={item.profile_pic}
                        name={item.client_name}
                        rating={item.rating}
                        review={item.review}
                        numberOfReviews={item.num_reviews}
                        timeOfReview={new Date(item.review_datetime)}
                    />
                )}
                keyExtractor={(item) => item.review_id.toString()}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            {clientData && (
                <LeaveReview
                    profilepic={clientData.profilepic}
                    name={clientData.client_name}
                    numberOfReviews={clientData.review_count}
                    outlet_id={outlet_id}
                    client_id={clientData.client_id}
                    questStatus={questStatus}
                    questID={questId}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,
        padding: 10,
    },
});

export default ReviewScreen;
