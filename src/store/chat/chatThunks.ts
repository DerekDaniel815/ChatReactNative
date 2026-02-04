import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { formatChatDate } from '@/utils/formatChatDate';
import { ChatMessage } from '@/types/chat';

type UserDto = {
  id: string;
  username: string;
  email?: string;
};

type OtherUserDto = {
  id: string;
  username: string;
} | null;

type ConversationDto = {
  id: string;
  roomKey: string;
  type: string;
  title: string;
  otherUser: OtherUserDto;
  lastMessage: any;
  createdAt: string;
};

export type ChatItem = {
  id: string; //id del user o 'global'
  title: string;
  subtitle: string;
  lastTime: string;
  unread?: number;
  isGlobal?: boolean;
};

export type MessageDto = {
  id: string;
  senderId: string;
  name: string;
  roomKey: string;
  clientId?: string;
  text: string;
  createdAt: string; // viene como timestamp ms
};

export const fetchChatListThunk = createAsyncThunk<
  ChatItem[],
  void,
  { rejectValue: string }
>('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<ConversationDto[]>('/chat/conversations');

    // Map users -> ChatItem (mock de preview)
    const items: ChatItem[] = res.data.map(u => ({
      id: u.otherUser?.id ?? 'global', // importante: esto te sirve como “conversationId” por ahora
      title: u.title,
      subtitle: u.lastMessage?.content ?? '', // placeholder hasta que haya mensajes reales
      lastTime: formatChatDate(u.lastMessage?.createdAt ?? ''), // placeholder; o '—'
      unread: 0,
      ...{ isGlobal: u.type === 'GLOBAL' },
    }));

    return items;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? 'Error cargando chats';
    return rejectWithValue(msg);
  }
});

export const fetchUserSuggestionsListThunk = createAsyncThunk<
  ChatItem[],
  void,
  { rejectValue: string }
>('chat/fetchUserSuggestions', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<UserDto[]>('/users');

    // Map users -> ChatItem (mock de preview)
    const items: ChatItem[] = res.data.map(u => ({
      id: u.id, // importante: esto te sirve como “conversationId” por ahora
      title: u.username,
      subtitle: 'Toca para chatear',
      lastTime: '',
      unread: 0,
    }));

    return items;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? 'Error cargando chats';
    return rejectWithValue(msg);
  }
});

export const fetchMessagesByRoomKeyThunk = createAsyncThunk<
  ChatMessage[],
  { roomKey: string },
  { rejectValue: string }
>('chat/fetchMessagesByRoom', async ({ roomKey }, { rejectWithValue }) => {
  try {
    const res = await api.get<MessageDto[]>('/chat/messages', {
      params: { roomKey },
    });
    const items: ChatMessage[] = res.data.map(m => ({
      id: m.id,
      senderId: m.senderId,
      name: m.name,
      room: m.roomKey,
      text: m.text,
      clientId: m.clientId,
      createdAt: m.createdAt,
    }));
    return items;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? 'Error cargando mensajes';
    return rejectWithValue(msg);
  }
});
