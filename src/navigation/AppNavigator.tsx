import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Chat } from '../pages/Chat';
import { Login } from '../pages/Login';

export type RootStackParamList = {
  Login: undefined;
  Chat: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Entrar' }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
}
