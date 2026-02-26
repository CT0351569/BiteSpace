import AppButton from "@/components/AppButton";
import React from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { router } from "expo-router";

function LandingScreen() {
  const handleLoginOnPress = () => {
    router.push("/LoginScreen");
  };

  const handleRegistrationnOnPress = () => {
    router.push("/RegistrationScreen");
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("@/assets/images/HomeBackground.jpg")}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>BiteSpace</Text>
        <Text style={styles.slogan}>Find hidden gems!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton title="Login" onPress={handleLoginOnPress} />
        <AppButton title="Register" onPress={handleRegistrationnOnPress} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 100,
  },
  logo: {
    fontSize: 40,
    fontWeight: "500",
    color: "#fff",
    fontStyle: "italic",
  },
  slogan: {
    fontSize: 15,
    marginTop: 10,
    color: "#fff",
    fontStyle: "italic",
  },
});

export default LandingScreen;
