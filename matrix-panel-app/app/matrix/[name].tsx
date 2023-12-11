import { StyleSheet, Pressable, useColorScheme, ScrollView } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { GetConfigAsync, StoreConfigAsync } from '../../services/SignboardRepository';
import { MatrixConfig, SignboardConfig } from '../../types/MatrixConfig';
import SendText from './components/SendText';
import { ValidateSignboardConfig } from '../../services/Validators/SignboardValidator';
import Colors from '../../constants/Colors';
import MQTTSender from '../../services/MQTTSender';
import SendImage from './components/SendImage';
import { HStack } from '../../components/HStack';
import Info from './components/Info';

enum ContentType {
  Info,
  Text,
  Image
}

export default function MatrixInfo() {
  const { name } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [matrix, setMatrixConfig] = useState<SignboardConfig>({} as SignboardConfig);
  const [isLoading, setLoading] = useState(true);
  const [client, setClient] = useState<MQTTSender | undefined>(undefined);
  const [content, setContent] = useState<ContentType>(ContentType.Info);

  const Content = {
    [ContentType.Text]: SendText({client: client}),
    [ContentType.Image]: SendImage({client: client, matrix: matrix}),
    [ContentType.Info]: Info({matrix: matrix, SetConfig: SetConfig, SaveConfig: SaveConfig})
  }

  function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
    setMatrixConfig(prev => ({...prev, [key]: value}));
  }

  async function SaveConfig() {

    if (ValidateSignboardConfig(matrix)){
      console.log("Config is valid")
      console.log(matrix);
      await StoreConfigAsync(matrix, (e) => { console.log(e) });
      if (client?.IsConnected()){
        const { name, width, height } = matrix;
        const config = { name, width, height } as MatrixConfig;
        client?.SendAsJson(config, 'scale');
      }
    } else {
      console.log("Config is invalid")
    }
  }

  useEffect(() => {
    // AsyncStorage.clear();
    if (name == undefined) return;
    const fetchMatrices = async () => {
      console.log("Fetching matrices");
      const matricesFromCache= await GetConfigAsync(name as string, (e) => console.error(e));
      if (matricesFromCache != null) {
        setMatrixConfig(matricesFromCache);
        const newClient = new MQTTSender(matricesFromCache);
        newClient.Connect();
        setClient(newClient);
      }
    };

    fetchMatrices().finally(() => setLoading(false));
  }, []);

  if (!isLoading) {
    return (
      <ScrollView>

        <View style={styles.container}>
            <View style={{...styles.separator, marginVertical: 15 }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <HStack style={{ width: '100%', gap: 5, alignItems: 'center', justifyContent: 'space-evenly'}}>
              <Pressable
                style={{
                  backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
                  width: '50%',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => setContent(ContentType.Info)}
                >
                  <Text
                    style={{fontSize: 16 }}
                    lightColor={Colors[colorScheme ?? 'light'].buttonText}
                    darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                    >Info</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
                  width: '50%',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => setContent(ContentType.Text)}
                >
                  <Text
                    style={{fontSize: 16 }}
                    lightColor={Colors[colorScheme ?? 'light'].buttonText}
                    darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                    >Text</Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
                  width: '50%',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => setContent(ContentType.Image)}
                >
                  <Text
                    style={{fontSize: 16 }}
                    lightColor={Colors[colorScheme ?? 'light'].buttonText}
                    darkColor={Colors[colorScheme ?? 'dark'].buttonText}
                    >Image</Text>
              </Pressable>
            </HStack>
            <View style={{...styles.separator, marginVertical: 15 }} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={{...styles.container }}>
              {Content[content]}
            </View>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
