import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../../components/Themed";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../../constants/Colors";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";
import { SignboardConfig } from "../../../types/MatrixConfig";
import MQTTSender from "../../../services/MQTTSender";

interface MatrixText {
    text: string;
    color: number;
}

export default function SendText({client} :{client: MQTTSender | undefined}) {
    function Send() {
        console.log("SENDING TEXT");
        console.log(text);
        if (client != undefined)
        {
            console.log("Clinet ok");
            client.SendText(JSON.stringify(text), 'text');
        } else {
            console.log("Client not ok");
        }
    }

    const colorScheme = useColorScheme();
    const [toggle, setToggle] = useState(false);
    const height = toggle ? '40%' : '15%';
    const [text, setText] = useState<MatrixText>({
        text: 'Not set',
        color: 454545 
    } as MatrixText);

    function SetConfig<T extends keyof MatrixText>(key: T, value: string) {
        console.log(value);
        if (key === 'color') {
            const integerColor = parseInt(value.slice(1), 16);
            console.log(`COLOR: ${integerColor}`);
            setText(prev => ({...prev, [key]: integerColor}));
        } else {
            setText(prev => ({...prev, [key]: value}));
        }
    }

    return(
        <SafeAreaView style={{...styles.container, height: height}}>
            <Pressable
                style={{ width: '80%', borderWidth: 1, borderColor: '#fff'}}
                onPress={() => setToggle(!toggle)}
                >
                <Text>Set Text</Text>
            </Pressable>
            {toggle &&
                <View>
                    <TextInput
                        value={text.text}
                        inputMode='text'
                        keyboardAppearance={colorScheme ?? 'light'}
                        onChangeText={value => SetConfig('text', value)}
                        style={{
                            ...styles.textInput,
                            color: Colors[colorScheme ?? 'light'].text,
                            borderColor: Colors[colorScheme ?? 'light'].tint,
                        }} />

                        <ColorPicker
                            onChange={value => SetConfig('color', value.hex)}>
                            <Preview />

                            <View>
                                <Panel1 />
                                <HueSlider />
                            </View>

                        </ColorPicker>
                    <Pressable
                        onPress={Send}
                    >
                        <Text>SEND</Text>
                    </Pressable>
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%'
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