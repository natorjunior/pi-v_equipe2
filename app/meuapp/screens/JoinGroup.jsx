import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { joinGroup } from "../service/groupService";

export default function JoinGroup() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [alias, setAlias] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    setError(null);

    if (!alias.trim()) {
      setError("Por favor, informe o apelido do grupo.");
      return;
    }

    try {
      setLoading(true);

      const groupAlias = alias.trim().replace(/^@+/, "");
      const response = await joinGroup(groupAlias);

      if (response == null) {
        navigation.navigate("Tabs", { screen: "Groups" });
      }
    } catch (error) {
      console.log("Erro ao entrar no grupo:", error);

      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 401:
            setError("Você já está no grupo digitado.");
            break;
          case 404:
            setError("Grupo não encontrado. Verifique a tag e tente novamente.");
            break;
          case 422:
            setError("Dados inválidos. Verifique o apelido informado.");
            break;
          default:
            setError("Erro ao entrar no grupo. Tente novamente mais tarde.");
            break;
        }
      } else {
        setError("Erro ao entrar no grupo. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.mode === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Entrar em um grupo
          </Text>
        </View>

        <View style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inner}
          >
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Apelido do Grupo:</Text>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputPrefix, { 
                  color: theme.mode === "dark" ? "#000" : "#000",
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  }]}>@</Text>
                <TextInput
                  placeholder="Digite o apelido do grupo"
                  placeholderTextColor={theme.placeholder}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.inputText,
                      borderColor: theme.border,
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                    },
                  ]}
                  value={alias}
                  onChangeText={setAlias}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366",
                },
              ]}
              onPress={handleJoinGroup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.mode === "dark" ? "#000" : "#fff"} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { color: theme.mode === "dark" ? "#000" : "#fff" },
                  ]}
                >
                  Entrar no Grupo
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.miniButton}
              onPress={() => navigation.navigate("CreateGroup")}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.mode === "dark" ? "#fff" : "#000" },
                ]}
              >
                Criar um Grupo
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    right: 21,
  },
  content: {
    padding: 20,
  },
  inner: {
    width: "100%",
    top: 80,
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  miniButton: {
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 16,
    marginTop: 8,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
  },
  iconContainer: {
    position: "absolute",
    right: 20,
  },
  inputPrefix: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    marginRight: 10,
  },
});
