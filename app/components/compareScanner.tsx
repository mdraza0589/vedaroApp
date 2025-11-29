import { addToCart, getCartData, increaseCartItem, scanProduct } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
    BarcodeScanningResult,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type Product = {
    identifier: string;
    product_name: string;
    price: number;
    original_price: number;
    stock: number;
    image: string | null;
    weight: string | number;
    size: string;
    category: string;
    product_type: string;
};

export default function CompareScanner() {
    const [permission, requestPermission] = useCameraPermissions();

    const [products, setProducts] = useState<Product[]>([]);
    const [lastScan, setLastScan] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"grid" | "table">("grid");
    const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
    const [torchOn, setTorchOn] = useState(false);
    const [cameraKey, setCameraKey] = useState(Date.now());

    useFocusEffect(
        useCallback(() => {
            setCameraKey(Date.now());
            setLastScan(null);
            setProducts([]);
            setActiveTab("grid");
        }, [])
    );

    const normalizeProduct = (p: any): Product => ({
        identifier: p.identifier,
        product_name: p.product_name || p.name || "Unnamed Product",
        price: Number(
            p?.variant?.discount_price ??
            p?.discount_price ??
            p?.variant?.price ??
            p?.price ??
            0
        ),
        original_price: Number(p?.variant?.price ?? p?.price ?? 0),
        stock: Number(p?.variant?.stock ?? p?.stock ?? p?.available_stock ?? 0),
        image: p?.image ?? p?.variant?.image ?? null,
        weight: p?.variant?.weight ?? p?.weight ?? "N/A",
        size: p?.variant?.size ?? p?.size ?? "Free Size",
        category: p?.category ?? "N/A",
        product_type: p?.product_type ?? "Simple",
    });

    const handleScan = async (event: BarcodeScanningResult) => {
        if (!event?.data || event.data === lastScan) return;

        setLastScan(event.data);
        Vibration.vibrate(100);

        if (products.some((p) => p.identifier === event.data)) {
            setDuplicateMessage("⚠️ Already scanned");
            setTimeout(() => setDuplicateMessage(null), 1200);
            return;
        }

        if (products.length >= 3)
            return Alert.alert("Limit reached", "You can scan max 3 items.");

        try {
            const res = await scanProduct(event.data);

            if (res.data.success) {
                const formatted = normalizeProduct(res.data.product);
                setProducts((prev) => [...prev, formatted]);

                if (products.length === 1) setActiveTab("table");
            } else {
                Alert.alert("Invalid QR", "No product found.");
            }
        } catch {
            Alert.alert("Error", "Scan failed.");
        } finally {
            setTimeout(() => setLastScan(null), 1000);
        }
    };

    const removeItem = (id: string) => {
        setProducts((prev) => prev.filter((i) => i.identifier !== id));
        if (products.length <= 2) setActiveTab("grid");
    };

    // ----------------------------------------------------------
    //  NEW FUNCTION: addOrIncreaseCartItem()
    // ----------------------------------------------------------
    const addOrIncreaseCartItem = async (productId: string) => {
        try {
            const res = await getCartData();
            if (!res?.data?.success) return;

            const cartItems = res.data.data;

            // check if product exists in cart
            const existing = cartItems.find(
                (it: any) => String(it.product_id) === String(productId)
            );

            if (existing) {
                await increaseCartItem(existing.cart_id);
                Alert.alert("Updated", "Quantity increased in your cart.");
                return;
            }

            await addToCart(productId, 1);
        } catch (e) {
            console.log("Cart Error:", e);
            Alert.alert("Error", "some item is already in cart");
        }
    };

    // UPDATED handleAddOne
    const handleAddOne = async (item: Product) => {
        Alert.alert("Add?", `Add ${item.product_name} to cart?`, [
            { text: "Cancel" },
            {
                text: "Go to Cart",
                onPress: async () => {
                    await addOrIncreaseCartItem(item.identifier);
                    router.push("/(tabs)/cart");
                },
            },
        ]);
    };

    // UPDATED handleAddAll
    const handleAddAll = async () => {
        if (!products.length) return;

        Alert.alert("Add all?", "Add all items to cart?", [
            { text: "Cancel" },
            {
                text: "Go",
                onPress: async () => {
                    for (const item of products) {
                        await addOrIncreaseCartItem(item.identifier);
                    }
                    router.push("/(tabs)/cart");
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {!permission?.granted ? (
                <View style={styles.center}>
                    <Text style={{ fontSize: 18, marginBottom: 20 }}>
                        Camera permission needed
                    </Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.btn}>
                        <Text style={{ color: "white" }}>Allow Camera</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Ionicons name="arrow-back" size={24} color="#0f2a1d" />
                    </TouchableOpacity>

                    {products.length < 3 && (
                        <TouchableOpacity
                            style={[styles.backButton, { right: 20, left: undefined }]}
                            onPress={() => setTorchOn(!torchOn)}
                        >
                            <Ionicons
                                name={torchOn ? "flash" : "flash-off"}
                                size={26}
                                color="yellow"
                            />
                        </TouchableOpacity>
                    )}

                    {products.length < 3 && (
                        <View style={styles.cameraWrapper}>
                            <CameraView
                                key={cameraKey}
                                enableTorch={torchOn}
                                style={StyleSheet.absoluteFill}
                                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                                onBarcodeScanned={handleScan}
                            />
                        </View>
                    )}
                </>
            )}

            {duplicateMessage && (
                <View style={styles.toastMessage}>
                    <Text style={styles.toastText}>{duplicateMessage}</Text>
                </View>
            )}

            {products.length > 0 && (
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "grid" && styles.activeTab]}
                        onPress={() => setActiveTab("grid")}
                    >
                        <Text style={[styles.tabText, activeTab === "grid" && styles.activeTabText]}>
                            Grid ({products.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === "table" && styles.activeTab]}
                        disabled={products.length < 2}
                        onPress={() => setActiveTab("table")}
                    >
                        <Text style={[styles.tabText, activeTab === "table" && styles.activeTabText]}>
                            Compare
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {products.length > 0 && (
                <TouchableOpacity style={styles.addAllBtn} onPress={handleAddAll}>
                    <Ionicons name="cart" size={22} color="white" />
                    <Text style={styles.addAllText}>Add All</Text>
                </TouchableOpacity>
            )}

            <ScrollView style={styles.content}>
                {activeTab === "grid" ? (
                    <View style={styles.grid}>
                        {products.map((item) => (
                            <View key={item.identifier} style={styles.gridCard}>
                                <TouchableOpacity
                                    style={styles.removeIcon}
                                    onPress={() => removeItem(item.identifier)}
                                >
                                    <Ionicons name="close-circle" size={26} color="#e63946" />
                                </TouchableOpacity>

                                <Image
                                    source={{
                                        uri: `https://vedaro.in/storage/products/${item.image}`,
                                    }}
                                    style={styles.productImage}
                                />

                                <Text style={styles.name}>{item.product_name}</Text>
                                <Text style={styles.price}>₹{item.price}</Text>

                                <TouchableOpacity
                                    style={[
                                        styles.cartBtn,
                                        item.stock === 0 && styles.disabledCartBtn,
                                    ]}
                                    disabled={item.stock === 0}
                                    onPress={() => handleAddOne(item)}
                                >
                                    <Text style={styles.cartBtnText}>
                                        {item.stock > 0 ? "Add" : "Unavailable"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.tableContainer}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableLabelCell}>Feature</Text>
                            {products.map((item) => (
                                <View key={item.identifier} style={styles.tableCell}>
                                    <TouchableOpacity
                                        style={styles.removeIcon}
                                        onPress={() => removeItem(item.identifier)}
                                    >
                                        <Ionicons name="close-circle" size={22} color="#e63946" />
                                    </TouchableOpacity>

                                    <Image
                                        source={{
                                            uri: `https://vedaro.in/storage/products/${item.image}`,
                                        }}
                                        style={styles.tableImage}
                                    />

                                    <Text style={styles.tableProductName}>
                                        {item.product_name}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {[
                            { label: "Price", key: "price" },
                            { label: "MRP", key: "original_price" },
                            { label: "Stock", key: "stock" },
                            { label: "Category", key: "category" },
                            { label: "Weight", key: "weight" },
                            { label: "Type", key: "product_type" },
                            { label: "Size", key: "size" },
                        ].map((row) => (
                            <View key={row.key} style={styles.tableRow}>
                                <Text style={styles.tableLabelCell}>{row.label}</Text>
                                {products.map((item) => (
                                    <Text key={item.identifier} style={styles.tableCell}>
                                        {row.key === "price" || row.key === "original_price"
                                            ? `₹${item[row.key as keyof Product]}`
                                            : String(item[row.key as keyof Product])}
                                    </Text>
                                ))}
                            </View>
                        ))}

                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabelCell}>Action</Text>
                            {products.map((item) => (
                                <View key={item.identifier} style={styles.tableCell}>
                                    <TouchableOpacity
                                        key={item.identifier}
                                        style={[
                                            styles.tableCartBtn,
                                            item.stock === 0 && styles.disabledCartBtn,
                                        ]}
                                        disabled={item.stock === 0}
                                        onPress={() => handleAddOne(item)}
                                    >
                                        <Text style={styles.cartBtnText}>
                                            {item.stock > 0 ? "Add" : "Unavailable"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {products.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="qr-code-outline" size={80} color="#999" />
                    <Text style={styles.emptyStateText}>Start scanning items</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f2ecdd", paddingTop: 40 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    btn: { backgroundColor: "#0f2a1d", padding: 10, borderRadius: 8 },
    content: { flex: 1 },
    cameraWrapper: { height: 240, margin: 15, borderRadius: 15, overflow: "hidden" },
    backButton: {
        position: "absolute",
        top: 60,
        left: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        zIndex: 99,
        elevation: 3,
    },
    toastMessage: {
        position: "absolute",
        top: 110,
        alignSelf: "center",
        backgroundColor: "#ffeb3b",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        zIndex: 999,
    },
    toastText: { color: "#333", fontWeight: "600" },
    tabContainer: { flexDirection: "row", margin: 15 },
    tab: { flex: 1, padding: 10, alignItems: "center" },
    activeTab: { borderBottomWidth: 3, borderBottomColor: "#0f2a1d" },
    tabText: { color: "#777" },
    activeTabText: { color: "#0f2a1d", fontWeight: "700" },
    addAllBtn: {
        flexDirection: "row",
        backgroundColor: "#0f2a1d",
        padding: 14,
        borderRadius: 12,
        justifyContent: "center",
        marginHorizontal: 15,
    },
    addAllText: { color: "white", marginLeft: 8, fontSize: 16 },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    gridCard: {
        width: "48%",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
    },
    removeIcon: { position: "absolute", right: 8, top: 8, zIndex: 10 },
    productImage: { width: 100, height: 100, borderRadius: 8 },
    name: { textAlign: "center", marginTop: 8, fontWeight: "700", fontSize: 14 },
    price: { marginTop: 5, fontSize: 16, color: "#0f2a1d", fontWeight: "700" },
    cartBtn: {
        marginTop: 10,
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#0f2a1d",
        width: "100%",
        borderRadius: 8,
        justifyContent: "center",
    },
    disabledCartBtn: { backgroundColor: "#aaa" },
    cartBtnText: { color: "white", fontSize: 8 },
    tableContainer: { margin: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 12 },
    tableRow: { flexDirection: "row", minHeight: 60, borderBottomWidth: 1, borderBottomColor: "#eee" },
    tableHeader: { backgroundColor: "#f7f7f7" },
    tableLabelCell: {
        width: width * 0.3,
        padding: 10,
        backgroundColor: "#f9f9f9",
        fontWeight: "bold",
        borderRightWidth: 1,
        borderRightColor: "#eee",
    },
    tableCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 6,
    },
    tableImage: { width: 50, height: 50, borderRadius: 6 },
    tableProductName: { fontWeight: "600", fontSize: 12, textAlign: "center" },
    tableCartBtn: {
        flexDirection: "row",
        backgroundColor: "#0f2a1d",
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyState: { justifyContent: "center", alignItems: "center", marginTop: 80 },
    emptyStateText: { fontSize: 18, color: "#777", marginTop: 10 },
});
