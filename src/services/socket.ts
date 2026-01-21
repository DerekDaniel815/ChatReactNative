import { io } from 'socket.io-client';

const URL =
  // emulador android:
  // 'http://10.0.2.2:3000'
  // celular físico (misma red): pon tu IP local, ejemplo:
  'http://192.168.18.41:3000';

export const socket = io(URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  timeout: 10000,
});
