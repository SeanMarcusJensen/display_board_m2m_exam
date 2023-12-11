import { StyleSheet, Pressable, useColorScheme, FlatList} from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect, useState } from 'react';
import { GetAllKeysAsync } from '../../services/SignboardRepository';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';


function MatrixItem({item} : {item: string}){
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  console.log(`MatrixItem: ${item}`);
  return (
    <Link href={`/matrix/${item}`} asChild>
      <Pressable
        style={{ padding: 20, margin: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FFF', backgroundColor: '#123456'}}>
        <Text
          style={{alignSelf: 'center', fontSize: 20}}
          lightColor={Colors[colorScheme ?? 'light'].text}
          darkColor={Colors[colorScheme ?? 'dark'].text}>
            {item}</Text>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const [isLoading, setLoading] = useState(true);
  const [matrices, setMatrices] = useState<readonly string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchMatrices = async () => {
      const matricesFromCache = await GetAllKeysAsync();
      if (matricesFromCache != null && matricesFromCache.length > 0) {
        console.log(`Setting matrices to ${matricesFromCache}`);
        console.log(matricesFromCache);
        setMatrices(matricesFromCache);
      }
    };

    fetchMatrices().finally(() => setLoading(false));
  }, [refreshing]);

  if (!isLoading) {
    if (matrices?.length > 0) {
      return (
        <SafeAreaView style={{...styles.container, height: '100%', width:'100%'}}>
          {/* <FlatList
            style={{ width: '100%', height: '100%'}}
            data={matrices}
            renderItem={(item) => (<MatrixItem matrix={item.item}/>)}
            keyExtractor={(item) => item}/> */}
          { matrices.map((item, index) => {
            return (
              <MatrixItem item={item} key={index}/>
            )
          })}
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No registered matrices found</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <Button
            onPress={() => setRefreshing(true)}
          >
            <Text>Refresh</Text>
          </Button>
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
