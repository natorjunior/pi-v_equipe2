import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../service/themeService";

const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, icon }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
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
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </View>
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
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
  },
  iconContainer: {
    position: "absolute",
    right: 20,
  },
});

export default InputField;

