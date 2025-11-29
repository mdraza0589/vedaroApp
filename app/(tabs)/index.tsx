import { getProfile } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeaderTop from "../components/appHeader";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setProfile(res?.data?.user);
    } catch (err) {
      console.log("PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Action Buttons ----------
  const quickActions: {
    id: number;
    title: string;
    icon: any;
    color: string;
    bgColor: string;
    route: Href;
  }[] = [
      {
        id: 1,
        title: "Scan QR",
        icon: "qr-code-outline",
        color: "#AF8F35",
        bgColor: "#F8E7A0",
        route: "/components/scanner",
      },
      {
        id: 2,
        title: "Compare Scanner",
        icon: "scan-circle-outline",
        color: "#0A6EBD",
        bgColor: "#D7ECFF",
        route: "/components/compareScanner",
      },
    ];

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#AF8F35" />
        <Text style={{ marginTop: 10 }}>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <AppHeaderTop title="Jewellary Shop" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Welcome to Vedaro</Text>
          <Text style={styles.subtitle}>Discover luxury jewellery and collections</Text>
          <Text style={styles.name}>{profile?.name ?? "Guest"}</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: action.bgColor }]}
              onPress={() => router.push(action.route)}
            >
              <Ionicons name={action.icon} size={32} color={action.color} />
              <Text style={[styles.actionText, { color: action.color }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f2ecdd"
  },
  scrollView: {
    backgroundColor: "#f2ecdd"
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: "#f2ecdd"
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2ecdd",
  },
  welcomeSection: {
    marginTop: 15,
    marginBottom: 28,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0D2A1F",
    marginTop: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#0D2A1F",
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (screenWidth - 60) / 2,
    height: 110,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  actionText: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    letterSpacing: 0.4,
  },
});