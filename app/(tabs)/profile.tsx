import { getProfile, logoutStaff } from "@/server/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data?.user);
        } catch (err) {
            console.log("PROFILE ERROR:", err);
            alert("Failed to load profile");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfile();
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logoutStaff();
                        } catch (err) {
                            console.log("LOGOUT ERROR:", err);
                        }

                        await SecureStore.deleteItemAsync("authToken");
                        global.authToken = null;

                        router.replace("/pages/loginRegister");
                    }
                }
            ]
        );
    };

    const getInitials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0D2A1F" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <AppHeaderTop title="Profile" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D2A1F" />
                }
            >
                {/* Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials(profile?.name)}</Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                    </View>

                    <Text style={styles.userName}>{profile?.name}</Text>
                    <Text style={styles.userEmail}>{profile?.email}</Text>
                </View>

                {/* Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Ionicons name="person-outline" size={20} color="#0D2A1F" style={styles.infoIcon} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                <Text style={styles.infoValue}>{profile?.name}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoItem}>
                            <Ionicons name="mail-outline" size={20} color="#0D2A1F" style={styles.infoIcon} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{profile?.email}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f2ecdd" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, fontSize: 16, color: "#64748B" },
    scrollContent: { paddingBottom: 30 },
    profileHeader: {
        backgroundColor: "#f0ede5ff",
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 30,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    avatarContainer: { position: "relative", marginBottom: 16 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#0D2A1F",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { color: "white", fontSize: 32, fontWeight: "bold" },
    verifiedBadge: { position: "absolute", bottom: -2, right: -2 },
    userName: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: "#0D2A1F" },
    userEmail: { fontSize: 15, color: "#64748B" },
    section: { paddingHorizontal: 20, marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    infoCard: { backgroundColor: "white", padding: 20, borderRadius: 15, elevation: 2 },
    infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    infoIcon: { marginRight: 15 },
    infoContent: { flex: 1 },
    infoLabel: { fontSize: 13, color: "#64748B" },
    infoValue: { fontSize: 16, fontWeight: "600" },
    divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },
    logoutBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        margin: 20,
        padding: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#FECACA",
    },
    logoutText: { marginLeft: 8, fontSize: 16, fontWeight: "bold", color: "#D32F2F" },
});

