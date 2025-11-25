import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginRegister() {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => router.push('/(tabs)')}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoBox}>
                {/* <Image
          source={require("../assets/diamond.png")}
          style={{ width: 60, height: 60, tintColor: "white" }}
        /> */}
            </View>

            <Text style={styles.title}>Vedaro</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {/* Mobile Number Field */}
            <View style={styles.inputBox}>
                <Ionicons name="call-outline" size={22} color="#B38A00" />
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#888"
                    keyboardType="number-pad"
                />
            </View>

            {/* Password Field */}
            <View style={styles.inputBox}>
                <MaterialIcons name="lock-outline" size={22} color="#B38A00" />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPass}
                />

                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Ionicons
                        name={showPass ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#B38A00"
                    />
                </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
                onPress={() => alert("Forgot Password clicked")}
                style={{ alignSelf: "flex-end", marginRight: 40 }}
            >
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => alert("Login clicked")}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            {/* Sign Up Text */}
            <Text style={styles.bottomText}>
                Don't have an account?{" "}
                <Text
                    style={styles.signupText}
                    onPress={() => alert("Sign Up clicked")}
                >
                    Sign Up
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E9DFC5",
        alignItems: "center",
        paddingTop: 80,
    },

    skipBtn: {
        position: "absolute",
        top: 40,
        right: 25,
    },
    skipText: {
        fontSize: 16,
        fontWeight: "500",
        color: "black",
    },

    logoBox: {
        width: 120,
        height: 120,
        backgroundColor: "#0D2A1F",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 30,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "black",
    },
    subtitle: {
        fontSize: 15,
        color: "#505050",
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

    input: {
        flex: 1,
        fontSize: 16,
        color: "black",
    },

    forgotText: {
        color: "#0D2A1F",
        fontWeight: "600",
        fontSize: 14,
        marginBottom: 30,
    },

    loginBtn: {
        width: "85%",
        backgroundColor: "#0D2A1F",
        padding: 18,
        borderRadius: 40,
        alignItems: "center",
        marginBottom: 25,
    },
    loginText: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
    },

    bottomText: {
        fontSize: 15,
        color: "#555",
    },
    signupText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0D2A1F",
    },
});
