import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    title: string;
};

export default function AppHeaderTop({ title }: Props) {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            {/* Menu Button */}
            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
                <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Cart Button */}
            <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
                <Ionicons name="cart-outline" size={26} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90,
        backgroundColor: "#0D2A1F",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: 15,
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
    },
});
