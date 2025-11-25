import { Ionicons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false); // 🔥 TORCH STATE

  if (!permission) return <View />;
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Camera permission needed!
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={{ color: "white" }}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        enableTorch={torchOn}    // 🔥 TORCH ON/OFF
        onBarcodeScanned={(result: BarcodeScanningResult) => {
          if (!scanned) {
            setScanned(true);
            console.log("Scanned Data:", result.data);

            router.push({
              pathname: "/components/productDetails",
              params: { data: result.data }
            });
          }
        }}

        style={{ flex: 1 }}
      />

      {/* Close Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Scanner Frame */}
      <View style={styles.scannerFrame} />

      {/* Torch Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setTorchOn(!torchOn)}>
          <Ionicons
            name={torchOn ? "flashlight" : "flashlight-outline"} // 🔥 icon changes
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#0D2A1F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  scannerFrame: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20,
    position: "absolute",
    alignSelf: "center",
    top: "30%",
  },
  bottomBar: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
  },
});
