import React, { useState, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../service/themeService";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../service/userService";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const translateY = useRef(new Animated.Value(1000)).current;

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("authToken");
          if (token) {
            const userData = await getUser(token);
            setUser(userData);
          } else {
            console.warn("Token de autenticação não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={[
          theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
          theme.mode === "dark" ? "#000000" : "#d0d0d0",
        ]}
        style={styles.gradient}
      >
        <View style={[styles.header, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Perfil</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={styles.editButton}>
            <Ionicons name="pencil" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          <View style={styles.content}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Ionicons name="person" size={60} color="#fff" />
              </View>
            )}
            <Text style={[styles.name, { color: theme.text }]}>
              {user?.name || "Usuário"}
            </Text>
            <Text style={[styles.email, { color: theme.text }]}>
              {user?.email || "Email"}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
});
