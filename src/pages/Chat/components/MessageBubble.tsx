import { ChatMessage } from '@/types/chat';
import { StyleSheet, Text, View } from 'react-native';
import { getBubbleWidth } from '../utils/chatLayout';

interface MessageBubbleProps {
  item: ChatMessage;
  isMe: boolean;
  listWidth: number;
}

export function MessageBubble({ item, isMe, listWidth }: MessageBubbleProps) {
  const bubbleWidth = getBubbleWidth(item.text ?? '', listWidth);
  return (
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
        style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}
      >
        {item.text}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}>
          {item.createdAt}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
