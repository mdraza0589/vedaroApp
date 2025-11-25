import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductDetails() {
    const { data } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product Details</Text>

            {/* Product Image */}
            {data && (
                <Image
                    source={{ uri: String(data) }}
                    style={styles.productImage}
                />
            )}

            <Text style={styles.info}>Scanned Data: {data}</Text>

            {/* Home Button */}
            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push("/(tabs)")}
            >
                <Ionicons name="home-outline" size={24} color="white" />
                <Text style={styles.homeText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
    },
    productImage: {
        width: 250,
        height: 250,
        borderRadius: 12,
        marginBottom: 20,
        resizeMode: "contain",
    },
    info: {
        fontSize: 18,
        color: "#444",
        marginBottom: 30,
    },
    homeButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D2A1F",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    homeText: {
        color: "white",
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "600",
    },
});
