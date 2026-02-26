import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import PromotionCard from "@/components/PromotionCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";

interface Promotion {
  PromotionID: number;
  PromotionTitle: string;
  PromotionPicture: string;
  PromotionTier: string;
  PromotionDateStart: string;
  PromotionDateEnd: string;
  restaurant_brandName: string;
  outlet_profile_pic: string;
  outlet_address: string;
  outlet_id: number;
}

export default function PromotionScreen() {
  const [filter, setFilter] = useState<string>("All");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>("");
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [unlockedModalVisible, setUnlockedModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (username) {
          const response = await fetch("http://192.168.1.110:5000/userTier", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Username: username,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user tier");
          }

          const data = await response.json();
          setUserTier(data.tier);
        } else {
          setError("No username found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await fetch("http://192.168.1.110:5000/promotions");
        if (!response.ok) {
          throw new Error("Failed to fetch promotions");
        }
        const data: Promotion[] = await response.json();
        setPromotions(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserTier();
    fetchPromotions();
  }, []);

  const tierLevels: { [key: string]: number } = {
    gold: 3,
    silver: 2,
    bronze: 1,
  };

  const checkTierAccess = (promotionTier: string) => {
    return (
      tierLevels[userTier.toLowerCase()] >=
      tierLevels[promotionTier.toLowerCase()]
    );
  };

  const filteredPromotions =
    filter === "All"
      ? promotions
      : promotions.filter((promo) => promo.PromotionTier === filter);

  const handlePromotionPress = (promotion: Promotion) => {
    const hasAccess = checkTierAccess(promotion.PromotionTier);

    if (hasAccess) {
      setSelectedPromotion(promotion);
      setModalVisible(true);
    } else {
      setSelectedPromotion(promotion);
      setUnlockedModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {["All Promotions", "Bronze", "Silver", "Gold"].map((tier) => (
          <TouchableOpacity
            key={tier}
            style={[
              styles.button,
              filter === tier.replace(" Promotions", "") && styles.activeButton,
            ]}
            onPress={() => setFilter(tier.replace(" Promotions", ""))}
          >
            <Text
              style={[
                styles.buttonText,
                filter === tier.replace(" Promotions", "") &&
                  styles.activeButtonText,
              ]}
            >
              {tier}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <ScrollView style={styles.cardsContainer}>
          {filteredPromotions.map((promo) => (
            <TouchableOpacity
              key={`${promo.PromotionID}-${promo.outlet_id}`} // Combine PromotionID and outlet_id as unique key
              onPress={() => handlePromotionPress(promo)}
            >
              <PromotionCard
                promotionID={promo.PromotionID}
                PromotionTitle={promo.PromotionTitle}
                PromotionPicture={promo.PromotionPicture}
                PromotionTier={promo.PromotionTier}
                PromotionDateStart={promo.PromotionDateStart}
                PromotionDateEnd={promo.PromotionDateEnd}
                restaurant_brandName={promo.restaurant_brandName}
                outlet_profile_pic={promo.outlet_profile_pic}
                outlet_address={promo.outlet_address}
                outlet_id={promo.outlet_id}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* QR Code Modal */}
      {selectedPromotion && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.qrCodeTitle}>
              Scan this QR Code to claim the promotion
            </Text>
            <QRCode
              value={`http://fortest.com/promotion/${selectedPromotion.PromotionID}`}
              size={200}
            />
            <View style={styles.qrCodeButton}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Unlocked Tier Modal */}
      {selectedPromotion && (
        <Modal
          visible={unlockedModalVisible}
          animationType="slide"
          onRequestClose={() => setUnlockedModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.qrCodeTitle}>
              You have not unlocked this promotion..{"\n"}
              Complete quests to increase your tier!{"\n"}
              Your current tier: {userTier}
            </Text>
            <View style={styles.qrCodeButton}>
              <Button
                title="Close"
                onPress={() => setUnlockedModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  activeButton: {
    backgroundColor: "lightblue",
  },
  buttonText: {
    color: "lightblue",
    fontWeight: "bold",
  },
  activeButtonText: {
    color: "#fff",
  },
  loading: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  cardsContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  qrCodeTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  qrCodeButton: {
    marginTop: 20,
    width: "100%",
  },
});
