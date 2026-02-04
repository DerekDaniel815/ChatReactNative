import React, { useEffect, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { ChatComposer } from './components/ChatComposer';
import { dmRoom, useChatSocket } from './hooks/useChatSocket';
import { MessageList } from './components/MessagesList';
import { ChatStackParamList } from '@/navigation/AppNavigator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMessagesByRoomKeyThunk } from '@/store/chat/chatThunks';

type Props = NativeStackScreenProps<ChatStackParamList, 'Chat'>;

export function Chat({ route }: Props) {
  const dispatch = useAppDispatch();
  const { chatId } = route.params;
  const { user, accessToken } = useAppSelector(s => s.auth);

  const room = useMemo(() => {
    if (chatId === 'global') return chatId;
    if (!user?.id) return 'global';
    return dmRoom(user.id, chatId);
  }, [user?.id, chatId]);

  const messages = useAppSelector(s => s.chat.messagesByRoom[room] ?? []);
  const loaded = useAppSelector(s => s.chat.loadedRooms[room]);

  useEffect(() => {
    dispatch(fetchMessagesByRoomKeyThunk({ roomKey: room }));
  }, [room, loaded, dispatch]);

  const { send } = useChatSocket(chatId, room, accessToken ?? '');
  const headerHeight = useHeaderHeight();
  // const colorStatus = () => {
  //   switch (status) {
  //     case 'connected':
  //       return 'green';
  //     case 'connecting':
  //       return 'orange';
  //     case 'connect_error':
  //       return 'red';
  //     default:
  //       return 'gray';
  //   }
  // };
  const content = (
    <>
      {/* Fondo tipo “papel” */}
      <View style={styles.background} />
      <View style={styles.statusContainer}>
        <Text>{'connected'}</Text>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: 'green',
            },
          ]}
        />
      </View>
      <MessageList messages={messages} userId={user?.id ?? ''} />
      <ChatComposer send={send} />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },
  statusContainer: {
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  statusIndicator: {
    borderRadius: 20,
    width: 10,
    height: 10,
  },
});
