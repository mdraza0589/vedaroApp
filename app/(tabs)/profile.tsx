import React from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppHeaderTop from "../components/appHeader";

export default function ProfilePage() {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={'light-content'}
            />
            <AppHeaderTop title="Profile" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Top Profile Header */}
                <View style={styles.topSection}>
                    <View style={styles.avatar}>
                        <Image style={styles.profileImage} source={{ uri: 'https://cdn.pixabay.com/photo/2024/02/19/11/27/cross-8583223_1280.jpg' }} />
                    </View>

                    <Text style={styles.name}>Bhupendra Dhohte</Text>
                    <Text style={styles.email}>bhupi@sahu.com</Text>

                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Information Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Account Information</Text>

                    <Text style={styles.label}>Phone Number</Text>
                    <Text style={styles.value}>+91 99999 88888</Text>

                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.value}>Bhopal, Madhya Pradesh</Text>

                    <Text style={styles.label}>Member Since</Text>
                    <Text style={styles.value}>Jan 2024</Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    topSection: {
        backgroundColor: "#0D2A1F",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: "center",
        paddingBottom: 10
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: "white",
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
    },
    email: {
        fontSize: 15,
        color: "#E1E1E1",
        marginBottom: 15,
    },
    editBtn: {
        backgroundColor: "#2A423A",
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    editText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    infoCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        shadowColor: 'black'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 3,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },
    logoutBtn: {
        backgroundColor: "#0D2A1F",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        margin: 20,
    },
    logoutText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
});
