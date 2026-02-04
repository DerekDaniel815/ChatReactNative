import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Chat } from '../pages/Chat/Chat';
import { Login } from '../pages/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ListChat } from '@/pages/ListChat';
import { Register } from '@/pages/Register';
import { ListSuggestions } from '@/pages/ListSuggestions';
import { useAppSelector } from '@/store/hooks';
import { useGlobalChatSocket } from './hooks/useGlobalChatSocket';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TabsNavigator: { name: string };
};

export type ChatStackParamList = {
  ListChat: { name: string };
  ListSuggestions: undefined;
  Chat: { name: string; chatId: string };
};

export type TabsParamList = {
  StackChatNavigator: { name: string };
};

const TabsStack = createBottomTabNavigator<TabsParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();

export function StackChatNavigator({
  route,
}: {
  route: { params: { name: string } };
}) {
  console.log('StackChatNavigator route.params:', route.params);
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen
        name="ListChat"
        component={ListChat}
        initialParams={{ name: route.params.name }}
      />
      <ChatStack.Screen name="Chat" component={Chat} />
      <ChatStack.Screen name="ListSuggestions" component={ListSuggestions} />
    </ChatStack.Navigator>
  );
}

export function TabsNavigator({
  route,
}: {
  route: { params: { name: string } };
}) {
  const accessToken = useAppSelector(s => s.auth.accessToken);
  useGlobalChatSocket(accessToken ?? '');
  return (
    <TabsStack.Navigator screenOptions={{ headerShown: false }}>
      <TabsStack.Screen
        name="StackChatNavigator"
        component={StackChatNavigator}
        initialParams={{ name: route.params.name }}
      />
    </TabsStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Register" component={Register} />
      <RootStack.Screen name="TabsNavigator" component={TabsNavigator} />
    </RootStack.Navigator>
  );
}
