import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { GetConfigAsync } from '../../services/SignboardRepository';
import { SignboardConfig } from '../../types/MatrixConfig';
import SendText from './components/SendText';
import MatrixConfiguration from '../../components/MatrixConfiguration';
import MQTTConfiguration from '../../components/MQTTConfiguration';


export type InfoProps= {
    matrix: SignboardConfig,
    SetConfig: <T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) => void
}

const Info = (props: InfoProps) => {
  return (
    <View style={{ width: '80%'}}>
      <MatrixConfiguration matrix={props.matrix} SetConfig={props.SetConfig} />
      <MQTTConfiguration brokerConfig={props.matrix} SetConfig={props.SetConfig} />
    </View>
  );
}

export default function MatrixInfo() {
  const { name } = useLocalSearchParams();
  const [matrix, setMatrixConfig] = useState<SignboardConfig>({} as SignboardConfig);
  const [isLoading, setLoading] = useState(true);

  function SetConfig<T extends keyof SignboardConfig>(key: T, value: SignboardConfig[T]) {
    setMatrixConfig(prev => ({...prev, [key]: value}));
  }

  useEffect(() => {
    // AsyncStorage.clear();
    const fetchMatrices = async () => {
      const matricesFromCache= await GetConfigAsync(name as string, (e) => console.error(e));
      if (matricesFromCache != null) {
        setMatrixConfig(matricesFromCache);
      }
    };

    fetchMatrices().finally(() => setLoading(false));
  }, []);

  if (!isLoading) {
    return (
        <View style={styles.container}>
            <Info matrix={matrix} SetConfig={SetConfig} />
            <SendText />
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
