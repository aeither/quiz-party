import { createFileRoute, useParams } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import AIHostAvatar from '../components/AIHostAvatar';
import ChatBox from '../components/ChatBox';
import LeaderboardCard from '../components/LeaderboardCard';
import QuestionCard from '../components/QuestionCard';
import QuizHeader from '../components/QuizHeader';
import { mockQuestions, mockTournament } from '../data/mockData';
import { fetchPostAndComments } from '../lib/lensApi';
import { Message, Player, Question } from '../types/quiz';

export const Route = createFileRoute('/quiz/$postId')({
  component: QuizPartyHomePage,
});

function QuizPartyHomePage() {
  const { postId } = useParams({ from: '/quiz/$postId' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [players, setPlayers] = useState<Player[]>(mockTournament.players);
  const [messages, setMessages] = useState<Message[]>(mockTournament.messages);
  const [tournament, setTournament] = useState(mockTournament);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState("Welcome to the Knowledge Tournament!");
  const [username, setUsername] = useState("Guest" + Math.floor(Math.random() * 1000));

  // Real post/comments state
  const [realPost, setRealPost] = useState<any | null>(null);
  const [realComments, setRealComments] = useState<Message[]>([]);
  const [loadingReal, setLoadingReal] = useState(true);
  const [realError, setRealError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real post and comments
    if (!postId) return;
    setLoadingReal(true);
    fetchPostAndComments(postId)
      .then(({ post, comments }) => {
        setRealPost(post);
        setRealComments(comments.map((c: any) => ({
          id: c.id,
          user: c.user,
          content: c.content,
          timestamp: c.timestamp,
          avatar: c.avatar,
          likes: c.likes,
        })));
        setLoadingReal(false);
      })
      .catch((err) => {
        setRealError('Failed to load real post/comments');
        setLoadingReal(false);
      });
  }, [postId]);

  useEffect(() => {
    // Simulate a timer for question advancement
    const timer = setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setAiThinking(true);
        setAiMessage("Preparing the next question...");
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAiThinking(false);
          setAiMessage(`Question ${currentQuestionIndex + 2} is ready!`);
          // Add AI message about new question
          const newMessage: Message = {
            id: `ai-q-${Date.now()}`,
            user: 'QuizBot',
            content: questions[currentQuestionIndex + 1].text,
            timestamp: new Date(),
            isAIHost: true
          };
          setMessages(prev => [...prev, newMessage]);
        }, 3000);
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions]);

  const handleAnswerSubmit = (answer: string, isCorrect: boolean) => {
    // Add the user's answer to the chat
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      user: username,
      content: answer,
      timestamp: new Date(),
      isCorrect
    };
    setMessages(prev => [...prev, newMessage]);
    // Update player score if correct
    if (isCorrect) {
      const pointsEarned = questions[currentQuestionIndex].difficulty === 'easy' ? 50 : 
                          questions[currentQuestionIndex].difficulty === 'medium' ? 100 : 150;
      // Check if player already exists
      const existingPlayerIndex = players.findIndex(p => p.name === username);
      if (existingPlayerIndex >= 0) {
        const updatedPlayers = [...players];
        updatedPlayers[existingPlayerIndex].score += pointsEarned;
        setPlayers(updatedPlayers);
      } else {
        // Add new player
        const newPlayer: Player = {
          id: `player-${Date.now()}`,
          name: username,
          score: pointsEarned,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`
        };
        setPlayers(prev => [...prev, newPlayer]);
      }
      // Show toast for points earned
      toast(`Correct Answer!, You earned ${pointsEarned} points`);
      // Add AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          user: 'QuizBot',
          content: `That's correct, ${username}! You earned ${pointsEarned} points.`,
          timestamp: new Date(),
          isAIHost: true
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    } else {
      // Add AI response for incorrect answer
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          user: 'QuizBot',
          content: `Sorry ${username}, that's not quite right. The correct answer is ${questions[currentQuestionIndex].correctAnswer}.`,
          timestamp: new Date(),
          isAIHost: true
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleSendMessage = (message: string) => {
    // Add user chat message
    const newMessage: Message = {
      id: `chat-${Date.now()}`,
      user: username,
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    // Check if the message is a correct answer to the current question
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer.toLowerCase() === message.toLowerCase();
    if (isCorrect) {
      handleAnswerSubmit(message, true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen quiz-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Post Card with real data */}
        {loadingReal ? (
          <div className="mb-6">Loading post...</div>
        ) : realPost && (
          <div className="flex items-center gap-4 mb-6 bg-white rounded-xl shadow p-4">
            {realPost.image && (
              <img src={realPost.image} alt="post" className="w-20 h-20 rounded-lg object-cover" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <img src={realPost.authorAvatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
                <span className="font-bold">{realPost.author}</span>
                <span className="text-xs text-gray-500">@{realPost.authorHandle}</span>
              </div>
              <div className="mt-1">{realPost.content}</div>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span>💖 {realPost.stats?.reactions || 0}</span>
                <span>💬 {realPost.stats?.comments || 0}</span>
                <span>🔄 {realPost.stats?.reposts || 0}</span>
              </div>
            </div>
          </div>
        )}

        <QuizHeader 
          tournamentName={tournament.name}
          currentRound={tournament.currentRound}
          totalRounds={tournament.totalRounds}
          timeRemaining="03:45"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AIHostAvatar message={aiMessage} isThinking={aiThinking} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <QuestionCard
                  question={currentQuestion.text}
                  options={currentQuestion.options}
                  correctAnswer={currentQuestion.correctAnswer}
                  onAnswer={handleAnswerSubmit}
                  timeLimit={currentQuestion.timeLimit}
                />
              </motion.div>
            </AnimatePresence>
            <div className="mt-6">
              <LeaderboardCard players={players} />
            </div>
          </div>
          <div className="lg:col-span-1 h-[600px]">
            <ChatBox 
              messages={realComments.length > 0 ? realComments : messages}
              onSendMessage={handleSendMessage}
              currentQuestion={currentQuestion.text}
            />
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Connect your wallet to receive on-chain rewards for your participation!</p>
        </div>
      </div>
    </div>
  );
} 