import { SafeAreaView, Pressable, StyleSheet, useColorScheme, ScrollView } from 'react-native';

import { useState } from 'react';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { MatrixConfig, SignboardConfig } from '../../types/MatrixConfig';
import MQTTConfiguration from '../../components/MQTTConfiguration';
import MatrixConfiguration from '../../components/MatrixConfiguration';

import { StoreConfigAsync } from '../../services/SignboardRepository';
import { ValidateSignboardConfig } from '../../services/Validators/SignboardValidator';
import MQTTSender from '../../services/MQTTSender';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const [matrix, setMatrixConfig] = useState<SignboardConfig>({
    width: 16,
    height: 16,
    brokerPort: 8084,
    brokerScheme: 'wss://',
    useSSL: true,
  } as SignboardConfig)

  function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
    setMatrixConfig(prev => ({...prev, [key]: value}));
  }

  async function RegisterConfig() {
     if (ValidateSignboardConfig(matrix)){
      console.log("Config is valid")
      console.log(matrix);
      await StoreConfigAsync(matrix, (e) => { console.log(e) });

      const client = new MQTTSender(matrix);
      client.SendAsJson(JSON.stringify(matrix as MatrixConfig), 'scale');
    } else {
      console.log("Config is invalid")
    }
  }

  return (
    <ScrollView>

      <View style={styles.container}>
        {/* REGISTRATION */}
        <SafeAreaView style={{ width: '90%'}}>

          <MatrixConfiguration
            matrix={matrix}
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
            onPress={() => {
              RegisterConfig()
              .then(() => console.log("Registered"))
              .catch((e) => console.log(`Failed to register: ${e}`));
            }}
          >
            <Text
              style={{fontSize: 16 }}
              lightColor={Colors[colorScheme ?? 'light'].buttonText}
              darkColor={Colors[colorScheme ?? 'dark'].buttonText}
              >Register</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  }
});
