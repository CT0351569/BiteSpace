import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import RestaurantCard from "@/components/restaurantCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const RestaurantScreen = () => {
  const [allRestaurantCard, setAllRestaurantCard] = useState<any[]>([]);
  const [filteredRestaurantCard, setFilteredRestaurantCard] = useState<any[]>(
    []
  );
  const [showLocationFilters, setLocationFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(
    "allRestaurants"
  );
  const [activeLocationFilter, setActiveLocationFilter] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchRestaurantCards();
  }, []);

  const fetchRestaurantCards = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.110:5000/api/restaurantcard"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAllRestaurantCard(data);
      setFilteredRestaurantCard(data);
    } catch (error) {
      console.error("Error fetching restaurant cards:", error);
    }
  };

  const handleOnPressRestaurants = (outlet_id: number) => {
    router.push({
      pathname: "/ReviewScreen",
      params: { outlet_id },
    });
  };

  const handleFilterPress = (filter: string, filterFunction: () => void) => {
    setActiveFilter(filter);
    filterFunction();
  };

  // Location Filters
  const applyLocationFilter = (location: string) => {
    const filtered = allRestaurantCard.filter(
      (restaurant) => restaurant.location.toLowerCase() === location
    );
    setFilteredRestaurantCard(filtered);
    setActiveLocationFilter(location);
  };

  // Other Filters
  const handleShowAllRestaurantsOnPress = () => {
    setFilteredRestaurantCard(allRestaurantCard);
    setActiveFilter("allRestaurants");
    setLocationFilters(false);
  };

  const handleHalalOnPress = () => {
    const halalRestaurants = allRestaurantCard.filter(
      (restaurant) => restaurant.halal
    );
    setFilteredRestaurantCard(halalRestaurants);
    setActiveFilter("halal");
    setLocationFilters(false);
  };

  const handleFeaturedOnPress = () => {
    const featuredRestaurants = allRestaurantCard.filter(
      (restaurant) => restaurant.featured
    );
    setFilteredRestaurantCard(featuredRestaurants);
    setActiveFilter("featured");
    setLocationFilters(false);
  };

  const handleHighestRatedOnPress = () => {
    const highestRatedRestaurants = allRestaurantCard.filter(
      (restaurant) => parseFloat(restaurant.rating) === 5
    );
    setFilteredRestaurantCard(highestRatedRestaurants);
    setActiveFilter("highestRated");
    setLocationFilters(false);
  };

  const handlePromotionsOnPress = () => {
    const promotionsRestaurants = allRestaurantCard.filter(
      (restaurant) => restaurant.promotion
    );
    setFilteredRestaurantCard(promotionsRestaurants);
    setActiveFilter("promotions");
    setLocationFilters(false);
  };

  const handleLocationOnPress = () => {
    setActiveFilter("location");
    setLocationFilters(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() =>
                handleFilterPress(
                  "allRestaurants",
                  handleShowAllRestaurantsOnPress
                )
              }
              style={[
                styles.button,
                activeFilter === "allRestaurants" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "allRestaurants" && styles.activeButtonText,
                ]}
              >
                All Restaurants
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleFilterPress("featured", handleFeaturedOnPress)
              }
              style={[
                styles.button,
                activeFilter === "featured" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "featured" && styles.activeButtonText,
                ]}
              >
                Featured
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleFilterPress("highestRated", handleHighestRatedOnPress)
              }
              style={[
                styles.button,
                activeFilter === "highestRated" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "highestRated" && styles.activeButtonText,
                ]}
              >
                Highest Rated
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleFilterPress("promotions", handlePromotionsOnPress)
              }
              style={[
                styles.button,
                activeFilter === "promotions" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "promotions" && styles.activeButtonText,
                ]}
              >
                Promotions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLocationOnPress}
              style={[
                styles.button,
                activeFilter === "location" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "location" && styles.activeButtonText,
                ]}
              >
                Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFilterPress("halal", handleHalalOnPress)}
              style={[
                styles.button,
                activeFilter === "halal" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  activeFilter === "halal" && styles.activeButtonText,
                ]}
              >
                Halal
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {showLocationFilters && (
          <View style={styles.locationFiltersContainer}>
            <ScrollView
              style={styles.locationFiltersContainer}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {["north", "south", "central", "east", "west"].map((location) => (
                <TouchableOpacity
                  key={location}
                  onPress={() => applyLocationFilter(location)}
                  style={[
                    styles.button,
                    activeLocationFilter === location && styles.activeButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      activeLocationFilter === location &&
                        styles.activeButtonText,
                    ]}
                  >
                    {location.charAt(0).toUpperCase() + location.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {filteredRestaurantCard.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.outlet_id}
            onPress={() => handleOnPressRestaurants(restaurant.outlet_id)}
          >
            <RestaurantCard
              title={restaurant.restaurant}
              subtitle={restaurant.rating}
              address={restaurant.address}
              profile_pic={restaurant.profile_pic}
              cuisine={restaurant.cuisine}
              halal={restaurant.halal}
              featured={restaurant.featured}
              location={restaurant.location}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f4f4",
  },
  scrollView: {
    padding: 20,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: "lightblue",
  },
  buttonText: {
    fontWeight: "bold",
    color: "lightblue",
  },
  activeButtonText: {
    color: "#fff",
  },
  locationFiltersContainer: {
    marginBottom: 5,
  },
});

export default RestaurantScreen;
