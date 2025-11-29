import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsHistory() {
    const { data } = useLocalSearchParams();
    const item = data ? JSON.parse(data) : null;
    const [imageLoaded, setImageLoaded] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    if (!item) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No product details found</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/history')}
                    style={styles.primaryButton}
                >
                    <Text style={styles.primaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = item?.image?.startsWith("http")
        ? item.image
        : `https://vedaro.in/${item.image}`;

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.push('/(tabs)/history')}
                        >
                            <View style={styles.backButtonCircle}>
                                <Ionicons name="chevron-back" size={22} color="#0D2A1F" />
                            </View>
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>Order Details</Text>
                        </View>
                    </View>

                    {/* Product Image with Loading */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={[
                                styles.image,
                                imageLoaded ? {} : styles.imageLoading
                            ]}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="image-outline" size={50} color="#94A3B8" />
                            </View>
                        )}
                    </View>

                    {/* Product Details Card */}
                    <View style={styles.card}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title} numberOfLines={2}>{item.product_name}</Text>
                            <View style={styles.idBadge}>
                                <Text style={styles.idText}>ID: {item.product_id}</Text>
                            </View>
                        </View>

                        {/* Redesigned Price Section */}
                        <View style={styles.priceContainer}>
                            <View style={styles.priceLabel}>
                                <Ionicons name="pricetag" size={20} color="#0D2A1F" />
                                <Text style={styles.priceLabelText}>Total Price</Text>
                            </View>
                            <View style={styles.priceAmountContainer}>
                                <Text style={styles.priceCurrency}>₹</Text>
                                <Text style={styles.priceAmount}>{item.total}</Text>
                            </View>
                            <View style={styles.priceBreakdown}>
                                <Text style={styles.priceSubtext}>
                                    {item.quantity && `Quantity: ${item.quantity} × ₹${(item.total / item.quantity).toFixed(2)}`}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.metaInfo}>
                            <View style={styles.metaItem}>
                                <Ionicons name="cube-outline" size={16} color="#64748B" />
                                <Text style={styles.metaText}>Qty: {item.quantity ?? 1}</Text>
                            </View>

                            <View style={styles.metaItem}>
                                <Ionicons name="layers-outline" size={16} color="#64748B" />
                                <Text style={styles.metaText}>Stock: {item.stock ?? "N/A"}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Additional Details */}
                        <View style={styles.detailsGrid}>
                            {item.category && (
                                <DetailItem
                                    icon="pricetag-outline"
                                    label="Category"
                                    value={item.category}
                                />
                            )}

                            {item.variant_id && (
                                <DetailItem
                                    icon="code-outline"
                                    label="Variant ID"
                                    value={item.variant_id}
                                />
                            )}

                            {item.size && (
                                <DetailItem
                                    icon="resize-outline"
                                    label="Size"
                                    value={item.size}
                                />
                            )}

                            {item.product_type && (
                                <DetailItem
                                    icon="grid-outline"
                                    label="Type"
                                    value={item.product_type}
                                />
                            )}

                            {/* FIXED WEIGHT LOGIC (VARIANT + PRODUCT SUPPORT) */}
                            {(item.weight || item?.variant?.weight) && (
                                <DetailItem
                                    icon="barbell-outline"
                                    label="Weight"
                                    value={`${item.weight || item?.variant?.weight} g`}
                                />
                            )}


                            {item.identifier && (
                                <DetailItem
                                    icon="finger-print-outline"
                                    label="Identifier"
                                    value={item.identifier}
                                />
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/history')} style={styles.primaryButton}>
                                <Ionicons name="time-outline" size={18} color="white" />
                                <Text style={styles.primaryButtonText}>Go To History</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

// Detail Item Component
const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
        <View style={styles.detailIcon}>
            <Ionicons name={icon} size={16} color="#0D2A1F" />
        </View>
        <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    animatedContainer: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 30
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc"
    },
    errorText: {
        fontSize: 18,
        color: "#64748B",
        marginBottom: 20
    },

    // Header Styles
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#0D2A1F"
    },
    headerBadge: {
        backgroundColor: "#0D2A1F",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    headerBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },

    // Image Styles
    imageContainer: {
        position: "relative",
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 280,
        borderRadius: 20,
        backgroundColor: "#e2e8f0"
    },
    imageLoading: {
        opacity: 0
    },
    imagePlaceholder: {
        position: "absolute",
        width: "100%",
        height: 280,
        borderRadius: 20,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },

    // Card Styles
    card: {
        backgroundColor: "white",
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0D2A1F",
        flex: 1,
        marginRight: 12,
        lineHeight: 32,
    },
    idBadge: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    idText: {
        fontSize: 12,
        color: "#64748B",
        fontWeight: "500",
    },

    // Redesigned Price Section
    priceContainer: {
        backgroundColor: "#f8fafc",
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#0D2A1F",
    },
    priceLabel: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    priceLabelText: {
        fontSize: 16,
        color: "#64748B",
        fontWeight: "600",
    },
    priceAmountContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 6,
    },
    priceCurrency: {
        fontSize: 20,
        color: "#0D2A1F",
        fontWeight: "600",
        marginRight: 4,
    },
    priceAmount: {
        fontSize: 32,
        color: "#0D2A1F",
        fontWeight: "bold",
    },
    priceBreakdown: {
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        paddingTop: 8,
    },
    priceSubtext: {
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },

    // Meta Info
    metaInfo: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 16,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500",
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: "#e2e8f0",
        marginVertical: 20,
    },

    // Details Grid
    detailsGrid: {
        gap: 16,
        marginBottom: 24,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        color: "#64748B",
        fontWeight: "500",
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        color: "#0D2A1F",
        fontWeight: "600",
    },

    // Action Buttons
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#0D2A1F",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        shadowColor: "#0D2A1F",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
});