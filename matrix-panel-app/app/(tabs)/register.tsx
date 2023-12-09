import { SafeAreaView, Pressable, StyleSheet, useColorScheme } from 'react-native';

import { useState } from 'react';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { SignboardConfig } from '../../types/MatrixConfig';
import MQTTConfiguration from '../../components/MQTTConfiguration';
import MatrixConfiguration from '../../components/MatrixConfiguration';

import { StoreConfigAsync } from '../../services/SignboardRepository';
import { ValidateSignboardConfig } from '../../services/Validators/SignboardValidator';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const [matrix, setMatrixConfig] = useState<SignboardConfig>({
    width: 16,
    height: 16,
    brokerPort: 8883,
    brokerScheme: 'https://'
  } as SignboardConfig)

  function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
    setMatrixConfig(prev => ({...prev, [key]: value}));
  }

  async function RegisterConfig() {
     if (ValidateSignboardConfig(matrix)){
      console.log("Config is valid")
      console.log(matrix);
      await StoreConfigAsync(matrix, (e) => { console.log(e) });
    } else {
      console.log("Config is invalid")
    }
  }

  return (
    <View style={styles.container}>
      {/* REGISTRATION */}
      <SafeAreaView style={{ width: '80%'}}>

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
