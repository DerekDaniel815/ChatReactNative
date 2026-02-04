import { getSocket } from '@/services/socket';

export function useChatSocket(
  chatId: string,
  room: string,
  accessToken: string,
) {
  const socket = getSocket(accessToken);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;

    const clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    socket.emit('message', { room, text: t, clientId });
  };

  return { send };
}

export function dmRoom(a: string, b: string) {
  const [x, y] = [a, b].sort();
  return `dm:${x}|${y}`;
}

export function getDifferentValue(
  room: string,
  compareWith: string,
): string {
  const clean = room.replace(/^dm:/, '');
  const parts = clean.split('|');

  if (parts.length !== 2) return 'global';

  const [a, b] = parts;

  if (a === compareWith) return b;
  if (b === compareWith) return a;

  return 'global';
}
