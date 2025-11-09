
export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

export type ChatSession = {
  id: string;
  title: string;
  lastMessageTimestamp: string;
  preview: string;
  messages: Message[];
};

export enum Tool {
  Screenwriter = 'Guionista',
  Planner = 'Plan',
  Ideas = 'Ideas',
  General = 'General',
}

export type Theme = 'light' | 'dark';