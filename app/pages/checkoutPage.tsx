import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function Checkout() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");

  const [saved, setSaved] = useState(false);

  const orderItems = [
    { name: "Gold Ring", qty: 1, price: 1200 },
    { name: "Diamond Necklace", qty: 1, price: 4500 },
  ];

  const total = orderItems.reduce((sum, i) => sum + i.price, 0);

  const handleDobChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      cleaned =
        cleaned.slice(0, 2) +
        "/" +
        cleaned.slice(2, 4) +
        "/" +
        cleaned.slice(4, 8);
    }

    setDob(cleaned);
  };


  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingBottom: 60 }}>
      <AppHeaderTop title="Checkout" />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Go Back */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.goBack}>Go Back</Text>
        </TouchableOpacity>

        {/* Customer Info */}
        <Text style={styles.sectionTitle}>Customers Info</Text>

        <View style={styles.card}>

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            placeholder="Enter mobile number"
            style={styles.input}
            value={mobile}
            keyboardType="numeric"
            onChangeText={setMobile}
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            placeholder="DD/MM/YYYY"
            style={styles.input}
            value={dob}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={handleDobChange}
          />




          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => setSaved(true)}
          >
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.card}>
          {orderItems.map((item, index) => (
            <View key={index} style={styles.orderRow}>
              <Text style={styles.orderText}>
                {item.name} x{item.qty}
              </Text>
              <Text style={styles.orderPrice}>₹ {item.price.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹ {total.toLocaleString()}</Text>
        </View>

        {/* Show User Data After Save */}
        {saved && (
          <View style={styles.card}>
            <Text style={styles.savedTitle}>Saved Customer Details:</Text>
            <Text style={styles.savedText}>Name: {name}</Text>
            <Text style={styles.savedText}>DOB: {dob}</Text>
            <Text style={styles.savedText}>Mobile: {mobile}</Text>
          </View>
        )}

        {/* Proceed Button */}
        <TouchableOpacity style={styles.proceedBtn}>
          <Text style={styles.proceedText}>Proceed to Counter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  goBack: {
    color: "#0D2A1F",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#0D2A1F",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderText: {
    fontSize: 16,
    color: "#333",
  },
  orderPrice: {
    fontSize: 16,
    color: "#333",
  },
  totalSection: {
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D2A1F",
    marginTop: 5,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  savedText: {
    fontSize: 16,
    marginBottom: 5,
  },
  proceedBtn: {
    backgroundColor: "#0D2A1F",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  proceedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
