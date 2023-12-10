import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../../components/Themed";
import { Pressable, StyleSheet, Image as ImageComponent, useColorScheme } from "react-native";
import { useState } from "react";
import Colors from "../../../constants/Colors";
import MQTTSender from "../../../services/MQTTSender";
import Button from "../../../components/Button";

import * as ImagePicker from 'expo-image-picker';
import { MatrixConfig } from "../../../types/MatrixConfig";
import { Image } from 'image-js';
import { RGBToRGB565 } from "../services/ImageUtils";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { Buffer } from 'buffer';


export default function SendImage({client, matrix} :{client: MQTTSender | undefined, matrix: MatrixConfig | undefined}) {
    const colorScheme = useColorScheme();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [ready, setReady] = useState<boolean>(false);

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
        if (image == undefined) return;

        const maniplulatedImage = await manipulateAsync(image.uri, [{resize: {width: matrix?.width ?? 16, height: matrix?.height ?? 16}}], {compress: 0, format: SaveFormat.JPEG, base64: true})

        if (maniplulatedImage.base64 == undefined) return;

        Buffer.alloc(image?.fileSize ?? 0);
        const base64 = Buffer.from(maniplulatedImage?.base64 ?? '', 'base64');
        const selectedImage = await Image.load(base64);
        // selectedImage.resize({width: matrix?.width ?? 16, height: matrix?.height ?? 16})

        console.log(selectedImage.data);

        const pixelArray = selectedImage.getPixelsArray();

        console.log(pixelArray);

        const rgb565Array = pixelArray.map(pixel => {
            const r = pixel[0];
            const g = pixel[1];
            const b = pixel[2];
            return RGBToRGB565(r, g, b);
        });

        console.log(rgb565Array);

        if (client != undefined) {
            client.SendImage(rgb565Array, 'image');
        }
    }

    return (
        <>
            <Text>Image</Text>

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
        </>
    )
}