import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./service/ThemeContext";
import Menu from "./service/Menu";
import Config from "./screens/Config";
import Entrace from "./screens/Entrance";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Question1 from "./screens/Question1";
import Question2 from "./screens/Question2";
import Question3 from "./screens/Question3";
import Question4 from "./screens/Question4";


const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Entrada" component={Entrace} />
          <Stack.Screen name="Question1" component={Question1} />
          <Stack.Screen name="Question2" component={Question2} />
          <Stack.Screen name="Question3" component={Question3} />
          <Stack.Screen name="Question4" component={Question4} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Config" component={Config} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
