import { Text, View } from "../../../components/Themed";
import { Image as ImageComponent, TextInput, useColorScheme, StyleSheet} from "react-native";
import { useState } from "react";
import Colors from "../../../constants/Colors";
import Button from "../../../components/Button";
import { Picker } from '@react-native-picker/picker';

import * as ImagePicker from 'expo-image-picker';
import { Image } from 'image-js';
import { RGBToRGB565 } from "../../../services/ImageUtils";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { Buffer } from 'buffer';
import { ScrollDirection } from "../../../components/ScrollDirection";
import React from "react";
import { MatrixContext } from "../../../providers/MatrixProvider";
import { ScrollView } from "react-native-gesture-handler";


export default function SendImage() {
    const colorScheme = useColorScheme();
    const context = React.useContext(MatrixContext);

    if (context == undefined) throw new Error("Context is undefined");
    const { matrix, client } = context;

    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [ready, setReady] = useState<boolean>(false);
    const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(ScrollDirection.None);
    const [scrollSpeed, setScrollSpeed] = useState<number>(1);

    async function PickImage() {
        console.log("PICKING IMAGE");
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
            base64: true
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0]);
            setReady(true);
        }
    }

    async function SendImage() {
        if (image?.uri == undefined) return;

        const manipulatedImage = await manipulateAsync(
            image.uri,
            [
                {
                    resize: {
                        width: matrix?.width ?? 16,
                        height: matrix?.height ?? 16
                    }
                }
            ], {
                compress: 0,
                format: SaveFormat.JPEG,
                base64: true
            })

        if (manipulatedImage.base64 == undefined) return;

        Buffer.alloc(image?.fileSize ?? 0);
        const base64 = Buffer.from(manipulatedImage.base64 ?? '', 'base64');
        const selectedImage = await Image.load(base64);
        const pixelArray = selectedImage.getPixelsArray();
        const rgb565Array = pixelArray.map(pixel => {
            const r = pixel[0];
            const g = pixel[1];
            const b = pixel[2];
            return RGBToRGB565(r, g, b);
        });

        console.log(rgb565Array);

        if (client != undefined) {
            client.SendAsJson({
                payload: rgb565Array,
                scrollDirection: scrollDirection as number,
                scrollSpeed: scrollSpeed,
            }, 'image');
        }
    }

    return (
        <ScrollView>
            <Text>Image</Text>

            <TextInput
                placeholder="Scroll Speed"
                inputMode='numeric'
                keyboardAppearance={colorScheme ?? 'light'}
                onChangeText={value => setScrollSpeed(Number(value))}
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

            { image != undefined &&
                <View>
                    <ImageComponent source={{ uri: image?.uri, height: image?.height, width: image?.width }} />
                </View>
            }
            
            <Button
                onPress={PickImage}
            >
                <Text
                    darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                    lightColor={Colors[colorScheme ?? 'light'].buttonText}
                >Pick Image</Text>
            </Button>
            { ready &&
                <Button
                    onPress={SendImage}
                >
                    <Text
                        darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                        lightColor={Colors[colorScheme ?? 'light'].buttonText}
                    >SendImage</Text>
                </Button>
            }
        </ScrollView>
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