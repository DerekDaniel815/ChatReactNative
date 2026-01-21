import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { saveName } from '@/services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function Login({ navigation }: Props) {
  const [name, setName] = useState('');

  const onEnter = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Falta nombre', 'Ingresa tu nombre para continuar.');
      return;
    }
    await saveName(trimmed);
    navigation.replace('Chat', { name: trimmed });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu nombre</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej: Derek"
        autoCapitalize="words"
        style={styles.input}
      />

      <TouchableOpacity onPress={onEnter} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
