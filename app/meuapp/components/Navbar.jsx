import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useTheme } from "../service/themeService";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { getUser } from "../service/userService";
import * as SecureStore from "expo-secure-store";
import Group from "./GroupIcon";

const NavBar = ({ navigation, inGroup }) => {
    const image2 = require("../assets/add_circle.png");
    const { theme } = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarLoading, setAvatarLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const token = await SecureStore.getItemAsync("token");
                    if (token) {
                        const userData = await getUser(token);
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Erro na navbar ao buscar usuário:", error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }, [])
    );


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.navbar, { 
                backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
                borderColor: theme.mode === "dark" ? "#000" : "#ccc" }]}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Groups")}>
                    <Group />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.navButton, 
                    ]} 
                    onPress={() => navigation.navigate("Publish")}
                >
                    <Image source={image2} contentFit="contain" style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navButton ]} onPress={() => navigation.navigate("Profile")}>
                    {user?.avatar ? (
                        <View style={{position: 'relative'}}>
                            <ActivityIndicator
                                size="small"
                                color={theme.mode === "dark" ? "#fff" : "#000"}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                animating={avatarLoading}
                            />
                            <Image 
                                source={{ uri: user.avatar }}
                                style={[styles.avatar, {borderRadius: 60, borderWidth: 2, borderColor: '#ccc' }]}
                                onError={(e) => console.log("Erro ao carregar avatar:", e.nativeEvent.error)}
                                onLoad={() => setAvatarLoading(false)}
                            />
                        </View>
                    ) : (
                        <View style={[styles.defaultAvatar]}>
                            <ActivityIndicator
                                size="small"
                                color={theme.mode === "dark" ? "#fff" : "#000"}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 60,
                                    borderWidth: 2,
                                    borderColor: '#ccc',
                                }}
                                animating={avatarLoading}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    navbar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        height: 100,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: 0.5,
    },
    navButton: {
        padding: 20,
    },
    image: {
        width: 30,
        height: 35,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 3,
        top: 10,
    }
});

export default NavBar;

