import { io, Socket } from 'socket.io-client';

const URL =
  // emulador android:
  // 'http://10.0.2.2:3000'
  // celular físico (misma red): pon tu IP local, ejemplo:
  'http://192.168.18.41:3000';

let socket: Socket | null = null;
let lastToken: string | null = null;

export function getSocket(accessToken: string) {
  if (!socket) {
    socket = io(URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      timeout: 10000,
      auth: { token: accessToken },
    });
    lastToken = accessToken;
  } else {
    socket.auth = { token: accessToken };
  }

  // si cambió token, actualiza auth y reconecta
  if (accessToken && accessToken !== lastToken) {
    socket.auth = { token: accessToken };
    lastToken = accessToken;
    if (socket.connected) socket.disconnect();
    socket.connect();
  }

  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
