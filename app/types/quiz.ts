export interface Player {
  id: string;
  name: string;
  score: number;
  avatar?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number; // in seconds
}

export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  isCorrect?: boolean;
  isAIHost?: boolean;
  avatar?: string;
  replies?: Message[]; // For nested comments/replies
  parentId?: string;   // Reference to parent comment for replies
  likes?: number;      // Track likes on comments
}

export interface Tournament {
  id: string;
  name: string;
  currentRound: number;
  totalRounds: number;
  players: Player[];
  questions: Question[];
  messages: Message[];
} 