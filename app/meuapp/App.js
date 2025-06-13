import { useEffect, useState } from "react";
import { BackHandler, ToastAndroid, Platform, Alert } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ThemeProvider, useTheme } from "./service/themeService";
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getUser } from "./service/userService";

import Config from "./screens/Config";
import Entrace from "./screens/Entrance";
import Login from "./screens/Login";
import Question1 from "./screens/Question1";
import Question2 from "./screens/Question2";
import Question3 from "./screens/Question3";
import Question4 from "./screens/Question4";
import GroupDetails from "./screens/GroupDetails";
import Home from "./screens/Home";
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
import PostDetails from "./screens/PostDetails";
import EditPost from "./screens/EditPost";
import OtherProfile from "./screens/OtherProfile";
import InfoPage from "./screens/InfoPage";
import SelectGroup from "./screens/SelectGroup";
import SuggestedGroups from "./screens/SuggestedGroups";

import Top from "./components/Top";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

function Tabs() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const userData = await getUser(token);
          setUser(userData);
        } else {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        // Check if the error indicates an authentication issue
        if (error.response && error.response.data && error.response.data.detail === "Not authenticated") {
          // Clear the token and navigate to the login screen
          await SecureStore.deleteItemAsync("token");
          navigation.navigate("Login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        } else {
          setBackPressedOnce(true);
          if (Platform.OS === "android") {
            ToastAndroid.show("Pressione voltar novamente para sair", ToastAndroid.SHORT);
          } else {
            Alert.alert("Sair", "Pressione voltar novamente para sair.");
          }
          setTimeout(() => setBackPressedOnce(false), 2000);
          return true;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [backPressedOnce, navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarPosition="bottom"
      swipeEnabled={true}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.mode === "dark" ? "#fff" : "#000",
        tabBarInactiveTintColor: theme.mode === "dark" ? "#fff" : "#000",
        tabBarStyle: {
          backgroundColor: theme.mode === "dark" ? "#0D0058" : "#fff",
          height: 65,
        },
        tabBarIndicatorStyle: { height: 0 },
      }}
    >
      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="people"
              size={24}
              color={theme.mode === "dark" ? "#fff" : "#000"}
              style={{ marginTop: 10 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="home"
              size={24}
              color={theme.mode === "dark" ? "#fff" : "#000"}
              style={{ marginTop: 10 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => (
            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 7 }}>
              {avatarLoading && (
                <ActivityIndicator
                  size="large"
                  color={theme.mode === "dark" ? "#fff" : "#000"}
                  style={styles.avatarLoader}
                />
              )}
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={[
                    styles.avatar,
                    { borderColor: theme.mode === "dark" ? "#fff" : "#000" },
                  ]}
                  onLoadStart={() => setAvatarLoading(true)}
                  onLoadEnd={() => setAvatarLoading(false)}
                />
              ) : (
                <View
                  style={[
                    styles.defaultAvatar,
                    { borderColor: theme.mode === "dark" ? "#fff" : "#000" },
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Top {...props} />}
      screenOptions={{ headerShown: false, drawerType: "front" }}
    >
      <Drawer.Screen name="Tabs" component={Tabs} />
      <Drawer.Screen name="CreateGroup" component={CreateGroup} />
      <Drawer.Screen name="JoinGroup" component={JoinGroup} />
      <Drawer.Screen name="Config" component={Config} />
      <Drawer.Screen name="Feedback" component={Feedback} />
      <Drawer.Screen name="AboutUs" component={AboutUs} />
    </Drawer.Navigator>
  );
}

function AppLoadingScreen({ navigation }) {
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          navigation.replace("AppDrawer");
          await SecureStore.deleteItemAsync("selectedGroupId");
        } else {
          navigation.replace("Entrada");
        }
      } catch (error) {
        navigation.replace("Entrada");
      }
    };
    checkAuth();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" }]}>
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.mode === "dark" ? "#fff" : "#000"} />
      </View>
    </SafeAreaView>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" }]}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AppLoading"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" },
          }}
        >
          <Stack.Screen name="AppLoading" component={AppLoadingScreen} />
          <Stack.Screen name="Entrada" component={Entrace} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Question1" component={Question1} />
          <Stack.Screen name="Question2" component={Question2} />
          <Stack.Screen name="Question3" component={Question3} />
          <Stack.Screen name="Question4" component={Question4} />
          <Stack.Screen name="GroupDetails" component={GroupDetails} />
          <Stack.Screen name="PostDetails" component={PostDetails} />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ChangeMotivation" component={ChangeMotivation} />
          <Stack.Screen name="ChangeGenres" component={ChangeGenres} />
          <Stack.Screen name="AppDrawer" component={AppDrawer} />
          <Stack.Screen name="Publish" component={Publish} />
          <Stack.Screen name="OtherProfile" component={OtherProfile} />
          <Stack.Screen name="InfoPage" component={InfoPage} />
          <Stack.Screen name="SelectGroup" component={SelectGroup} />
          <Stack.Screen name="SuggestedGroups" component={SuggestedGroups} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function Wrapper() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
