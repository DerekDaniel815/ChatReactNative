import { getSocket } from '@/services/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, updateChatPreview } from '@/store/chat/chatSlice';
import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { dmRoom, getDifferentValue } from '@/pages/Chat/hooks/useChatSocket';

export function useGlobalChatSocket(accessToken: string) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(s => s.auth);
  const rooms = useAppSelector(s =>
    s.chat.itemsChats.map(c => {
      if (c.isGlobal) return 'global';
      if (!user?.id) return 'global';
      return dmRoom(user.id, c.id);
    }),
  );
  const seenIdsRef = useRef(new Set<string>());
  const socket = getSocket(accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const onConnect = () => {
      // join global
      socket.emit('join', { room: 'global' });

      // join DMs
      rooms.forEach(room => socket.emit('join', { room }));
    };

    const onMessage = (msg: ChatMessage) => {
      const dedupeId = msg.clientId ?? msg.id;
      if (seenIdsRef.current.has(dedupeId)) return;
      seenIdsRef.current.add(dedupeId);
      const chatId = getDifferentValue(msg.room, user?.id ?? '');

      dispatch(addMessage({ roomKey: msg.room, message: msg }));
      dispatch(
        updateChatPreview({
          chatId: chatId, //id del usuario del chat o global
          text: msg.text,
          createdAt: msg.createdAt,
        }),
      );
    };

    socket.on('connect', onConnect);
    socket.on('message', onMessage);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('message', onMessage);
    };
  }, [accessToken, rooms, socket, dispatch, user?.id]);
}
