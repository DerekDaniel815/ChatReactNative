export type ChatMessage = {
  id: string;
  room: string;
  name: string;
  text: string;
  createdAt: string;
  clientId?: string;
  senderId: string;
};
