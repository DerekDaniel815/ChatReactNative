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
import { useAppDispatch } from '@/store/hooks';
import { registerThunk } from '@/store/auth/authThunks';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function Register({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // console.log('Auth status:', status, 'Error:', error);

  const onEnter = async () => {
    const fields = [
      {
        value: name,
        title: 'Falta nombre',
        message: 'Ingresa tu nombre para continuar.',
      },
      {
        value: email,
        title: 'Falta correo',
        message: 'Ingresa tu correo para continuar.',
      },
      {
        value: password,
        title: 'Falta contraseña',
        message: 'Ingresa tu contraseña para continuar.',
      },
    ];

    for (const field of fields) {
      if (!field.value.trim()) {
        Alert.alert(field.title, field.message);
        return;
      }
    }
    const payload = {
      username: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    const res = await dispatch(registerThunk(payload));

    if (registerThunk.fulfilled.match(res)) {
      // Ya se guardo en Redux y tokens en Keychain
      navigation.replace('Login'); // o directo a Home si quieres
    } else {
      Alert.alert('Error', res.payload ?? 'No se pudo registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      <Text>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej: Derek"
        autoCapitalize="words"
        style={styles.input}
      />
      <Text>Correo</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Ej: user@gmail.com"
        style={styles.input}
      />
      <Text>Contraseña</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Ej: 123456"
        style={styles.input}
      />

      <TouchableOpacity onPress={onEnter} style={styles.button}>
        <Text style={styles.buttonText}>registrar</Text>
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
