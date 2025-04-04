import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { ThemeProvider, useTheme } from "./service/themeService";
import Menu from "./service/Menu";
import Config from "./screens/Config";
import Entrace from "./screens/Entrance";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Question1 from "./screens/Question1";
import Question2 from "./screens/Question2";
import Question3 from "./screens/Question3";
import Question4 from "./screens/Question4";
import Notifications from "./screens/Notifications";
import Groups from "./screens/Groups";
import AboutUs from "./screens/AboutUs";
import Feedback from "./screens/Feedback";
import CreateGroup from "./screens/CreateGroup";
import JoinGroup from "./screens/JoinGroup";
import Publish from "./screens/Publish";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import ForgotPassword from "./screens/ForgotPassword";

const Stack = createStackNavigator();

function ThemeWrapper() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Entrada"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" },
        }}
      >
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Entrada" component={Entrace} />
        <Stack.Screen name="Question1" component={Question1} />
        <Stack.Screen name="Question2" component={Question2} />
        <Stack.Screen name="Question3" component={Question3} />
        <Stack.Screen name="Question4" component={Question4} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Config" component={Config} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="JoinGroup" component={JoinGroup} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="Publish" component={Publish} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        
        <Stack.Screen 
          name="Profile" 
          component={Profile}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            cardStyle: { backgroundColor: theme.mode === "dark" ? "#0D0058" : "#f0f0f0" },
          }} 
        />

        <Stack.Screen name="EditProfile" component={EditProfile} />
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
