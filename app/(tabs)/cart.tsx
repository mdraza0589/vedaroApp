import { decreaseCartItem, getCartData, increaseCartItem } from "@/server/api";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppHeaderTop from "../components/appHeader";

interface CartItem {
  cart_id: number;
  product_id: number;
  variant_id: number | null;
  name: string;
  image: string | null;
  size: string;
  quantity: number;
  total: number;
  price: number;
  stock: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      const res = await getCartData();

      if (res.data.success) {
        const formatted = res.data.data.map((item: any) => ({
          ...item,
          stock: Number(item.available_stock ?? 0),
          price: Number(item.price ?? item.total / item.quantity),
        }));

        setCart(formatted);
      }
    } catch (err) {
      console.log("CART FETCH ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🌿 Pull-to-Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCart();
  }, []);

  // Refresh when coming back
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = async (cart_id: number, stock: number, qty: number) => {
    if (qty >= stock) return Alert.alert("Stock Limit", "No more stock available.");

    setUpdatingId(cart_id);
    try {
      await increaseCartItem(cart_id);
      fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQty = async (cart_id: number, qty: number) => {
    if (qty <= 1) {
      return Alert.alert("Remove item?", "This item will be removed.", [
        { text: "Cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setUpdatingId(cart_id);
            await decreaseCartItem(cart_id);
            fetchCart();
            setUpdatingId(null);
          },
        },
      ]);
    }

    setUpdatingId(cart_id);
    try {
      await decreaseCartItem(cart_id);
      fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClickItem = (item: CartItem) => {
    router.push(`/pages/productDetailOfCart?id=${item.product_id}`);
    console.log(item);

  }


  const totalAmount = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);

  if (!loading && cart.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeaderTop title="My Cart" />
        <View style={[styles.center, { backgroundColor: "#f2ecdd" }]}>
          <Text style={{ fontSize: 50 }}>🛒</Text>
          <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>Your cart is empty</Text>
          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: "#0D2A1F", padding: 12, borderRadius: 10 }}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <AppHeaderTop title="My Cart" />

      <ScrollView
        style={{ padding: 15 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D2A1F" />
        }
      >
        {cart.map((item) => (
          <TouchableOpacity
            key={item.cart_id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleClickItem(item)} >
            <Image
              source={{ uri: item.image || "https://via.placeholder.com/100" }}
              style={styles.productImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>

              <Text style={styles.price}>₹ {Number(item.total).toFixed(2)}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.cart_id, item.quantity)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>
                  {updatingId === item.cart_id ? "..." : item.quantity}
                </Text>

                <TouchableOpacity
                  style={[styles.qtyBtn, item.quantity >= item.stock && { opacity: 0.4 }]}
                  onPress={() =>
                    increaseQty(item.cart_id, item.stock, item.quantity)
                  }
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.stockText}>
                Total Stock: {item.stock} | Remaining: {item.stock - item.quantity}
              </Text>
            </View>
          </TouchableOpacity>
        ))}


        <View style={styles.totalCard}>
          <Text style={styles.totalTitle}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹ {totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            cart.length === 0 && { backgroundColor: "#9BA29D", opacity: 0.4 }
          ]}
          disabled={cart.length === 0}
          onPress={() => {
            if (cart.length > 0) router.push("/pages/checkoutPage");
          }}
        >
          <Text style={[styles.checkoutText, cart.length === 0 && { color: "#ddd" }]}>
            {cart.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2ecdd" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    elevation: 2,
  },
  productImage: { width: 60, height: 60, marginRight: 15, resizeMode: "contain" },
  productName: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
  price: { fontSize: 16, color: "green", fontWeight: "600" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyBtn: {
    width: 35,
    height: 35,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 20, fontWeight: "700" },
  qtyText: { marginHorizontal: 15, fontSize: 18 },
  stockText: { fontSize: 14, marginTop: 5, color: "#555" },
  totalCard: { marginVertical: 20 },
  totalTitle: { fontSize: 20, fontWeight: "700" },
  totalAmount: { fontSize: 28, color: "green", fontWeight: "700" },
  checkoutBtn: {
    backgroundColor: "#0D2A1F",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 50,
  },
  checkoutText: { color: "white", fontWeight: "700", fontSize: 18 },
});



