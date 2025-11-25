import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function CartPage() {
    // cart items state
    const [cart, setCart] = useState([
        {
            id: 1,
            name: "Wireless Headphones",
            price: 1499,
            qty: 1,
            image: 'https://cdn.pixabay.com/photo/2024/10/24/19/50/ai-generated-9146869_1280.jpg',
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 2499,
            qty: 2,
            image: 'https://cdn.pixabay.com/photo/2024/10/24/19/50/ai-generated-9146869_1280.jpg',
        },
    ]);

    const increaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    };

    // calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={'light-content'}
            />
            <AppHeaderTop title="My Cart" />


            <ScrollView style={{ padding: 15 }}>
                {cart.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.price}>₹ {item.price}</Text>

                            {/* Quantity Box */}
                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => decreaseQty(item.id)}
                                >
                                    <Text style={styles.qtyBtnText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.qtyText}>{item.qty}</Text>

                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => increaseQty(item.id)}
                                >
                                    <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Total Section */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalTitle}>Total Amount</Text>
                    <Text style={styles.totalAmount}>₹ {total}</Text>
                </View>

                {/* Checkout Button */}
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/pages/checkoutPage')}>
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: "row",
        elevation: 2,
        paddingBottom: 20,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
        resizeMode: "contain",
    },
    productName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: "green",
        fontWeight: "600",
        marginBottom: 10,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    qtyBtn: {
        width: 35,
        height: 35,
        backgroundColor: "#F2F2F2",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    qtyBtnText: {
        fontSize: 20,
        fontWeight: "700",
    },
    qtyText: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 15,
    },
    totalCard: {
        marginTop: 10,
        marginBottom: 20,
    },
    totalTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: "700",
        color: "green",
        marginTop: 5,
    },
    checkoutBtn: {
        backgroundColor: "#0D2A1F",
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 40,
    },
    checkoutText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
});
