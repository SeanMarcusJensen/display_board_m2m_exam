import {  StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView, TextInput } from 'react-native';

import Colors from '../constants/Colors';
import { VStack } from './VStack';
import { MatrixConfig, SignboardConfig } from '../types/MatrixConfig';
import { HStack } from './HStack';

import { Text, View } from './Themed';

export type MatrixConfigProps= {
    matrix: MatrixConfig,
    locked?: [keyof MatrixConfig],
    SetConfig: <T extends keyof MatrixConfig>(key: T, value: SignboardConfig[T]) => void
}

export default function MatrixConfiguration(props: MatrixConfigProps) {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView>
          <HStack>
            <TextInput
              value={props.matrix.name ?? "Name"}
              inputMode='text'
              editable={!props.locked?.includes('name')}
              keyboardAppearance={colorScheme ?? 'light'}
              onChangeText={value => props.SetConfig('name', value)}
              style={{
                  ...styles.textInput,
                  width: '90%',
                  alignSelf: 'center',
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].tint,
              }} />

            <VStack style={{'gap': 5, 'marginBottom': 15, justifyContent: 'center'}}>
            <VStack style={{width: '45%'}}>
                <View style={{
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                  borderWidth:1,
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                  <Text style={{
                    textAlign: 'center',
                    paddingLeft: 15,
                    alignSelf: 'center'}}>Width:</Text>
                </View>
                <TextInput
                    value={props.matrix.height.toString() ?? "16" }
                    onChangeText={value => props.SetConfig('width', Number(value))}
                    keyboardType='numeric'
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    style={{
                    ...styles.textInput,
                    borderLeftWidth: 0,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                    width: '60%'
                    }} />
              </VStack>

              <VStack style={{width: '45%'}}>
                <View style={{
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                  borderWidth:1,
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                  <Text style={{
                    textAlign: 'center',
                    paddingLeft: 15,
                    alignSelf: 'center'}}>Height:</Text>
                </View>
                <TextInput
                    value={props.matrix.height.toString() ?? "16" }
                    onChangeText={value => props.SetConfig('height', Number(value))}
                    keyboardType='numeric'
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    style={{
                    ...styles.textInput,
                    borderLeftWidth: 0,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                    width: '60%'
                    }} />
              </VStack>
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