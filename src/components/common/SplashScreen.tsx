import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

//https://docs.expo.dev/develop/user-interface/splash-screen/
//adding splash screen icon + image to app.json
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
  },
});

export default SplashScreen;
