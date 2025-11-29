import { getCartData } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CartItem {
    product_id: number | string;
    name?: string;
    product_name?: string;
    image?: string;
    brand_name?: string;
    price?: number;
    discount_price?: number;
    description?: string;
    identifier?: string;
    stock?: number;
    weight?: string | number;
    size?: string;
    category?: string;
    product_type?: string;
    variant?: any;
    product?: any;
    actual_price?: number;
    total?: number;
    quantity?: number;
}

export default function ProductDetailOfCart() {
    const { id, source, stock: passedStock } = useLocalSearchParams<{ id: string; source?: string; stock?: any }>();
    const [item, setItem] = useState<CartItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            setLoading(true);
            const res = await getCartData();
            const cartData: CartItem[] = res.data?.data ?? [];
            const found = cartData.find(
                (p) => String(p.product_id) === String(id)
            ) || null;
            setItem(found);
        } catch (error) {
            console.log("Error loading item:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#0D2A1F" />
                    <Text style={styles.loadingText}>Loading product details...</Text>
                </View>
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorContent}>
                    <View style={styles.errorIconContainer}>
                        <Ionicons name="alert-circle-outline" size={80} color="#64748B" />
                    </View>
                    <Text style={styles.errorTitle}>Product Not Found</Text>
                    <Text style={styles.errorSubtitle}>The product you're looking for is not available in your cart</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const product = item.variant || item.product || item;
    const stock = passedStock ?? item.stock ?? item?.variant?.stock ?? product.available_stock ?? product.current_stock ?? product.total_stock ?? 0;
    const name = product.name || item.product_name || item.name || "Unknown Product";
    const brand = product.brand || item.brand_name || "N/A";
    const imageUrl = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `https://vedaro.in/${product.image}`
        : "https://via.placeholder.com/300";
    const price = product.total ?? item.total ?? product.price ?? item.price ?? 0;
    const ActualPrice = product.actual_price ?? item.actual_price ?? product.price ?? item.price ?? price;
    const originalPrice = Number(product.price || item.price || ActualPrice);
    const quantity = item.quantity ?? product.quantity ?? product.qty ?? product.cart_quantity ?? 1;

    const handleBack = () => {
        router.push("/(tabs)/cart");
    };

    const hasDiscount = originalPrice > price;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <View style={styles.backButtonInner}>
                            <Ionicons name="chevron-back" size={24} color="#0D2A1F" />
                            <Text style={styles.backButtonText}>Back to Cart</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Product Image */}
                <View style={styles.imageSection}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                        {hasDiscount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountBadgeText}>{discountPercentage}% OFF</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Product Info Card */}
                <View style={styles.infoCard}>
                    {/* Brand & Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.brand}>{brand}</Text>
                        <Text style={styles.title}>{name}</Text>
                    </View>

                    {/* Price Section */}
                    <View style={styles.priceSection}>
                        <View style={styles.priceRow}>
                            <Text style={styles.currentPrice}>₹{price}</Text>
                            {hasDiscount && (
                                <View style={styles.originalPriceContainer}>
                                    <Text style={styles.originalPrice}>₹{originalPrice}</Text>
                                    <View style={styles.discountLine} />
                                </View>
                            )}
                        </View>
                        {hasDiscount && (
                            <View style={styles.savingsTag}>
                                <Ionicons name="pricetag-outline" size={14} color="#059669" />
                                <Text style={styles.savingsText}>Save ₹{originalPrice - price}</Text>
                            </View>
                        )}
                    </View>

                    {/* Stock & Quantity */}
                    <View style={styles.stockSection}>
                        <View style={[styles.stockBadge, stock > 0 ? styles.inStock : styles.outOfStock]}>
                            <Ionicons
                                name={stock > 0 ? "checkmark-circle" : "close-circle"}
                                size={16}
                                color={stock > 0 ? "#059669" : "#DC2626"}
                            />
                            <Text style={[
                                styles.stockText,
                                stock > 0 ? styles.inStockText : styles.outOfStockText
                            ]}>
                                {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                            </Text>
                        </View>
                        <View style={styles.quantityBadge}>
                            <Ionicons name="cart" size={16} color="#0D2A1F" />
                            <Text style={styles.quantityText}>Qty: {quantity}</Text>
                        </View>
                    </View>

                    {/* Product Details Grid */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.detailsTitle}>Product Details</Text>
                        <View style={styles.detailsGrid}>
                            <DetailItem icon="cash-outline" label="Price" value={String(ActualPrice)} />
                            <DetailItem icon="barcode-outline" label="Identifier" value={String(product.identifier || item.identifier)} />
                            <DetailItem icon="pricetag-outline" label="Category" value={String(product.category || item.category)} />
                            <DetailItem icon="scale-outline" label="Weight" value={`${product.weight || item.weight} gm`} />
                            <DetailItem icon="resize-outline" label="Size" value={product.size || item.size} />
                            <DetailItem icon="cube-outline" label="Type" value={product.product_type || item.product_type} />
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                        <Ionicons name="cart-outline" size={20} color="#0D2A1F" />
                        <Text style={styles.secondaryButtonText}>View Cart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function DetailItem({ icon, label, value }: { icon: any; label: string; value: string | null }) {
    if (!value || value === "N/A" || value === "null" || value === "undefined") return null;

    return (
        <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
                <View style={styles.detailIcon}>
                    <Ionicons name={icon} size={18} color="#0D2A1F" />
                </View>
            </View>
            <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    scrollContent: {
        paddingBottom: 40
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc"
    },
    loadingContent: {
        alignItems: "center",
        gap: 16
    },
    loadingText: {
        fontSize: 16,
        color: "#64748B",
        fontWeight: "500"
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8fafc"
    },
    errorContent: {
        alignItems: "center",
        gap: 16
    },
    errorIconContainer: {
        padding: 20,
        backgroundColor: "#f1f5f9",
        borderRadius: 50
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0D2A1F",
        textAlign: "center"
    },
    errorSubtitle: {
        fontSize: 16,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
        maxWidth: 300
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    backButton: {
        borderRadius: 12,
        overflow: "hidden"
    },
    backButtonInner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        paddingLeft: 0
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 4,
        color: "#0D2A1F"
    },
    imageSection: {
        paddingHorizontal: 20,
        marginBottom: 24
    },
    imageContainer: {
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8
    },
    image: {
        width: "100%",
        height: 320,
        backgroundColor: "#e2e8f0"
    },
    discountBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "#DC2626",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    discountBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold"
    },
    infoCard: {
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8
    },
    titleSection: {
        marginBottom: 20
    },
    brand: {
        fontSize: 14,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0D2A1F",
        lineHeight: 28
    },
    priceSection: {
        marginBottom: 20
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8
    },
    currentPrice: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0D2A1F"
    },
    originalPriceContainer: {
        position: "relative"
    },
    originalPrice: {
        fontSize: 18,
        color: "#94a3b8",
        fontWeight: "500"
    },
    discountLine: {
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#94a3b8"
    },
    savingsTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: "flex-start"
    },
    savingsText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#059669"
    },
    stockSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24
    },
    stockBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "#F0F9FF"
    },
    inStock: {
        backgroundColor: "#F0FDF4"
    },
    outOfStock: {
        backgroundColor: "#FEF2F2"
    },
    stockText: {
        fontSize: 14,
        fontWeight: "600"
    },
    inStockText: {
        color: "#059669"
    },
    outOfStockText: {
        color: "#DC2626"
    },
    quantityBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0"
    },
    quantityText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0D2A1F"
    },
    detailsSection: {
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        paddingTop: 20
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0D2A1F",
        marginBottom: 16
    },
    detailsGrid: {
        gap: 4
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: "#f8fafc"
    },
    detailIconContainer: {
        width: 40,
        alignItems: "center"
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#E0F2FE",
        justifyContent: "center",
        alignItems: "center"
    },
    detailContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    detailLabel: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500"
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0D2A1F",
        flex: 1,
        textAlign: "right"
    },
    actionSection: {
        marginTop: 24,
        paddingHorizontal: 20
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#0D2A1F",
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
        color: "#0D2A1F"
    },
    primaryButton: {
        marginTop: 20,
        backgroundColor: "#0D2A1F",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
});