import { addToCart } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const { data } = useLocalSearchParams();
    const productData = data ? JSON.parse(String(data)) : null;
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('details');

    if (!productData) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#64748B" />
                <Text style={styles.errorText}>No product data found</Text>
            </View>
        );
    }

    const qrIdentifier = productData?.identifier ?? "";
    const variant = productData?.variant ?? null;

    // PRICE CALCULATION
    const price = Number(
        variant?.discount_price ||
        variant?.price ||
        productData?.discount_price ||
        productData?.price
    );
    const originalPrice = variant?.price || productData?.price;
    const hasDiscount = variant?.discount_price || productData?.discount_price;

    // STOCK & DETAILS
    const stock = Number(variant?.stock || productData?.stock);
    const weight = variant?.weight || productData?.weight;
    const size = variant?.size || "Free Size";

    const imageUrl = productData?.image
        ? `https://vedaro.in/storage/products/${productData.image}`
        : "https://cdn.pixabay.com/photo/2024/02/19/11/27/cross-8583223_1280.jpg";

    // QUANTITY HANDLERS
    const increaseQty = () => qty < stock && setQty(qty + 1);
    const decreaseQty = () => qty > 1 && setQty(qty - 1);
    const totalAmount = price * qty;

    const handleHomePress = () => {
        Alert.alert(
            "Go to Home?",
            "Are you sure you want to leave this page?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, Go Home",
                    style: "destructive",
                    onPress: () => router.push("/(tabs)")
                }
            ],
            { cancelable: true }
        );
    };


    // ADD TO CART
    const handleAddToCart = async () => {
        try {
            const res = await addToCart(qrIdentifier, qty);

            if (res.data.success) {
                // Custom 2-button popup
                Alert.alert(
                    "🎉 Added to Cart!",
                    `${productData.product_name} added successfully.`,
                    [
                        {
                            text: "Go to Home",
                            style: "cancel",
                            onPress: () => router.push("/(tabs)")
                        },
                        {
                            text: "Go to Cart",
                            onPress: () => router.push("/(tabs)/cart")
                        }
                    ],
                    { cancelable: true }
                );
            }
            else {
                Alert.alert("⚠️ Error", res.data.message || "Failed to add item");
            }

        } catch (err: any) {
            Alert.alert("❌ Error", err.response?.data?.message || "Something went wrong");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Ionicons name="chevron-back" size={24} color="#0D2A1F" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <View></View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* PRODUCT IMAGE */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                    {hasDiscount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                            </Text>
                        </View>
                    )}
                </View>

                {/* PRODUCT INFO */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{productData.product_name}</Text>
                        <View style={styles.stockBadge}>
                            <Ionicons
                                name={stock > 0 ? "checkmark-circle" : "close-circle"}
                                size={16}
                                color={stock > 0 ? "#22C55E" : "#EF4444"}
                            />
                            <Text style={{ color: stock > 0 ? "green" : "red" }}>
                                {stock > 0 ? `${stock} in stock` : "Out of Stock"}
                            </Text>

                        </View>
                    </View>

                    <Text style={styles.category}>{productData.category}</Text>

                    {/* PRICE */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{price}</Text>
                        {hasDiscount && (
                            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
                        )}
                    </View>

                    {/* QUANTITY CONTROLLER */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantity</Text>
                        <View style={styles.qtyWrapper}>
                            <TouchableOpacity
                                onPress={decreaseQty}
                                style={[styles.qtyBtn, qty === 1 && styles.disabledBtn]}
                                disabled={qty === 1}
                            >
                                <Ionicons name="remove" size={20} color={qty === 1 ? "#94A3B8" : "white"} />
                            </TouchableOpacity>

                            <Text style={styles.qtyValue}>{qty}</Text>

                            <TouchableOpacity
                                onPress={increaseQty}
                                style={[styles.qtyBtn, qty === stock && styles.disabledBtn]}
                                disabled={qty === stock}
                            >
                                <Ionicons name="add" size={20} color={qty === stock ? "#94A3B8" : "white"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* TOTAL AMOUNT */}
                    <View style={styles.totalBox}>
                        <Text style={styles.totalText}>Total Amount</Text>
                        <Text style={styles.totalAmount}>₹{totalAmount}</Text>
                    </View>

                    {/* DETAILS TABS */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
                            onPress={() => setActiveTab('details')}
                        >
                            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
                                Details
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'specs' && styles.activeTab]}
                            onPress={() => setActiveTab('specs')}
                        >
                            <Text style={[styles.tabText, activeTab === 'specs' && styles.activeTabText]}>
                                Specifications
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* TAB CONTENT */}
                    <View style={styles.tabContent}>
                        {activeTab === 'details' ? (
                            <View style={styles.detailsList}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="scale-outline" size={18} color="#64748B" />
                                    <Text style={styles.detailLabel}>Weight:</Text>
                                    <Text style={styles.detailValue}>{weight} gm</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="resize-outline" size={18} color="#64748B" />
                                    <Text style={styles.detailLabel}>Size:</Text>
                                    <Text style={styles.detailValue}>{size}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="cube-outline" size={18} color="#64748B" />
                                    <Text style={styles.detailLabel}>Stock:</Text>
                                    <Text style={styles.detailValue}>{stock} units</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="pricetag-outline" size={18} color="#64748B" />
                                    <Text style={styles.detailLabel}>Product Type:</Text>
                                    <Text style={styles.detailValue}>{productData.product_type}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.specsList}>
                                {variant && (
                                    <View style={styles.specItem}>
                                        <Text style={styles.specLabel}>Variant ID</Text>
                                        <Text style={styles.specValue}>{variant.variant_id}</Text>
                                    </View>
                                )}
                                <View style={styles.specItem}>
                                    <Text style={styles.specLabel}>Identifier</Text>
                                    <Text style={styles.specValue}>{qrIdentifier}</Text>
                                </View>
                                <View style={styles.specItem}>
                                    <Text style={styles.specLabel}>SKU</Text>
                                    <Text style={styles.specValue}>{productData.sku || 'N/A'}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* FLOATING ACTION BUTTONS */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={handleHomePress}
                >
                    <Ionicons name="home-outline" size={22} color="#0D2A1F" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cartBtn, stock === 0 && styles.disabledCartBtn]}
                    onPress={handleAddToCart}
                    disabled={stock === 0}
                >
                    <Ionicons name="cart-outline" size={22} color="white" />
                    <Text style={styles.cartBtnText}>
                        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: "#64748B",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#F1F8E9',
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D2A1F',
    },
    shareButton: {
        padding: 8,
        backgroundColor: '#F1F8E9',
        borderRadius: 10,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#F8FAFC',
    },
    productImage: {
        width: width * 0.7,
        height: width * 0.7,
        resizeMode: 'contain',
    },
    discountBadge: {
        position: 'absolute',
        top: 30,
        right: 30,
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0D2A1F',
        flex: 1,
        marginRight: 10,
    },
    stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    stockText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    category: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    price: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0D2A1F',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 18,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0D2A1F',
    },
    qtyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        backgroundColor: '#0D2A1F',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    disabledBtn: {
        backgroundColor: '#E2E8F0',
    },
    qtyValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0D2A1F',
        width: 40,
        textAlign: 'center',
    },
    totalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F1F8E9',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0D2A1F',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0D2A1F',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#0D2A1F',
    },
    tabContent: {
        marginBottom: 100,
    },
    detailsList: {
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748B',
        marginLeft: 12,
        marginRight: 'auto',
        width: 100,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0D2A1F',
    },
    specsList: {
        gap: 12,
    },
    specItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    specLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0D2A1F',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 12,
    },
    homeBtn: {
        width: 50,
        height: 50,
        backgroundColor: '#F1F8E9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DCEDC8',
    },
    cartBtn: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0D2A1F',
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    disabledCartBtn: {
        backgroundColor: '#94A3B8',
    },
    cartBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});