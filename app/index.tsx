import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/pages/loginRegister");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Box */}
      <View style={styles.logoWrapper}>
        {/* <Image
          source={require("../assets/splash-icon.png")} 
          style={styles.logo}
          resizeMode="contain"
        /> */}
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome To Vedaro</Text>
      <Text style={styles.subtitle}>Your Premium Jewellery Destination</Text>

      {/* Loader */}
      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D2A1F", // dark green
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  logo: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#D8D8D8",
  },
});
