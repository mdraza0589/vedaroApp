import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function HistoryPage() {
  // Sample order data (replace later with API)
  type OrderStatus = "Delivered" | "Cancelled" | "Shipped";
  const statusStyle: Record<OrderStatus, any> = {
    Delivered: styles.delivered,
    Cancelled: styles.cancelled,
    Shipped: styles.shipped,
  };


  const orders = [
    {
      id: 1,
      title: "Organic Green Tea",
      price: 249,
      date: "12 Nov 2025 · 04:30 PM",
      status: "Delivered",
      img: "https://cdn.pixabay.com/photo/2017/01/31/21/22/tea-2020641_960_720.jpg"
    },
    {
      id: 2,
      title: "Natural Honey Bottle",
      price: 199,
      date: "08 Nov 2025 · 11:20 AM",
      status: "Cancelled",
      img: "https://cdn.pixabay.com/photo/2017/08/07/00/59/honey-2602315_960_720.jpg"
    },
    {
      id: 3,
      title: "Premium Almond Pack",
      price: 499,
      date: "05 Nov 2025 · 02:15 PM",
      status: "Shipped",
      img: "https://cdn.pixabay.com/photo/2016/11/18/16/51/almonds-1834984_960_720.jpg"
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <AppHeaderTop title="History" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Your Orders</Text>

        {orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <Image source={{ uri: order.img }} style={styles.img} />

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{order.title}</Text>
              <Text style={styles.price}>₹{order.price}</Text>
              <Text style={styles.date}>{order.date}</Text>

              <Text style={[styles.status, statusStyle[order.status as OrderStatus]]}>
                {order.status}
              </Text>

            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0D2A1F"
  },
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12
  },
  infoContainer: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000"
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "green",
    marginTop: 2
  },
  date: {
    fontSize: 13,
    color: "#555",
    marginVertical: 4
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: "white",
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4
  },

  // Status Colors
  delivered: {
    backgroundColor: "green"
  },
  cancelled: {
    backgroundColor: "red"
  },
  shipped: {
    backgroundColor: "#1E56FF"
  }
});
