import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useTheme } from "../service/themeService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { deleteUser, getUser } from "../service/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Config = () => {
  const { theme, setThemeMode, themeMode } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          const userData = await getUser(storedToken);
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
  }, []);

  const handleDeleteUser = async () => {
    try {
      if (!token) throw new Error("Token de autenticação não disponível.");
      await deleteUser(token);
      await AsyncStorage.removeItem("authToken");
      navigation.navigate("Entrada");
      console.log("Conta apagada com sucesso.");
      alert("Conta apagada com sucesso.");
    } catch (error) {
      console.error("Erro ao apagar conta:", error);
    }
  };

  const themeOptions = [
    { id: "light", title: "Tema Claro", description: "Usar cores claras" },
    { id: "dark", title: "Tema Escuro", description: "Usar cores escuras" },
    { id: "system", title: "Seguir sistema", description: "Usar as configurações do dispositivo" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              {
                backgroundColor: theme.inputBackground,
                borderColor: themeMode === option.id ? theme.text : theme.border,
              },
            ]}
            onPress={() => setThemeMode(option.id)}
          >
            <Text style={[styles.optionText, { color: theme.mode }]}>{option.title}</Text>
            <Text style={[styles.optionDescription, { color: theme.placeholder }]}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={handleDeleteUser} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Apagar Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  optionButton: {
    padding: 15,
    width: "90%",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  deleteButton: {
    marginTop: "90%",
    padding: 15,
    width: "90%",
    borderRadius: 8,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Config;
