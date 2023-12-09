import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import { SignboardConfig } from '../../types/MatrixConfig';
import { GetAllAsync } from '../../services/SignboardRepository';

export default function HomeScreen() {
  const [isLoading, setLoading] = useState(true);
  const [matrices, setMatrices] = useState<SignboardConfig[]>([]);

  useEffect(() => {
    // AsyncStorage.clear();
    const fetchMatrices = async () => {
      const matricesFromCache= await GetAllAsync((e) => console.error(e));

      console.log(matricesFromCache);

      if (matricesFromCache != null && matricesFromCache.length != 0) {
        console.log("GOT MATRICIES FROM CACHE");
        setMatrices(matricesFromCache);
      } else {
        console.log("NO MATRICIES IN CACHE");
      }
    };

      fetchMatrices()
        .finally(() => setLoading(false));
  }, []);

  if (!isLoading) {
    if (matrices.length > 0) {
      return (
        <View style={styles.container}>
          {/* HEADER */}
          <>
            <Text style={styles.title}>Main</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          </>

          {/* CONTENT */}
          <>

          </>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No registered matrices found</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
      );
    }
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
