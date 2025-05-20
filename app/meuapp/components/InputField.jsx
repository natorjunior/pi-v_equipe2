import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../service/themeService";

const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, icon }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>{label}:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            style={[
              styles.input,
              { backgroundColor: theme.inputBackground, color: theme.inputText, borderColor: theme.border },
            ]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize="none"
          />
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
});

export default InputField;

