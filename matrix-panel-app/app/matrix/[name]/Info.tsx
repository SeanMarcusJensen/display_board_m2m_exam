import { Pressable, useColorScheme } from 'react-native';

import { Text, View } from '../../../components/Themed';
import { MatrixConfig } from '../../../types/MatrixConfig';
import MatrixConfiguration from '../../../components/MatrixConfiguration';
import MQTTConfiguration from '../../../components/MQTTConfiguration';
import Colors from '../../../constants/Colors';
import { MatrixContext } from '../../../providers/MatrixProvider';
import React from 'react';

export default function InfoScreen() {

  const colorScheme = useColorScheme();
  const context = React.useContext(MatrixContext);

  if (context == undefined) throw new Error("Context is undefined");

  const { matrix, client, SetConfig, SaveAsync } = context;

  async function SaveConfig() {
    if (await SaveAsync())
    {
      console.log("Saved");
      if (client?.IsConnected()){
        const { name, width, height } = matrix;
        const config = { name, width, height } as MatrixConfig;
        client?.SendAsJson(config, 'scale');
      }
    }else {
      console.log("Failed to save");
    }
  }

  return (
    <View style={{ width: '100%'}}>

      <MatrixConfiguration
        matrix={matrix}
        locked={['name']}
        SetConfig={SetConfig} />

      <MQTTConfiguration
        brokerConfig={matrix}
        SetConfig={SetConfig} />

       <Pressable
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={async () => {
            await SaveConfig()
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