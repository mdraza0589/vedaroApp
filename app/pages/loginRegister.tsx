import { loginStaff } from "@/server/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginRegister() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [inputFilled, setInputFilled] = useState(true);


  // 🔍 Auto Login Check
  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync("authToken");

      if (token) {
        global.authToken = token;
        router.replace("/(tabs)");
      } else {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, []);

  // 🔑 Login Handler
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setInputFilled(false);
      return;
    }

    try {
      setLoading(true);
      const response = await loginStaff({ email, password });

      if (response.data?.token) {
        await SecureStore.setItemAsync("authToken", response.data.token);
        global.authToken = response.data.token;
        router.replace("/(tabs)");
      } else {
        alert("Invalid login details");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      alert("check email and password");
    } finally {
      setLoading(false);
    }
  };


  // 🕒 Show Loader While Checking Login State
  if (checkingLogin) {
    setTimeout(() => {
      setCheckingLogin(false);
    }, 1000);
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size={40} />
        <Text style={{ marginTop: 10 }}>Checking login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.logoBox}>
        <Image
          source={require("../../assets/images/vedaro-logo.png")}
          resizeMode="contain"
          style={{ width: 140, height: 140, borderRadius: 30 }}
        />
      </View>

      <Text style={styles.title}>Vedaro</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {/* Email Input */}
      {!inputFilled && <Text style={{ color: "red", marginBottom: 10 }}>Please enter email and password</Text>}
      <View style={styles.inputBox}>
        <MaterialIcons name="email" size={22} color="#0f2a1d" />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputBox}>
        <MaterialIcons name="lock-outline" size={22} color="#0f2a1d" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#0f2a1d"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    backgroundColor: "#f2ecdd",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: "#0f2a1d",
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#0f2a1d",
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16 },
  loginBtn: {
    width: "85%",
    backgroundColor: "#0f2a1d",
    padding: 18,
    borderRadius: 40,
    alignItems: "center",
  },
  loginText: { fontSize: 18, color: "white" },
});
