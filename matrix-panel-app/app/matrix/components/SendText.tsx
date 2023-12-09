import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../components/Themed";
import { StyleSheet } from "react-native";

export default function SendText() {
    return(
        <SafeAreaView style={styles.container}>
            <Text>Send Text</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  }
});