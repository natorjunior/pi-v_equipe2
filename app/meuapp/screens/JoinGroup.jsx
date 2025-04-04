import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../service/themeService";
import { useNavigation } from "@react-navigation/native";
import Top from "../components/Top";

export default function JoinGroup() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [alias, setAlias] = useState("");


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Top navigation={navigation} />
      <View style={styles.content}>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Entre em um grupo
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border },
          ]}
          placeholder="@apelido do grupo"
          placeholderTextColor={theme.placeholder}
          value={alias}
          onChangeText={setAlias}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.mode === "dark" ? "#DFBA69" : "#003366" }]}
        >
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#000" : "#fff" }]}>
            Entrar no Grupo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.miniButton}
          onPress={() => navigation.navigate("CreateGroup")}>
          <Text style={[styles.buttonText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
            Criar um Grupo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    marginTop: 60,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  miniButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});
