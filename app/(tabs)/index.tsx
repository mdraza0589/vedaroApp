import { router } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <AppHeaderTop title="Jewellary shop" />

      <View style={styles.container}>
        {/* Welcome Section */}
        <Text style={styles.welcome}>Welcome back, Bhupendra Sahu!</Text>
        <Text style={styles.subtitle}>
          Discover our premium jewellery collection
        </Text>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* Scan QR Box */}
        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => router.push("/components/scanner")}
        >
          {/* <Image
            source={require("../assets/qr.png")}
            style={styles.qrIcon}
          /> */}
          <Text style={styles.scanText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  scanCard: {
    width: 160,
    height: 140,
    backgroundColor: "#F8E7A0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  qrIcon: {
    width: 50,
    height: 50,
    tintColor: "#AF8F35",
    marginBottom: 10,
  },
  scanText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#AF8F35",
  },
});
