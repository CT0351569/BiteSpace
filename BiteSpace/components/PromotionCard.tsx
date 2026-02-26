import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type PromotionCardProps = {
    promotionID: number;
    PromotionTitle: string;
    PromotionPicture: string;
    PromotionTier: string;
    PromotionDateStart: string;
    PromotionDateEnd: string;
    restaurant_brandName: string;
    outlet_profile_pic: string;
    outlet_address: string;
    outlet_id: number;
  };
  
  const PromotionCard = ({
    promotionID,
    PromotionTitle,
    PromotionPicture,
    PromotionTier,
    PromotionDateStart,
    PromotionDateEnd,
    restaurant_brandName,
    outlet_profile_pic,
    outlet_address,
    outlet_id,

  }: PromotionCardProps) => {
    return (
      <View style={styles.card}>
        {/* Profile Section */}
        <View style={styles.header}>
          <Image source={{ uri: outlet_profile_pic }} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.brandName}>{restaurant_brandName}</Text>
            <Text style={styles.address}>{outlet_address}</Text>
          </View>
        </View>
  
        {/* Promotion Section */}
        <Image source={{ uri: PromotionPicture }} style={styles.promotionImage} />
        <View style={styles.content}>
          <Text style={styles.title}>{PromotionTitle}</Text>
          <Text style={styles.tier}>Tier: {PromotionTier}</Text>
          <Text style={styles.date}>
            {`From: ${PromotionDateStart} To: ${PromotionDateEnd}`}
          </Text>
        </View>
      </View>
    );
  };
  

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
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
    color: 'gray',
  },
  promotionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tier: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: 'darkgray',
  },
});

export default PromotionCard;
