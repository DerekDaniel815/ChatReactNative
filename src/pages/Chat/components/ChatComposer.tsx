import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChatComposerProps {
  send: (text: string) => void;
}

export function ChatComposer({ send }: ChatComposerProps) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;
  const sendMessage = () => {
    send(text);
    setText('');
  };
  return (
    <View style={[styles.composer]}>
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
        onPress={sendMessage}
        disabled={!canSend}
        activeOpacity={0.85}
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
      >
        <Text style={styles.sendText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
