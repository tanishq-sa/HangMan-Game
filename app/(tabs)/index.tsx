import { useColorScheme } from '@/hooks/use-color-scheme';
import { Camera } from 'expo-camera';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';


export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [name, setName] = useState<string>('');
  const colorScheme = useColorScheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Good Night';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setShowCamera(true);
      }
    } catch (error) {
      console.log('Camera permission error:', error);
      setHasPermission(false);
    }
  };
  return (
    <View className={`flex-1 items-center justify-center ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <Text className={`text-2xl font-bold text-center mt-10 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>
          {getGreeting()}{name}
        </Text>
      <TextInput 
        placeholder='Enter your name' 
        placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'gray'}
        className={`mt-4 px-4 py-2 border rounded-lg text-lg w-64 ${
          colorScheme === 'dark' 
            ? 'border-gray-600 text-white bg-gray-800' 
            : 'border-gray-300 text-black bg-white'
        }`}
        style={{ minHeight: 40 }}
        onChangeText={(text) => setName(text ? ', ' + text : '')}
      />
    </View>
  );
}
