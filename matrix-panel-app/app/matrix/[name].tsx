import { StyleSheet, Pressable, useColorScheme } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { GetConfigAsync, StoreConfigAsync } from '../../services/SignboardRepository';
import { MatrixConfig, SignboardConfig } from '../../types/MatrixConfig';
import SendText from './components/SendText';
import MatrixConfiguration from '../../components/MatrixConfiguration';
import MQTTConfiguration from '../../components/MQTTConfiguration';
import { ValidateSignboardConfig } from '../../services/Validators/SignboardValidator';
import Colors from '../../constants/Colors';
import MQTTSender from '../../services/MQTTSender';


export type InfoProps= {
    matrix: SignboardConfig,
    SetConfig: <T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) => void,
    SaveConfig: () => Promise<void>
}

const Info = (props: InfoProps) => {
  const colorScheme = useColorScheme();
  return (
    <View style={{ width: '80%'}}>

      <MatrixConfiguration
        matrix={props.matrix}
        locked={['name']}
        SetConfig={props.SetConfig} />

      <MQTTConfiguration
        brokerConfig={props.matrix}
        SetConfig={props.SetConfig} />

       <Pressable
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].buttonColor,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={async () => {
            await props.SaveConfig()
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

export default function MatrixInfo() {
  const { name } = useLocalSearchParams();
  const [matrix, setMatrixConfig] = useState<SignboardConfig>({} as SignboardConfig);
  const [isLoading, setLoading] = useState(true);
  const [client, setClient] = useState<MQTTSender | undefined>(undefined);


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
        client.SendText(config, 'scale');
      }
    } else {
      console.log("Config is invalid")
    }
  }
  

  useEffect(() => {
    // AsyncStorage.clear();
    const fetchMatrices = async () => {
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
        <View style={styles.container}>
            <Info matrix={matrix} SetConfig={SetConfig} SaveConfig={SaveConfig} />
            <SendText client={client}/>
        </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
