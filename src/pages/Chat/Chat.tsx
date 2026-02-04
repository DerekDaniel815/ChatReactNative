import React, { useEffect, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
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

export function Chat({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { chatId, name } = route.params;
  const { user, accessToken } = useAppSelector(s => s.auth);

  const room = useMemo(() => {
    if (chatId === 'global') return 'global';
    if (!user?.id) return 'global';
    return dmRoom(user.id, chatId);
  }, [user?.id, chatId]);

  const messages = useAppSelector(s => s.chat.messagesByRoom[room] ?? []);

  useEffect(() => {
    dispatch(fetchMessagesByRoomKeyThunk({ roomKey: room }));
  }, [room, dispatch]);

  const { send } = useChatSocket(chatId, room, accessToken ?? '');
  const headerHeight = useHeaderHeight();

  const title = chatId === 'global' ? 'Chat Global' : name;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.headerSubRow}>
            <Text style={styles.headerSubtitle}>Conectado</Text>
            <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
          </View>
        </View>

        {/* espacio para balancear el layout (simetría con el back) */}
        <View style={{ width: 42 }} />
      </View>

      {/* Contenido */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={styles.background} />
        <MessageList messages={messages} userId={user?.id ?? ''} />
        <ChatComposer send={send} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0b0f' },

  container: { flex: 1 },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },

  header: {
    backgroundColor: '#0b0b0f',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#151520',
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#14141b',
    borderWidth: 1,
    borderColor: '#232331',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },

  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },

  headerSubRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerSubtitle: { color: '#a7a7b3', fontSize: 12 },
  dot: { width: 8, height: 8, borderRadius: 99 },
});
