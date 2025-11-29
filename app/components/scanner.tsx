import { scanProduct } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraKey, setCameraKey] = useState(Date.now());

  useFocusEffect(
    useCallback(() => {
      setCameraKey(Date.now());
      setScanned(false);
      setTorchOn(false);
    }, [])
  );

  if (!permission) return <View />;

  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Camera access required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: "white" }}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );

  const handleScan = async (result: any) => {
    if (scanned) return;
    setScanned(true);
    try {
      const response = await scanProduct(result.data);
      if (response.data?.product) {
        router.push({
          pathname: "/components/productDetails",
          params: { data: JSON.stringify(response.data.product) },
        });
      } else {
        Alert.alert("Invalid QR", "No product found.");
        setScanned(false);
      }
    } catch {
      Alert.alert("Error", "Scan failed. Try again.");
      setScanned(false);
    }
  };



  return (
    <View style={{ flex: 1 }}>
      <CameraView
        key={cameraKey}
        style={{ flex: 1 }}
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {/* Close Button */}
      <TouchableOpacity
        style={[styles.controlBtn, { top: 50, left: 20 }]}
        onPress={() => router.push("/(tabs)")}
      >
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>

      {/* Flash Button */}
      <TouchableOpacity
        style={[styles.controlBtn, { top: 50, right: 20 }]}
        onPress={() => setTorchOn(!torchOn)}
      >
        <Ionicons
          name={torchOn ? "flash" : "flash-off"}
          size={30}
          color="yellow"
        />
      </TouchableOpacity>

      {/* Scanning Overlay */}
      {scanned && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", marginTop: 10 }}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  btn: { backgroundColor: "#0D2A1F", padding: 12, borderRadius: 10 },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 12,
    borderRadius: 50,
    zIndex: 999,
  },
});
