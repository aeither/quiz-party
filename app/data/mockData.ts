import { Message, Player, Question, Tournament } from '../types/quiz';

export const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Which blockchain was the first to implement smart contracts?',
    options: ['Bitcoin', 'Ethereum', 'Cardano', 'Solana'],
    correctAnswer: 'Ethereum',
    difficulty: 'easy',
    category: 'blockchain',
    timeLimit: 30
  },
  {
    id: '2',
    text: 'What consensus mechanism does Ethereum now use?',
    options: ['Proof of Work', 'Proof of Stake', 'Proof of Authority', 'Proof of History'],
    correctAnswer: 'Proof of Stake',
    difficulty: 'medium',
    category: 'blockchain',
    timeLimit: 25
  },
  {
    id: '3',
    text: 'What is the maximum supply of Bitcoin?',
    options: ['21 million', '18 million', '100 million', 'Unlimited'],
    correctAnswer: '21 million',
    difficulty: 'easy',
    category: 'cryptocurrency',
    timeLimit: 20
  },
  {
    id: '4',
    text: 'Which of these is NOT a layer 2 scaling solution?',
    options: ['Optimism', 'Arbitrum', 'Polygon', 'Cosmos'],
    correctAnswer: 'Cosmos',
    difficulty: 'hard',
    category: 'blockchain',
    timeLimit: 35
  },
  {
    id: '5',
    text: 'What programming language is commonly used for Ethereum smart contracts?',
    options: ['JavaScript', 'Python', 'Solidity', 'C++'],
    correctAnswer: 'Solidity',
    difficulty: 'medium',
    category: 'programming',
    timeLimit: 20
  },
];

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'CryptoWhiz',
    score: 450,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
  },
  {
    id: '2',
    name: 'BlockchainMaster',
    score: 380,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka'
  },
  {
    id: '3',
    name: 'TokenTrader',
    score: 320,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max'
  },
  {
    id: '4',
    name: 'SatoshiDisciple',
    score: 275,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John'
  },
  {
    id: '5',
    name: 'Web3Developer',
    score: 210,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane'
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    user: 'QuizBot',
    content: 'Welcome to the Blockchain Knowledge Tournament! First question coming up...',
    timestamp: new Date(Date.now() - 300000),
    isAIHost: true
  },
  {
    id: '2',
    user: 'QuizBot',
    content: 'Which blockchain was the first to implement smart contracts?',
    timestamp: new Date(Date.now() - 240000),
    isAIHost: true
  },
  {
    id: '3',
    user: 'CryptoWhiz',
    content: 'Ethereum',
    timestamp: new Date(Date.now() - 230000),
    isCorrect: true
  },
  {
    id: '4',
    user: 'BlockchainMaster',
    content: 'Ethereum!',
    timestamp: new Date(Date.now() - 225000),
    isCorrect: true
  },
  {
    id: '5',
    user: 'TokenTrader',
    content: 'Bitcoin',
    timestamp: new Date(Date.now() - 220000),
    isCorrect: false
  },
  {
    id: '6',
    user: 'QuizBot',
    content: 'That\'s right! Ethereum was the first blockchain to implement programmable smart contracts. Moving to the next question...',
    timestamp: new Date(Date.now() - 180000),
    isAIHost: true
  },
  {
    id: '7',
    user: 'SatoshiDisciple',
    content: 'I\'m ready for the next question!',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '8',
    user: 'QuizBot',
    content: 'What consensus mechanism does Ethereum now use?',
    timestamp: new Date(Date.now() - 60000),
    isAIHost: true
  },
  {
    id: '9',
    user: 'Web3Developer',
    content: 'Proof of Stake',
    timestamp: new Date(Date.now() - 30000),
    isCorrect: true
  },
];

export const mockTournament: Tournament = {
  id: '1',
  name: 'Blockchain Knowledge Tournament',
  currentRound: 3,
  totalRounds: 10,
  players: mockPlayers,
  questions: mockQuestions,
  messages: mockMessages
}; 