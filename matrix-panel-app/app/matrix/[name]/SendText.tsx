import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../../components/Themed";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../../constants/Colors";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";
import MQTTSender from "../../../services/MQTTSender";
import { RGBToRGB565 } from "../../../services/ImageUtils";
import { Picker } from '@react-native-picker/picker';
import { ScrollDirection } from "../../../components/ScrollDirection";
import React from "react";
import { MatrixContext } from "../../../providers/MatrixProvider";

interface MatrixText {
    payload: string;
    color: number;
    scrollDirection: number;
    scrollSpeed: number;
}

export default function SendText() {
    const colorScheme = useColorScheme();

    const context = React.useContext(MatrixContext);
    if (context == undefined) throw new Error("Context is undefined");

    const { matrix, client } = context;

    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(ScrollDirection.None);
    const [text, setText] = useState<MatrixText>({
        payload: 'Not set',
        color: 454545,
        scrollDirection: 0,
        scrollSpeed: 1,
    } as MatrixText);

    function Send() {
        console.log("SENDING TEXT");
        console.log(text);
        if (client != undefined) {
            const textToSend: MatrixText = {...text, ['scrollDirection']: scrollDirection};
            console.log("Clinet ok");
            client.SendAsJson(textToSend, 'text');
        } else {
            console.log("Client not ok");
        }
    }

    function SetColor(value: string)
    {
        const rgbValues = value.match(/\d+/g); 
        if (rgbValues == null) return;
        const r = parseInt(rgbValues[0]);
        const g = parseInt(rgbValues[1]);
        const b = parseInt(rgbValues[2]);
        const rgb565Color = RGBToRGB565(r, g, b);
        console.log(`COLOR: ${rgb565Color}`);
        setText(prev => ({...prev, ['color']: rgb565Color}));
    }

    function SetConfig<T extends keyof MatrixText>(key: T, value: MatrixText[T]) {
        console.log(value);
        setText(prev => ({...prev, [key]: value}));
    }

    return(
        <SafeAreaView style={{...styles.container }}>
            <View style={{width: '100%'}}>
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

                <TextInput
                    placeholder="Scroll Speed"
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    onChangeText={value => SetConfig('scrollSpeed', Number(value))}
                    style={{
                        ...styles.textInput,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                    }} />

                <Picker
                    selectedValue={scrollDirection}
                    onValueChange={(itemValue, itemIndex) => setScrollDirection(itemValue)}
                >
                    <Picker.Item label="None" value={ScrollDirection.None} />
                    <Picker.Item label="Left" value={ScrollDirection.Left} />
                    <Picker.Item label="Right" value={ScrollDirection.Right} />
                </Picker>

                <ColorPicker
                    onChange={value => SetColor(value.rgb)}>
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
    width: '100%'
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