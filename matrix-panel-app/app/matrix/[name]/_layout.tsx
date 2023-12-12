import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useLocalSearchParams } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../../components/Themed';

import Colors from '../../../constants/Colors';
import React, { useEffect } from 'react';
import { SignboardConfig } from '../../../types/MatrixConfig';
import MQTTSender from '../../../services/MQTTSender';
import { GetConfigAsync } from '../../../services/SignboardRepository';
import { MatrixProvider } from '../../../providers/MatrixProvider';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default () => {
    const colorScheme = useColorScheme();

	// Comes from the folder captured by the wildcard in the path.
    const { name } = useLocalSearchParams();
    return (
		<MatrixProvider name={name as string}>
			<Tabs>
				<Tabs.Screen
						name="Info"
						options={{
							headerLeft: () => (
								<Pressable onPress={() => router.back()}>
								{({ pressed }) => (
									<FontAwesome
									name="arrow-left"
									size={25}
									color={Colors[colorScheme ?? 'light'].text}
									style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
								</Pressable>
							),
							title: 'Info',
							tabBarIcon: ({ color }) => <TabBarIcon name="address-card" color={color} />,
						}}/>

				<Tabs.Screen
						name="SendImage"
						options={{
							headerLeft: () => (
								<Pressable onPress={() => router.back()}>
								{({ pressed }) => (
									<FontAwesome
									name="arrow-left"
									size={25}
									color={Colors[colorScheme ?? 'light'].text}
									style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
								</Pressable>
							),
							title: 'Image',
							tabBarIcon: ({ color }) => <TabBarIcon name="image" color={color} />,
						}}/>

				<Tabs.Screen
						name="SendText"
						options={{
							headerLeft: () => (
								<Pressable onPress={() => router.back()}>
								{({ pressed }) => (
									<FontAwesome
									name="arrow-left"
									size={25}
									color={Colors[colorScheme ?? 'light'].text}
									style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
									/>
								)}
								</Pressable>
							),
							title: 'Text',
							tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
						}}/>
			</Tabs>
		</MatrixProvider>
    );
}