import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../../components/Themed";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../../constants/Colors";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";
import MQTTSender from "../../../services/MQTTSender";

interface MatrixText {
    payload: string;
    color: number;
}

export default function SendText({client} :{client: MQTTSender | undefined}) {
    function Send() {
        console.log("SENDING TEXT");
        console.log(text);
        if (client != undefined)
        {
            console.log("Clinet ok");
            client.SendText(text, 'text');
        } else {
            console.log("Client not ok");
        }
    }

    const colorScheme = useColorScheme();
    const [toggle, setToggle] = useState(false);
    const height = toggle ? '40%' : '15%';
    const [text, setText] = useState<MatrixText>({
        payload: 'Not set',
        color: 454545 
    } as MatrixText);

    function rgbToRgb565(red: number, green: number, blue: number): number {
        let r = red >> 3;
        let g = green >> 2;
        let b = blue >> 3;
        return (r << 11) | (g << 5) | b;
    }

    function SetConfig<T extends keyof MatrixText>(key: T, value: string) {
        console.log(value);
        if (key === 'color') {
            const rgbValues = value.match(/\d+/g); 
            if (rgbValues == null) return;
            const r = parseInt(rgbValues[0]);
            const g = parseInt(rgbValues[1]);
            const b = parseInt(rgbValues[2]);
            const rgb565Color = rgbToRgb565(r, g, b);
            console.log(`COLOR: ${rgb565Color}`);
            setText(prev => ({...prev, [key]: rgb565Color}));
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
                        value={text.payload}
                        inputMode='text'
                        keyboardAppearance={colorScheme ?? 'light'}
                        onChangeText={value => SetConfig('payload', value)}
                        style={{
                            ...styles.textInput,
                            color: Colors[colorScheme ?? 'light'].text,
                            borderColor: Colors[colorScheme ?? 'light'].tint,
                        }} />

                        <ColorPicker
                            onChange={value => SetConfig('color', value.rgb)}>
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