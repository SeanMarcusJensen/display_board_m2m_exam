import { SafeAreaView, Pressable, StyleSheet, useColorScheme } from 'react-native';

import { useEffect, useState } from 'react';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { SignboardConfig } from '../../types/MatrixConfig';
import MQTTConfiguration from '../../components/MQTTConfiguration';
import MatrixConfiguration from '../../components/MatrixConfiguration';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();

  const [matrixConfig, setMatrixConfig] = useState<SignboardConfig>({
    width: 16,
    height: 16,
    brokerPort: 8883,
    brokerScheme: 'https://'
  } as SignboardConfig)

  function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
    setMatrixConfig(prev => ({...prev, [key]: value}));
    console.log("MatrixConfig: ", matrixConfig);
    console.log(matrixConfig);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <>
        <Text style={styles.title}>Matrix</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </>
      {/* REGISTRATION */}
      <SafeAreaView style={{ width: '80%'}}>

        <MatrixConfiguration
          matrix={matrixConfig}
          SetConfig={SetConfig} />

        <MQTTConfiguration
          brokerConfig={matrixConfig}
          SetConfig={SetConfig} />

        <Pressable
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={() => {
            // Handle button press
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
