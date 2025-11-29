import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const checkAuth = () => {
    if (global.authToken) {
      router.replace("/(tabs)");
    } else {
      router.replace("/pages/loginRegister");
    }
  };

  // 👇 Runs every time user revisits the screen
  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(checkAuth, 100);
      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashLogoWrapper}>
        <Image
          source={require("../assets/images/vedaro-logo.png")}
          resizeMode="contain"
          style={{ width: 140, height: 140, borderRadius: 30 }}
          fadeDuration={200}
        />

      </View>

      <Text style={styles.splashTitle}>Welcome To Vedaro</Text>
      <Text style={styles.splashSubtitle}>
        Your Premium Jewellery Destination
      </Text>

      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 40 }} />

      {/* ⭐ Go to Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={checkAuth}>
        <Text style={styles.loginBtnText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#0D2A1F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  splashLogoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 30,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
  },
  splashSubtitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#D8D8D8",
  },
  loginBtn: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: "white",
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D2A1F",
  },
});
