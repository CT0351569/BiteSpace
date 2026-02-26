import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
    initialRating?: number;
    onChangeRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ initialRating = 0, onChangeRating }) => {
    const [rating, setRating] = useState(initialRating);

    const handleStarPress = (selectedRating: number) => {
        setRating(selectedRating);
        onChangeRating(selectedRating);
    };

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={30}
                        color="#FFD700"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default StarRating;
