import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./service/themeService";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import Config from "./screens/Config";
import Entrace from "./screens/Entrance";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Question1 from "./screens/Question1";
import Question2 from "./screens/Question2";
import Question3 from "./screens/Question3";
import Question4 from "./screens/Question4";
import GroupConfig from "./screens/GroupConfig";
import Groups from "./screens/Groups";
import AboutUs from "./screens/AboutUs";
import Feedback from "./screens/Feedback";
import CreateGroup from "./screens/CreateGroup";
import JoinGroup from "./screens/JoinGroup";
import Publish from "./screens/Publish";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import ChangeMotivation from "./screens/ChangeMotivation";
import ChangeGenres from "./screens/ChangeGenres";
import ForgotPassword from "./screens/ForgotPassword";

const Stack = createStackNavigator();

function AuthLoadingScreen({ navigation }) {
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        navigation.replace(token ? "Home" : "Entrada");
      } catch (error) {
        navigation.replace("Entrada");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0"
    }}>
      <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} />
    </View>
  );
}

function ThemeWrapper() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" },
        }}
      >
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Entrada" component={Entrace} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Question1" component={Question1} />
        <Stack.Screen name="Question2" component={Question2} />
        <Stack.Screen name="Question3" component={Question3} />
        <Stack.Screen name="Question4" component={Question4} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Config" component={Config} />
        <Stack.Screen name="GroupConfig" component={GroupConfig} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="JoinGroup" component={JoinGroup} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="Publish" component={Publish} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            cardStyle: { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" },
          }}
        />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ChangeMotivation" component={ChangeMotivation} />
        <Stack.Screen name="ChangeGenres" component={ChangeGenres} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper />
    </ThemeProvider>
  );
}
