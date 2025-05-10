
export interface MessageUser {
  name: string;
  avatar?: string;
  initials: string;
}

export interface Message {
  id: string;
  user: MessageUser;
  content: string;
  time: string;
  likes: number;
  type: 'message' | 'encouragement';
}

export type MessageFilter = 'all' | 'messages' | 'encouragement';
