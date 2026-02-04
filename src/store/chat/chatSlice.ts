import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatItem,
  fetchChatListThunk,
  fetchMessagesByRoomKeyThunk,
  fetchUserSuggestionsListThunk,
} from './chatThunks';
import { ChatMessage } from '@/types/chat';

type ChatState = {
  itemsUsers: ChatItem[];
  itemsChats: ChatItem[];

  messagesByRoom: Record<string, ChatMessage[]>;
  loadedRooms: Record<string, boolean>;

  usersStatus: 'idle' | 'loading' | 'succeeded' | 'error';
  chatsStatus: 'idle' | 'loading' | 'succeeded' | 'error';
  messagesStatus: 'idle' | 'loading' | 'succeeded' | 'error';

  usersError: string | null;
  chatsError: string | null;
  messagesError: string | null;
};

const initialState: ChatState = {
  itemsUsers: [],
  itemsChats: [],

  messagesByRoom: {},
  loadedRooms: {},

  usersStatus: 'idle',
  chatsStatus: 'idle',
  messagesStatus: 'idle',

  usersError: null,
  chatsError: null,
  messagesError: null,
};
const MESSAGES_LIMIT = 30;

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateChatPreview: (
      state,
      action: PayloadAction<{
        chatId: string;
        text: string;
        createdAt: string;
      }>,
    ) => {
      const { chatId, text, createdAt } = action.payload;
      const idx = state.itemsChats.findIndex(c => c.id === chatId);
      if (idx === -1) return;

      const updated = {
        ...state.itemsChats[idx],
        subtitle: text,
        lastTime: createdAt,
      };

      // mover al top (como WhatsApp)
      state.itemsChats.splice(idx, 1);
      state.itemsChats.unshift(updated);
    },
    addMessage: (
      state,
      action: PayloadAction<{ roomKey: string; message: ChatMessage }>,
    ) => {
      const { roomKey, message } = action.payload;
      const current = state.messagesByRoom[roomKey] ?? [];

      // dedupe basico por id (evita duplicados si te llega por REST y socket)
      if (current.some(m => m.id === message.id)) return;

      const next = [message, ...current].slice(0, MESSAGES_LIMIT);
      state.messagesByRoom[roomKey] = next;
    },

    // Opcional: limpiar cache al logout (si tu logout resetea store, ignora)
    clearChatState: state => {
      state.messagesByRoom = {};
      state.loadedRooms = {};
      state.messagesStatus = 'idle';
      state.messagesError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserSuggestionsListThunk.pending, state => {
        state.usersStatus = 'loading';
        state.usersError = null;
      })
      .addCase(fetchUserSuggestionsListThunk.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.itemsUsers = action.payload;
      })
      .addCase(fetchUserSuggestionsListThunk.rejected, (state, action) => {
        state.usersStatus = 'error';
        state.usersError = action.payload ?? action.error.message ?? 'Error';
      })
      .addCase(fetchChatListThunk.pending, state => {
        state.chatsStatus = 'loading';
        state.chatsError = null;
      })
      .addCase(fetchChatListThunk.fulfilled, (state, action) => {
        state.chatsStatus = 'succeeded';
        state.itemsChats = action.payload;
      })
      .addCase(fetchChatListThunk.rejected, (state, action) => {
        state.chatsStatus = 'error';
        state.chatsError = action.payload ?? action.error.message ?? 'Error';
      })
      // messages by room
      .addCase(fetchMessagesByRoomKeyThunk.pending, state => {
        state.messagesStatus = 'loading';
        state.messagesError = null;
      })
      .addCase(fetchMessagesByRoomKeyThunk.fulfilled, (state, action) => {
        state.messagesStatus = 'succeeded';
        if (action.payload.length === 0) return;

        const room = action.payload[0].room;
        state.messagesByRoom[room] = action.payload.slice(0, MESSAGES_LIMIT);
        state.loadedRooms[room] = true;
      })
      .addCase(fetchMessagesByRoomKeyThunk.rejected, (state, action) => {
        state.messagesStatus = 'error';
        state.messagesError = action.payload ?? action.error.message ?? 'Error';
      });
  },
});
export const { updateChatPreview, addMessage, clearChatState } =
  chatSlice.actions;
export default chatSlice.reducer;
