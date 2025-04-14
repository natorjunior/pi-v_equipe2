import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, updateUser } from "../service/userService";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.warn("Token de autenticação não encontrado.");
          return;
        }
  
        const userData = await getUser(token);
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
        setAvatarUrl(userData.avatar || "");
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      }
  
      const updatedData = {
        name,
        email,
        password: password || undefined,
        avatarUrl,
      };
  
      await updateUser(updatedData, token);
  
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  };
  

  return (
    <LinearGradient
      colors={[
        theme.mode === "dark" ? "#0D0058" : "#f0f0f0",
        theme.mode === "dark" ? "#000000" : "#d0d0d0",
      ]}
      style={styles.container}
    >
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.text }]}>Editar Perfil</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.form}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}
          <TextInput
            style={[styles.input, { 
              color: theme.text,
              backgroundColor: theme.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              padding: 15,
              borderBottomWidth: 0
            }]}
            placeholder="Nome"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { 
              color: theme.text,
              backgroundColor: theme.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              padding: 15,
              borderBottomWidth: 0
            }]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { 
              color: theme.text,
              backgroundColor: theme.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              padding: 15,
              borderBottomWidth: 0
            }]}
            placeholder="Nova Senha (opcional)"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { 
              color: theme.text,
              backgroundColor: theme.mode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderRadius: 8,
              padding: 15,
              borderBottomWidth: 0
            }]}
            placeholder="URL do Avatar"
            placeholderTextColor="#aaa"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#4A00E0" : "#007bff" }]} 
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#999",
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});