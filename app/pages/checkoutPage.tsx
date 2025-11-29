import { checkout, createPendingInvoice, getCartData, getCustomerByPhone } from "@/server/api";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingCustomer, setCheckingCustomer] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 🚨 New State to detect repeated customer
  const [existingCustomer, setExistingCustomer] = useState(false);

  const convertToMySQLDate = (date: string) => {
    if (!date || date.length !== 10) return null;
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log("summary - ", summary);
  }, [summary]);

  const fetchCheckoutSummary = async () => {
    try {
      const res = await checkout();
      if (res.data.success) {
        setSummary(res.data.summary);
      } else {
        setSummary({ items: [], subtotal: 0, total_tax: 0, grand_total: 0 });
      }
    } catch (err) {
      console.log("CHECKOUT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchCheckoutSummary();
    }, [])
  );

  const handlePhoneInput = async (value: string) => {
    setMobile(value);
    if (value.length !== 10) return;

    setCheckingCustomer(true);
    try {
      const res = await getCustomerByPhone(value);
      if (res?.data?.success && res.data.data) {
        const customer = res.data.data;
        setName(customer.name || "");
        setDob(customer.date_of_birth?.replace(/-/g, "/") || "");
        setExistingCustomer(true)
        Alert.alert("Customer Found", "Details auto-filled ✔");
      } else {
        setExistingCustomer(false);
      }
    } catch { }
    setCheckingCustomer(false);
  };

  const formatDOB = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2 && cleaned.length <= 4)
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    else if (cleaned.length > 4)
      cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDob(cleaned);
  };

  const submitInvoice = async () => {
    try {
      setProcessing(true);
      const formattedDOB = convertToMySQLDate(dob);

      const res = await createPendingInvoice({
        customer_name: name,
        customer_phone: mobile,
        customer_dob: formattedDOB,
      });

      if (res.data.success) {
        await getCartData();
        router.push("/pages/orderSuccess");
      } else {
        Alert.alert("Failed", res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const handleProceed = () => {
    if (!mobile || mobile.length !== 10)
      return Alert.alert("Error", "Enter valid mobile number");

    if (dob && dob.length !== 10)
      return Alert.alert("Error", "Enter valid DOB");

    // Simple confirm if already exists
    if (existingCustomer) {
      return Alert.alert(
        "Existing Customer",
        "Customer already found. Continue?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: submitInvoice }
        ]
      );
    }

    submitInvoice();
  };


  if (loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  if (!summary || summary.items.length === 0)
    return (
      <View style={[styles.center, { backgroundColor: "#f2ecdd" }]}>
        <Text style={{ fontSize: 50 }}>🛒</Text>
        <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "600" }}>
          Empty Cart
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
            Browse Products
          </Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#f2ecdd", position: "relative" }}>
      <AppHeaderTop title="Checkout" />
      <TouchableOpacity style={styles.backContainer} onPress={() => router.push("/(tabs)/cart")}>
        <Ionicons name="arrow-back-sharp" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>

        {/* CUSTOMER FORM */}
        <Text style={styles.sectionTitle}>Customer Info</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            placeholder="Enter mobile number"
            style={styles.input}
            keyboardType="numeric"
            value={mobile}
            maxLength={10}
            onChangeText={handlePhoneInput}
          />
          {checkingCustomer && <Text style={styles.loadingTxt}>Checking...</Text>}

          <Text style={styles.label}>Full Name</Text>
          <TextInput placeholder="Enter Name" style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>DOB</Text>
          <TextInput
            placeholder="DD/MM/YYYY"
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            value={dob}
            onChangeText={formatDOB}
          />
        </View>

        {/* ORDER SUMMARY */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          {summary.items.map((item: any, index: number) => {
            const basePrice = Number(item.price || 0);
            const totalWithTax = Number(item.total_with_tax || 0);
            const qty = Number(item.qty || 0);

            const taxAmount = totalWithTax - (basePrice * qty);

            return (
              <View key={index} style={styles.orderRow}>
                <Text style={styles.orderText}>{item.product_name} x{qty}</Text>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.smallText}>Base: ₹ {basePrice.toFixed(2)}</Text>
                  <Text style={styles.smallText}>Tax: ₹ {taxAmount.toFixed(2)}</Text>
                  <Text style={styles.orderPrice}>₹ {totalWithTax.toFixed(2)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* TOTALS */}
        <View style={styles.totalSection}>
          <View style={styles.orderRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.amount}>₹ {Number(summary.subtotal).toFixed(2)}</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.totalLabel}>Total Tax</Text>
            <Text style={styles.amount}>₹ {Number(summary.total_tax).toFixed(2)}</Text>
          </View>

          <View style={styles.grandTotal}>
            <Text style={styles.totalLabelAmount}>Grand Total: ₹ </Text>
            <Text style={styles.amountTotal}>{Number(summary.grand_total).toFixed(2)}</Text>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.proceedBtn, processing && { opacity: 0.6 }]}
          onPress={handleProceed}
          disabled={processing}
        >
          <Text style={styles.proceedText}>
            {processing ? "Processing..." : "Proceed to Counter"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

/* --- STYLES STAY EXACTLY SAME --- */

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  card: { backgroundColor: "#ffeee9", padding: 20, borderRadius: 15, marginBottom: 20 },
  backContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    zIndex: 999,
    backgroundColor: "#0D2A1F",
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loadingTxt: { color: "green", marginBottom: 10 },
  orderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  totalLabelAmount: { fontSize: 26, fontWeight: "700" },
  amountTotal: { fontSize: 26, fontWeight: "800", color: "#0D2A1F" },
  orderText: { fontSize: 16 },
  smallText: { fontSize: 14, color: "#666" },
  orderPrice: { fontSize: 16, fontWeight: "600", color: "green" },
  totalSection: { marginBottom: 20, textAlign: 'right' },
  totalLabel: { fontSize: 17, fontWeight: "600" },
  amount: { fontSize: 17, fontWeight: "700" },
  grandTotal: {
    fontSize: 26, fontWeight: "800", color: "#0D2A1F", marginTop: 10,
    flexDirection: 'row', justifyContent: 'space-between'
  },
  proceedBtn: {
    backgroundColor: "#0D2A1F",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  proceedText: { color: "white", fontSize: 18, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  shopBtn: {
    marginTop: 20, backgroundColor: "#0D2A1F", padding: 12, borderRadius: 10,
  },
});
