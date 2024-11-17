export interface Chat {
  id?: string;
  members: string[];
  createdAt: number;
  type: 'private' | 'group';
  photoURL?: string;
  displayName?: string;
  lastMessage?: {
    content: string;
    timestamp: number
    senderId: string;
    id: string;
  }
}
