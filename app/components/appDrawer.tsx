import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ---------- TYPES ----------
type DrawerItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

// ---------- MAIN DRAWER CONTENT ----------

export default function Header(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* User Info Section */}
      <View style={styles.topContainer}>
        <Ionicons name="person-circle-outline" size={80} color="white" />
        <Text style={styles.name}>Bhupendra Dhohte</Text>
        <Text style={styles.email}>bhupi@dhohte.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <DrawerItem
          icon="home-outline"
          label="Home"
          onPress={() => router.push('/(tabs)')}
        />

        <DrawerItem
          icon="person-outline"
          label="Profile"
          onPress={() => router.push('/(tabs)/profile')}
        />

        <DrawerItem
          icon="time-outline"
          label="History"
          onPress={() => router.push('/(tabs)/history')}
        />

        <DrawerItem
          icon="cart-outline"
          label="My Cart"
          onPress={() => router.push('/(tabs)/cart')}
        />

        <View style={styles.separator} />

        <DrawerItem
          icon="log-out-outline"
          label="Logout"
          onPress={() => alert("Logout clicked")}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// ---------- MENU ITEM COMPONENT ----------
function DrawerItem({ icon, label, onPress }: DrawerItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={24} color="black" />
      <Text style={styles.itemLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 0,
    margin: 0,
  },
  topContainer: {
    backgroundColor: "#0D2A1F", // Dark Green Color
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 0
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  email: {
    color: "white",
    fontSize: 14,
    marginTop: 2,
  },
  menuContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 20, // Only left padding as seen in the image
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 20,
    color: "black",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
});