import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import Logo from "../components/Logo";
import { Video } from "expo-av";
import { useTheme } from "../service/themeService";

const vid = require("../assets/group.mp4");

export default function Entrece({ navigation }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container,( { backgroundColor: theme.background } )]}>
                <Logo/>
                
                <Video
                    source={vid}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.video}
                />

                <Text style={[styles.title, { color: theme.text }]}>
                    Aprenda junto
                </Text>

                <Text style={[styles.description, { color: theme.text }]}>
                    Compartilhe suas experiências{"\n"}em grupos de crescimento,{"\n"}
                    mostre seu ponto de vista e{"\n"}construa amizades
                </Text>
                
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.mode === "dark" ? "#fff" : "#003366" }
                    ]}
                    onPress={() => navigation.navigate("Question1")}
                >
                    <Text style={[
                        styles.buttonText,
                        { color: theme.mode === "dark" ? "#000" : "#fff" }
                    ]}>
                        Primeiro acesso
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[
                        styles.button,
                        { padding: 10 }
                    ]}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={[
                        styles.buttonText,
                        { color: theme.mode === "dark" ? "#fff" : "#003366" }
                    ]}>
                        Eu já tenho uma conta
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        width: 356,
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
        marginTop: 60,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 50,
        paddingHorizontal: 20,
    },
    button: {
        width: "60%",
        height: 45,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    }
});
