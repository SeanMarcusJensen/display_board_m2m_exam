import { Stack } from "expo-router";

export default () => {
    return (
        <Stack>
            <Stack.Screen name='[name]' options={{ headerShown: false }}/>
        </Stack>
    );
}