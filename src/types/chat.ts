export enum MessageSender {
  User = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: MessageSender;
}