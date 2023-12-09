import { StyleSheet, useColorScheme } from 'react-native';

import { SafeAreaView, Button, TextInput } from 'react-native';

import { useEffect, useState } from 'react';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { VStack } from '../../components/VStack';
import { SignboardConfig } from '../../types/MatrixConfig';
import { HStack } from '../../components/HStack';

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
        
        <TextInput
          placeholder="Name"
          keyboardType='default'
          keyboardAppearance={colorScheme ?? 'light'}
          onChangeText={value => SetConfig('name', value)}
          style={{
              ...styles.textInput,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].tint,
          }} />

        <VStack style={{'gap': 10, 'marginBottom': 15}}>
          <TextInput
            placeholder="Matrix Width"
            onChangeText={value => SetConfig('width', Number(value))}
            keyboardType='numeric'
            keyboardAppearance={colorScheme ?? 'light'}
            style={{
              ...styles.textInput,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].tint,
              width: '50%',
            }}/>

          <TextInput
            placeholder="Matrix Height"
            onChangeText={value => SetConfig('height', Number(value))}
            keyboardType='numeric'
            keyboardAppearance={colorScheme ?? 'light'}
            style={{
              ...styles.textInput,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].tint,
              width: '50%'
            }} />

        </VStack>

        <HStack>
          <Text
            style={{ 'alignSelf': 'center', fontSize: 20}}
            lightColor={Colors[colorScheme ?? 'light'].text}
            darkColor={Colors[colorScheme ?? 'dark'].text}
            >MQTT</Text>

          <View style={{...styles.separator, marginVertical: 15, width: '100%'}} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <VStack style={{ 'gap': 5 }}>
            <TextInput
              value={matrixConfig.brokerScheme}
              onChangeText={value => SetConfig('brokerUrl', value)}
              keyboardAppearance={colorScheme ?? 'light'}
              style={{
                ...styles.textInput,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
                width: '20%',
                padding: 5,
                textAlign: 'center',
              }} />

            <TextInput
              placeholder="Broker URL"
              keyboardType='url'
              onChangeText={value => SetConfig('brokerUrl', value)}
              keyboardAppearance={colorScheme ?? 'light'}
              style={{
                ...styles.textInput,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
                width: '65%'
              }} />

            <TextInput
              value={matrixConfig.brokerPort?.toString()}
              keyboardType='numeric'
              keyboardAppearance={colorScheme ?? 'light'}
              onChangeText={value => SetConfig('brokerPort', Number(value))}
              style={{
                ...styles.textInput,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
                width:'15%',
                textAlign: 'center',
                padding: 5
              }} />

          </VStack>
        </HStack>

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
