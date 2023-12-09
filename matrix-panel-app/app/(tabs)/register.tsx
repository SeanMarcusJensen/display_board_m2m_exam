import { StyleSheet, useColorScheme } from 'react-native';

import { SafeAreaView, Button, TextInput } from 'react-native';

import { useEffect, useState } from 'react';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';

interface MatrixConfig {
  name: string;
  height: number;
  width: number;
  brokerUrl: string;
  brokerPort: number;
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme();

  const [matrixConfig, setMatrixConfig] = useState<MatrixConfig>({} as MatrixConfig)

  function SetConfig<T extends keyof MatrixConfig>(key: T, value: MatrixConfig[T]) {
      setMatrixConfig(prev => ({...prev, [key]: value}));
      console.log("MatrixConfig: ", matrixConfig);
      console.log(matrixConfig);
  }

  // useEffect(() => {
  //   console.log("MatrixConfig: ", matrixConfig);
  // }, [matrixConfig]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <>
        <Text style={styles.title}>Registration</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </>
      {/* REGISTRATION */}
      <SafeAreaView>

        <TextInput
          placeholder="Name"
          keyboardType='default'
          keyboardAppearance={colorScheme ?? 'light'}
          onChangeText={value => SetConfig('name', value)}
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            ...styles.textInput
          }}
          />

        <TextInput
          placeholder="Matrix Width"
          onChangeText={value => SetConfig('width', Number(value))}
          keyboardType='numeric'
          keyboardAppearance={colorScheme ?? 'light'}
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            ...styles.textInput
          }}
          />

        <TextInput
          placeholder="Matrix Height"
          onChangeText={value => SetConfig('height', Number(value))}
          keyboardType='numeric'
          keyboardAppearance={colorScheme ?? 'light'}
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            ...styles.textInput
          }}
          />

        <TextInput
          placeholder="Broker URL"
          keyboardType='url'
          onChangeText={value => SetConfig('brokerUrl', value)}
          keyboardAppearance={colorScheme ?? 'light'}
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            ...styles.textInput
          }}
          />

        <TextInput
          placeholder="Broker PORT"
          keyboardType='numeric'
          keyboardAppearance={colorScheme ?? 'light'}
          onChangeText={value => SetConfig('brokerPort', Number(value))}
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
            ...styles.textInput
          }}
          />

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
