import { StyleSheet, Pressable, useColorScheme } from 'react-native';

import { Text, View } from '../../../components/Themed';
import { MatrixConfig, SignboardConfig } from '../../../types/MatrixConfig';
import MatrixConfiguration from '../../../components/MatrixConfiguration';
import MQTTConfiguration from '../../../components/MQTTConfiguration';
import Colors from '../../../constants/Colors';


export type InfoProps= {
    matrix: SignboardConfig,
    SetConfig: <T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) => void,
    SaveConfig: () => Promise<void>
}

export default function Info(props: InfoProps) {
  const colorScheme = useColorScheme();
  return (
    <View style={{ width: '80%'}}>

      <MatrixConfiguration
        matrix={props.matrix}
        locked={['name']}
        SetConfig={props.SetConfig} />

      <MQTTConfiguration
        brokerConfig={props.matrix}
        SetConfig={props.SetConfig} />

       <Pressable
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={async () => {
            await props.SaveConfig()
            .then(() => console.log("Registered"))
            .catch((e) => console.log(`Failed to register: ${e}`));
          }}
        >
          <Text
            style={{fontSize: 16 }}
            lightColor={Colors[colorScheme ?? 'light'].buttonText}
            darkColor={Colors[colorScheme ?? 'dark'].buttonText}
            >Save</Text>
        </Pressable>
    </View>
  );
}