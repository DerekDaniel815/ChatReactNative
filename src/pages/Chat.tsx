import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { ChatMessage } from '@/types/chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { LayoutAnimation, UIManager } from 'react-native';
import { socket } from '@/services/socket';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function formatTime(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function Chat({ route }: Props) {
  const { name } = route.params;

  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const data = useMemo(() => messages, [messages]);

  const canSend = text.trim().length > 0;

  const send = () => {
    const t = text.trim();
    if (!t) return;

    const clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    socket.emit('message', { name, room: 'global', text: t, clientId });
    setText('');
  };

  const headerHeight = useHeaderHeight();

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const seenIdsRef = useRef(new Set<string>());

  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const onConnect = () => {
      setStatus('connected');
      socket.emit('join', { name, room: 'global' });
    };

    const onConnectError = (e: any) => {
      setStatus(`connect_error`);
      // si quieres ver el motivo:
      console.log('connect_error', e?.message ?? e);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    const onMessage = (msg: ChatMessage & { clientId?: string }) => {
      const id = msg.clientId ?? msg.id;
      if (seenIdsRef.current.has(id)) return;
      seenIdsRef.current.add(id);
      setMessages(prev => [msg, ...prev]);
    };

    socket.off('message');
    socket.on('message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('message', onMessage);
    };
  }, [name]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [listWidth, setListWidth] = useState(0);

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(n, max));

  const getBubbleWidth = (msgText: string, availableWidth: number) => {
    if (!availableWidth) return undefined; // aun no mide

    // limites (ajusta si quieres)
    const minW = availableWidth * 0.22; // 22%
    const maxW = availableWidth * 0.88; // 88%

    // estimacion: ancho promedio por caracter (fontSize 16 aprox)
    const avgChar = 7.2; // px por caracter aprox (ajustable)
    const base = 40; // padding/espacio minimo
    const ideal = base + msgText.length * avgChar;

    return clamp(ideal, minW, maxW);
  };

  const content = (
    <>
      {/* Fondo tipo “papel” */}
      <View style={styles.background} />
      <View>
        <Text>{status}</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={data}
        inverted
        extraData={messages.length}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        onLayout={(e) => setListWidth(e.nativeEvent.layout.width)}
        initialNumToRender={20}
        windowSize={10}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={[styles.listContent, { paddingBottom: 10 }]}
        renderItem={({ item }) => {
          const isMe = item.name === name;
          const bubbleWidth = getBubbleWidth(item.text ?? '', listWidth);

          return (
            <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.bubbleMe : styles.bubbleOther,
                  { alignSelf: isMe ? 'flex-end' : 'flex-start' },
                  bubbleWidth ? { width: bubbleWidth } : null,
                ]}
              >
                {!isMe && (
                  <Text style={styles.senderName} numberOfLines={1}>
                    {item.name}
                  </Text>
                )}

                <Text
                  allowFontScaling={false}
                  textBreakStrategy="simple"
                  style={[
                    styles.messageText,
                    isMe ? styles.textMe : styles.textOther,
                  ]}
                >
                  {item.text}
                </Text>

                <View style={styles.metaRow}>
                  <Text
                    style={[
                      styles.time,
                      isMe ? styles.timeMe : styles.timeOther,
                    ]}
                  >
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View
        style={[
          styles.composer,
          Platform.OS === 'android' && keyboardHeight > 0
            ? { marginBottom: keyboardHeight + 10 }
            : null,
        ]}
      >
        <View style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Mensaje…"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            textAlignVertical="top"
            multiline
          />
        </View>

        <TouchableOpacity
          onPress={send}
          disabled={!canSend}
          activeOpacity={0.85}
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        >
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return Platform.OS === 'ios' ? (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  ) : (
    <View style={styles.container}>{content}</View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    minWidth: 0,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '88%',
    minWidth: 0,
    flexShrink: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: '#0A84FF',
    borderTopRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
  },

  senderName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3A3A3C',
    marginBottom: 4,
    opacity: 0.85,
  },

  messageText: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  textMe: { color: '#FFFFFF' },
  textOther: { color: '#1C1C1E' },

  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  time: {
    fontSize: 11,
  },
  timeMe: { color: 'rgba(255,255,255,0.8)' },
  timeOther: { color: '#8E8E93' },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,60,67,0.15)',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  input: {
    fontSize: 16,
    maxHeight: 120,
    color: '#1C1C1E',
    padding: 0,
    margin: 0,
  },

  sendBtn: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(10,132,255,0.45)',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
