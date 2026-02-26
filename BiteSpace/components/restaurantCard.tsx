import React from 'react';
import { View, StyleSheet, Image, Text} from 'react-native';
import { Rating } from 'react-native-elements';

interface RestaurantCardProps {
    title: string;
    subtitle: string;
    profile_pic: string;
    address: string;
    cuisine: string;
    halal?: boolean;
    featured?: boolean;
    promotion?: boolean;
    location: String;
    outlet_id?: number;
    restaurant_id?: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ title, subtitle, profile_pic, address, cuisine, halal, featured, promotion
    , location, outlet_id
 }) => {
    return (
            <View style={styles.card}>
                <Image source={{ uri: profile_pic }} style={styles.image} resizeMode='stretch' />
                <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Rating
                            readonly
                            imageSize={20}
                            startingValue={parseFloat(subtitle)}
                            style={styles.rating}
                        />
                    </View>
                    <Text style={styles.cuisine}>{cuisine}</Text>
                    {halal && <Text style={styles.halal}>Halal</Text>}
                    <Text style={styles.address}>{address}</Text>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: 'white',
        marginBottom: 20,
        padding: 13,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        width: '100%'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    rating: {
        alignSelf: 'flex-start',
    },
    cuisine: {
        fontSize: 14,
    },
    address: {
        fontSize: 12,

    },
    halal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'green',
    },
    featured: {
        fontSize:10,
        alignSelf: 'flex-end',
    }
});

export default RestaurantCard;
