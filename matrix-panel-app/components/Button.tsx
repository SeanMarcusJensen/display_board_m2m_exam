import { Pressable, PressableProps, useColorScheme } from "react-native"
import Colors from "../constants/Colors";


export default function Button(props: PressableProps) {
    const colorScheme = useColorScheme();
    return (
         <Pressable
            {...props}
            style={({pressed}) => ({
                backgroundColor: pressed
                ? Colors[colorScheme ?? 'light'].buttonPressedColor
                : Colors[colorScheme ?? 'light'].buttonColor,
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
            })}>
            {props.children}
        </Pressable>
    )
}