import { logoutStaff } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Header(props: DrawerContentComponentProps) {

  const handleLogout = async () => {
    Alert.alert(
      "Logout?",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutStaff();
            } catch (error) {
              console.log("Logout error:", error);
            }

            await SecureStore.deleteItemAsync("authToken");
            global.authToken = null;

            router.replace("/pages/loginRegister");
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>

      <View style={styles.topContainer}>
        <View style={{ width: 90, height: 90 }}>
          <Image source={require('../../assets/images/vedaro-logo.png')} style={{ width: '100%', height: '100%' }} />
        </View>
        <Text style={styles.name}>WELCOME TO,</Text>
        <View style={styles.vedaroButton}>
          <Text style={styles.vedaroText}>VEDARO</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <DrawerItem icon="home-outline" label="Home" onPress={() => router.push('/(tabs)')} />
        <DrawerItem icon="person-outline" label="Profile" onPress={() => router.push('/(tabs)/profile')} />
        <DrawerItem icon="time-outline" label="History" onPress={() => router.push('/(tabs)/history')} />
        <DrawerItem icon="cart-outline" label="My Cart" onPress={() => router.push('/(tabs)/cart')} />

        <View style={styles.separator} />

        <DrawerItem icon="log-out-outline" label="Logout" onPress={handleLogout} />
      </View>

    </DrawerContentScrollView>
  );
}

function DrawerItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#0F2A1F" />
      <Text style={styles.itemLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2ecdd",
  },
  topContainer: {
    backgroundColor: "#0f2a1d",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  vedaroButton: {
    marginTop: 10,
  },
  vedaroText: {
    color: "white",
    fontSize: 24,
  },
  menuContainer: {
    marginTop: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 20,
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 20,
    color: "#0F2A1F",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
});
