import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../../components/Themed";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../../constants/Colors";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";
import MQTTSender from "../../../services/MQTTSender";
import { RGBToRGB565 } from "../services/ImageUtils";

interface MatrixText {
    payload: string;
    color: number;
}

export default function SendText({client} :{client: MQTTSender | undefined}) {
    const colorScheme = useColorScheme();

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

    const [text, setText] = useState<MatrixText>({
        payload: 'Not set',
        color: 454545 
    } as MatrixText);

    function SetConfig<T extends keyof MatrixText>(key: T, value: string) {
        console.log(value);
        if (key === 'color') {
            const rgbValues = value.match(/\d+/g); 
            if (rgbValues == null) return;
            const r = parseInt(rgbValues[0]);
            const g = parseInt(rgbValues[1]);
            const b = parseInt(rgbValues[2]);
            const rgb565Color = RGBToRGB565(r, g, b);
            console.log(`COLOR: ${rgb565Color}`);
            setText(prev => ({...prev, [key]: rgb565Color}));
        } else {
            setText(prev => ({...prev, [key]: value}));
        }
    }

    return(
        <SafeAreaView style={{...styles.container }}>
            <View>
                <TextInput
                    placeholder="Text to send"
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
                    style={{
                    backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    }}
                    onPress={Send}
                    >
                  <Text
                    style={{fontSize: 16 }}
                    lightColor={Colors[colorScheme ?? 'light'].buttonText}
                    darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                    >Send</Text>
              </Pressable>
            </View>
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