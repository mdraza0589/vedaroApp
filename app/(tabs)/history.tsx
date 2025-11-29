import { invoiceItemsHistory } from "@/server/api";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  LayoutAnimation,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function HistoryPage() {

  const formatPrice = (value: any) => Number(value || 0).toFixed(2);

  type InvoiceItem = {
    product_id: number;
    product_name: string;
    image: string;
    quantity?: number;
    price: number;
    total?: number;
    actual_price?: number;
    stock?: number;
    weight?: string | number;
    size?: string;
    category?: string;
    product_type?: string;
    identifier?: string;
    variant_id: number | null;
  };

  type OrderItem = {
    id: number;
    customer_name: string;
    price: number;
    created_at: string;
    status: "Delivered" | "Pending";
    image: string;
    items: InvoiceItem[];
  };

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [rotateAnim] = useState(new Animated.Value(0));

  // 👇 Pagination storage for order items (key = orderId)
  const [visibleCounts, setVisibleCounts] = useState<{ [key: number]: number }>({});

  // 👇 Pagination for orders list
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(5);

  const statusStyle: Record<"Delivered" | "Pending", any> = {
    Delivered: styles.delivered,
    Pending: styles.pending
  };

  const statusConfig = {
    Delivered: { label: "Delivered", icon: "✓" },
    Pending: { label: "Processing", icon: "⏳" }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await invoiceItemsHistory();

      if (res.data?.data) {
        const invoices = res.data.data;

        const formatted = invoices.map((invoice: any) => {
          return {
            id: invoice.pending_invoice_id,
            customer_name: invoice.customer_name || "Unknown Customer",
            price: Number(invoice.grand_total || 0),
            created_at: invoice.invoice_date,
            status: invoice.status === "completed" ? "Delivered" : "Pending",
            image: `https://vedaro.in/${invoice.items?.[0]?.product?.image || ""}`,
            items: invoice.items.map((it: any) => {

              const product = it.product;
              const variant = it.variant;

              const stock =
                variant?.stock !== undefined && variant?.stock !== null
                  ? Number(variant.stock)
                  : product?.current_stock !== undefined && product?.current_stock !== null
                    ? Number(product.current_stock)
                    : product?.total_stock !== undefined && product?.total_stock !== null
                      ? Number(product.total_stock)
                      : it.quantity;

              return {
                product_id: Number(product?.id),
                product_name: product?.name || "Unnamed",
                image: `https://vedaro.in/${product?.image || ""}`,
                quantity: it.quantity || 1,
                price: Number(it.rate || it.amount),
                total: Number(it.amount || it.total_with_tax),
                actual_price: Number(it.rate || it.amount),
                stock,
                weight: variant?.weight || product?.weight || "N/A",
                size: variant?.size || product?.size || "N/A",
                category: product?.category || "N/A",
                product_type: product?.product_type || variant?.type || "N/A",
                identifier: product?.identifier || null,
                variant_id: variant?.id || null,
              };

            })
          };
        });

        setOrders(formatted);
      }
    } catch (err) {
      console.log("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchHistory(); }, []));

  const toggleOrder = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // when expanding a new order set default visible count
    if (expandedOrder !== id) {
      setVisibleCounts(prev => ({ ...prev, [id]: 5 }));
    }

    Animated.timing(rotateAnim, {
      toValue: expandedOrder === id ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setExpandedOrder(prev => prev === id ? null : id);
  };

  const handleClickProductDetail = (item: InvoiceItem) => {
    router.push({
      pathname: "/pages/detailsHistory",
      params: {
        data: JSON.stringify(item),
        source: "history"
      }
    });
  };

  const rotateIcon = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.screenContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <AppHeaderTop title="Order History" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.heading}>Your Orders</Text>
          <Text style={styles.subtitle}>Track and manage your order history</Text>
        </View>

        {loading && (
          <View style={styles.loaderWrapper}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#0D2A1F" />
              <Text style={styles.loadingText}>Loading your orders...</Text>
            </View>
          </View>
        )}

        {!loading && orders.length === 0 && (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyIllustration}>
              <Text style={styles.emptyIcon}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          </View>
        )}

        {!loading && orders.length > 0 && (
          <View style={styles.ordersList}>
            {[...orders].reverse().slice(0, visibleOrdersCount).map((order) => (
              <View key={order.id} style={styles.orderBlock}>
                <TouchableOpacity
                  onPress={() => toggleOrder(order.id)}
                  style={styles.card}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoContainer}>
                    <View style={styles.topRow}>
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>{order.customer_name}</Text>
                        <Text style={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Text>
                      </View>
                      <Animated.Text style={[styles.expandIcon, { transform: [{ rotate: rotateIcon }] }]}>
                        ⌄
                      </Animated.Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <View style={styles.priceSection}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.price}>₹{formatPrice(order.price)}</Text>
                      </View>

                      <View style={styles.itemCountBadge}>
                        <Text style={styles.itemCountText}>{order.items.length}</Text>
                      </View>

                      <View style={styles.statusSection}>
                        <View style={[styles.statusBadge, statusStyle[order.status]]}>
                          <Text style={styles.statusIcon}>{statusConfig[order.status].icon}</Text>
                          <Text style={styles.statusText}>{statusConfig[order.status].label}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {expandedOrder === order.id && (
                  <View style={styles.itemsContainer}>
                    <View style={styles.itemsHeader}>
                      <Text style={styles.itemsHeading}>Order Items</Text>
                      <Text style={styles.itemsSubtitle}>{order.items.length} items</Text>
                    </View>

                    <View style={styles.itemsList}>
                      {order.items.slice(0, visibleCounts[order.id] || 5).map((it, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.itemCard}
                          activeOpacity={0.7}
                          onPress={() => handleClickProductDetail(it)}
                        >
                          <View style={styles.itemImageContainer}>
                            <Image source={{ uri: it.image }} style={styles.itemImage} />
                          </View>

                          <View style={styles.itemDetails}>
                            <Text style={styles.itemName} numberOfLines={2}>
                              {it.product_name}
                            </Text>

                            <View style={styles.itemMeta}>
                              <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Qty:</Text>
                                <Text style={styles.metaValue}>{it.quantity}</Text>
                              </View>
                              <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Price:</Text>
                                <Text style={styles.itemPrice}>₹{formatPrice(it.total)}</Text>
                              </View>
                            </View>

                            <View style={styles.stockRow}>
                              <View
                                style={[
                                  styles.stockIndicator,
                                  it.stock && it.stock > 0 ? styles.inStock : styles.outOfStock
                                ]}
                              />
                              <Text style={styles.stockText}>Stock: {it.stock}</Text>
                            </View>
                          </View>

                          <View style={styles.chevronContainer}>
                            <Text style={styles.chevron}>›</Text>
                          </View>
                        </TouchableOpacity>
                      ))}

                      {/* 👇 "See More" button for order items (only once) */}
                      {order.items.length > 5 && (visibleCounts[order.id] || 5) < order.items.length && (
                        <TouchableOpacity
                          onPress={() =>
                            setVisibleCounts(prev => ({
                              ...prev,
                              [order.id]: order.items.length, // show all
                            }))
                          }
                          style={styles.seeMoreButton}
                        >
                          <Text style={styles.seeMoreText}>
                            See More ({order.items.length - (visibleCounts[order.id] || 5)} more items)
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* 👇 "See Less" button for order items when all items are shown */}
                      {order.items.length > 5 && visibleCounts[order.id] === order.items.length && (
                        <TouchableOpacity
                          onPress={() =>
                            setVisibleCounts(prev => ({
                              ...prev,
                              [order.id]: 5, // show only 5
                            }))
                          }
                          style={styles.seeMoreButton}
                        >
                          <Text style={styles.seeMoreText}>
                            See Less
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* 👇 "See More Orders" button for orders list */}
            {orders.length > 5 && visibleOrdersCount < orders.length && (
              <TouchableOpacity
                onPress={() => setVisibleOrdersCount(orders.length)}
                style={styles.seeMoreOrdersButton}
              >
                <Text style={styles.seeMoreOrdersText}>
                  See More Orders ({orders.length - visibleOrdersCount} more orders)
                </Text>
              </TouchableOpacity>
            )}

            {/* 👇 "See Less Orders" button when all orders are shown */}
            {orders.length > 5 && visibleOrdersCount === orders.length && (
              <TouchableOpacity
                onPress={() => setVisibleOrdersCount(5)}
                style={styles.seeMoreOrdersButton}
              >
                <Text style={styles.seeMoreOrdersText}>
                  See Less Orders
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f2ecdd"
  },
  container: {
    flexGrow: 1,
    padding: 20
  },
  headerSection: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0D2A1F",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500"
  },
  ordersList: {
    gap: 16,
  },
  orderBlock: {
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: "#F8FAFC"
  },
  itemCountBadge: {
    backgroundColor: "#0D2A1F",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  itemCountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0D2A1F",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500"
  },
  expandIcon: {
    fontSize: 18,
    color: "#64748B",
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D2A1F"
  },
  statusSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: "white",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  delivered: {
    backgroundColor: "#059669"
  },
  pending: {
    backgroundColor: "#F59E0B"
  },
  itemsContainer: {
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 20,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  itemsHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D2A1F"
  },
  itemsSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  itemsList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F8FAFC"
  },
  itemDetails: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D2A1F",
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D2A1F",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669"
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inStock: {
    backgroundColor: "#10B981",
  },
  outOfStock: {
    backgroundColor: "#EF4444",
  },
  stockText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500"
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "bold",
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingContent: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500"
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D2A1F",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  seeMoreButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  seeMoreText: {
    color: "#0D2A1F",
    fontWeight: "600",
    fontSize: 14,
  },
  seeMoreOrdersButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  seeMoreOrdersText: {
    color: "#0D2A1F",
    fontWeight: "700",
    fontSize: 16,
  },
});