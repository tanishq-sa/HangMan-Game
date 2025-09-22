import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function TabTwoScreen() {
  const [location, setLocation] = useState<string>('');
  const colorScheme = useColorScheme();

  return (
    <View className={`flex-1 items-center justify-center ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Text className={`text-2xl font-bold text-center mt-10 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
        Hello, Tanishq
      </Text>
      <Pressable
        className={`mt-10 px-6 py-3 rounded-full ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
        onPress={async () => {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const loc = await Location.getCurrentPositionAsync({});
              setLocation(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
            } else {
              setLocation('Location permission denied');
            }
          } catch (error) {
            setLocation('Location error');
          }
        }}
      >
        <Text className='text-white text-xl font-bold'>Click to Get location</Text>
      </Pressable>
      {location ? (
        <Text className={`text-lg mt-4 text-center ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          {location}
        </Text>
      ) : null}
    </View>
  );
}
