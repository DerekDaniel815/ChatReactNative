import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_NAME = 'chat:name';

export async function saveName(name: string) {
  await AsyncStorage.setItem(KEY_NAME, name.trim());
}

export async function getName() {
  return AsyncStorage.getItem(KEY_NAME);
}

export async function clearName() {
  return AsyncStorage.removeItem(KEY_NAME);
}
