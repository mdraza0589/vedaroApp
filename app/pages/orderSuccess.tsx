import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderSuccess() {
    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={110} color="#22C55E" />

            <Text style={styles.title}>Order Placed Successfully!</Text>
            <Text style={styles.subtitle}>
                Your invoice has been created. You can now proceed to the counter.
            </Text>

            <TouchableOpacity
                style={styles.btn}
                onPress={() => router.push("/(tabs)")}
            >
                <Text style={styles.btnText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2ecdd",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginTop: 20,
        textAlign: "center",
        color: "#0D2A1F",
    },
    subtitle: {
        marginTop: 10,
        color: "#666",
        textAlign: "center",
        fontSize: 16,
        lineHeight: 22,
    },
    btn: {
        marginTop: 40,
        backgroundColor: "#0D2A1F",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 15,
    },
    btnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
});
