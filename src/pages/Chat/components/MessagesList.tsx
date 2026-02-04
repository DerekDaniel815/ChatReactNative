import { ChatMessage } from '@/types/chat';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MessageBubble } from './MessageBubble';
interface MessagesListProps {
  messages: ChatMessage[];
  userId: string;
}

export function MessageList({ messages, userId }: MessagesListProps) {
  const [listWidth, setListWidth] = useState(0);
  return (
    <FlatList
      style={{ flex: 1 }}
      data={messages}
      inverted
      extraData={messages.length}
      removeClippedSubviews={false}
      keyboardShouldPersistTaps="handled"
      onLayout={e => setListWidth(e.nativeEvent.layout.width)}
      initialNumToRender={20}
      windowSize={10}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={[styles.listContent, { paddingBottom: 10 }]}
      renderItem={({ item }) => {
        const isMe = item.senderId === userId;
        return (
          <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
            <MessageBubble item={item} isMe={isMe} listWidth={listWidth} />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
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
});
