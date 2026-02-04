import { ChatStackParamList } from '@/navigation/AppNavigator';
import { ChatItem, fetchUserSuggestionsListThunk } from '@/store/chat/chatThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = NativeStackScreenProps<ChatStackParamList, 'ListSuggestions'>;

export function ListSuggestions({ navigation }: Props) {
  const { user } = useAppSelector(s => s.auth);
  const { itemsUsers, usersStatus } = useAppSelector(s => s.chat);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUserSuggestionsListThunk());
    }
  }, [dispatch, usersStatus]);

  const chatsForUI = [...itemsUsers];

  const goChat = (item: ChatItem) => {
    navigation.navigate('Chat', { name: item.title, conversationId: item.id });
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Contactos Sugeridos</Text>
            <Text style={styles.subtitle}>
              {user ? `Conectado como ${user.username}` : 'No autenticado'}
            </Text>
          </View>
        </View>

        {/* Lista */}
        <FlatList
          data={chatsForUI}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => goChat(item)}
              style={[styles.card, item.isGlobal && styles.cardGlobal]}
            >
              <View style={styles.cardLeft}>
                <View
                  style={[styles.avatar, item.isGlobal && styles.avatarGlobal]}
                >
                  <Text style={styles.avatarText}>
                    {item.isGlobal ? 'G' : item.title.slice(0, 1).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.time}>{item.lastTime}</Text>
                {!!item.unread && item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0b0f' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  header: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#a7a7b3', marginTop: 4, fontSize: 13 },

  listContent: { paddingTop: 8, paddingBottom: 20 },

  separator: { height: 10 },

  card: {
    backgroundColor: '#14141b',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardGlobal: {
    borderWidth: 1,
    borderColor: '#2a2a36',
  },

  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#222230',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGlobal: { backgroundColor: '#2a2a36' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  cardText: { flex: 1 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cardSubtitle: { color: '#a7a7b3', marginTop: 2, fontSize: 13 },

  cardRight: { alignItems: 'flex-end', gap: 8, marginLeft: 10 },
  time: { color: '#a7a7b3', fontSize: 12 },

  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
