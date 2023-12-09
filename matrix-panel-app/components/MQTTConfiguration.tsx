import {  StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView, TextInput } from 'react-native';

import { Text, View } from './Themed';
import Colors from '../constants/Colors';
import { VStack } from './VStack';
import { BrokerConfig, SignboardConfig } from '../types/MatrixConfig';
import { HStack } from './HStack';


export type MQTTConfigProps = {
    brokerConfig: BrokerConfig,
    SetConfig: <T extends keyof BrokerConfig>(key: T, value: SignboardConfig[T]) => void
}

export default function MQTTConfiguration(props: MQTTConfigProps) {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView>
            <HStack>
                <Text
                  style={{ 'alignSelf': 'center', fontSize: 20}}
                  lightColor={Colors[colorScheme ?? 'light'].text}
                  darkColor={Colors[colorScheme ?? 'dark'].text}
                  >MQTT</Text>

                <View style={{...styles.separator, marginVertical: 15, width: '100%'}} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

                <VStack style={{ 'gap': 5 }}>
                    <TextInput
                    value={props.brokerConfig.brokerScheme}
                    onChangeText={value => props.SetConfig('brokerScheme', value)}
                    keyboardAppearance={colorScheme ?? 'light'}
                    inputMode='text'
                    style={{
                        ...styles.textInput,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                        width: '20%',
                        padding: 5,
                        textAlign: 'center',
                    }} />

                    <TextInput
                    value={props.brokerConfig.brokerUrl ?? 'Broker URL'}
                    inputMode='url'
                    onChangeText={value => props.SetConfig('brokerUrl', value)}
                    keyboardAppearance={colorScheme ?? 'light'}
                    style={{
                        ...styles.textInput,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                        width: '65%'
                    }} />

                    <TextInput
                    value={props.brokerConfig.brokerPort?.toString()}
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    onChangeText={value => props.SetConfig('brokerPort', Number(value))}
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