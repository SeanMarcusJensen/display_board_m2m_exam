import {  StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView, TextInput } from 'react-native';

import Colors from '../constants/Colors';
import { VStack } from './VStack';
import { MatrixConfig, SignboardConfig } from '../types/MatrixConfig';
import { HStack } from './HStack';

import { Text, View } from './Themed';

export type MatrixConfigProps= {
    matrix: MatrixConfig,
    SetConfig: <T extends keyof MatrixConfig>(key: T, value: SignboardConfig[T]) => void
}

export default function MatrixConfiguration(props: MatrixConfigProps) {
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView>
          <HStack>
            <Text
              style={{ 'alignSelf': 'center', fontSize: 20}}
              lightColor={Colors[colorScheme ?? 'light'].text}
              darkColor={Colors[colorScheme ?? 'dark'].text}
              >{props.matrix.name ?? "Matrix"}</Text>

            <View style={{...styles.separator, marginVertical: 15, width: '100%'}} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <TextInput
            value={props.matrix.name ?? "Name"}
            inputMode='text'
            keyboardAppearance={colorScheme ?? 'light'}
            onChangeText={value => props.SetConfig('name', value)}
            style={{
                ...styles.textInput,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
            }} />

            <VStack style={{'gap': 10, 'marginBottom': 15}}>
              <VStack style={{'gap': 5, width: '50%', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ alignSelf: 'center' }}>Width:</Text>
                <TextInput
                    value={props.matrix.width.toString() ?? "16"}
                    onChangeText={value => props.SetConfig('width', Number(value))}
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    style={{
                    ...styles.textInput,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                    width: '80%',
                    }}/>
              </VStack>

              <VStack style={{'gap': 5, width: '50%', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ alignSelf: 'center' }}>Height:</Text>
                <TextInput
                    value={props.matrix.height.toString() ?? "16" }
                    onChangeText={value => props.SetConfig('height', Number(value))}
                    keyboardType='numeric'
                    inputMode='numeric'
                    keyboardAppearance={colorScheme ?? 'light'}
                    style={{
                    ...styles.textInput,
                    color: Colors[colorScheme ?? 'light'].text,
                    borderColor: Colors[colorScheme ?? 'light'].tint,
                    width: '80%'
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