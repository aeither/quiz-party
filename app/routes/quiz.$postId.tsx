import { useTRPC } from '@/trpc/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { useAccount } from 'wagmi';
import ChatBox from '../components/ChatBox';
import LeaderboardCard from '../components/LeaderboardCard';
import { PaymentButton } from '../components/PaymentButton';
import QuestionCard from '../components/QuestionCard';
import QuizHeader from '../components/QuizHeader';
import { mockTournament } from '../data/mockData';
import { fetchPostAndComments } from '../lib/lensApi';
import { Message, Player, Question } from '../types/quiz';

export const Route = createFileRoute('/quiz/$postId')({
  component: QuizPartyHomePage,
});

function QuizPartyHomePage() {
  const { postId } = useParams({ from: '/quiz/$postId' });
  const { address } = useAccount();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [players, setPlayers] = useState<Player[]>(mockTournament.players);
  const [messages, setMessages] = useState<Message[]>(mockTournament.messages);
  const [tournament, setTournament] = useState(mockTournament);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState("Welcome to the Knowledge Tournament!");
  const [username, setUsername] = useState("Guest" + Math.floor(Math.random() * 1000));
  const trpc = useTRPC();
  
  // Real post/comments state
  const [realPost, setRealPost] = useState<any | null>(null);
  const [realComments, setRealComments] = useState<Message[]>([]);
  const [loadingReal, setLoadingReal] = useState(true);
  const [realError, setRealError] = useState<string | null>(null);

  // Quiz generation state
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Use React Query's useMutation with trpc mutationOptions
  const generateQuizMutation = useMutation(
    trpc.ai.generateQuizFromPost.mutationOptions({
      onSuccess: (result) => {
        // Transform the AI-generated questions into our Question format
        const formattedQuestions = result.questions.map((q: { question: string; options: string[]; answer: string; explanation: string }, index: number) => ({
          id: `q-${index}`,
          text: q.question,
          options: q.options,
          correctAnswer: q.answer,
          explanation: q.explanation,
          timeLimit: 45,
          difficulty: 'medium' as const,
          category: '', // required by Question type
        }));
        setQuestions(formattedQuestions);
        toast.success('Quiz generated successfully!');
      },
      onError: (error) => {
        console.error('Failed to generate quiz:', error);
        toast.error('Failed to generate quiz. Please try again.');
      },
      onSettled: () => {
        setIsGeneratingQuiz(false);
      }
    })
  );

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

  // Handle payment confirmation and generate quiz
  const handlePaymentConfirmed = async (txHash: string) => {
    if (!address || !postId) return;
    setIsGeneratingQuiz(true);
    generateQuizMutation.mutate({
      postId,
      userAddress: address,
    });
  };

  useEffect(() => {
    // Simulate a timer for question advancement
    if (questions.length === 0) return; // Don't start timer if no questions
    
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
      toast(`Correct Answer! You earned ${pointsEarned} points`);
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
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = currentQuestion.correctAnswer.toLowerCase() === message.toLowerCase();
      if (isCorrect) {
        handleAnswerSubmit(message, true);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const showPaymentButton = !isGeneratingQuiz && questions.length === 0 && !loadingReal && realPost;

  return (
    <div className="min-h-screen quiz-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizHeader 
          currentRound={tournament.currentRound}
          totalRounds={tournament.totalRounds}
          timeRemaining={225}
        />
        
        {/* Quiz Card as hero */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 rounded-3xl shadow-2xl border-4 border-purple-300 p-6 flex flex-col items-center"
          >
            {loadingReal ? (
              <div className="text-lg text-white font-bold animate-pulse">Loading quiz...</div>
            ) : realPost && (
              <>
                {realPost.image && (
                  <img src={realPost.image} alt="quiz" className="w-32 h-32 rounded-xl object-cover mb-3 border-4 border-white shadow" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <img src={realPost.authorAvatar || '/default-avatar.png'} className="w-8 h-8 rounded-full border-2 border-white" />
                  <span className="font-bold text-white drop-shadow">{realPost.author}</span>
                  <span className="text-xs text-white/80">@{realPost.authorHandle}</span>
                </div>
                <div className="text-xl font-semibold text-white mb-1 text-center drop-shadow line-clamp-2">{realPost.content || 'Quiz'}</div>
                <div className="flex gap-4 text-base text-white/90 mb-2">
                  <span>💖 {realPost.stats?.reactions || 0}</span>
                  <span>💬 {realPost.stats?.comments || 0}</span>
                  <span>🔄 {realPost.stats?.reposts || 0}</span>
                </div>
                {showPaymentButton && (
                  <div className="w-full max-w-sm mt-4">
                    <PaymentButton onPaymentConfirmed={handlePaymentConfirmed} />
                  </div>
                )}
                {isGeneratingQuiz && (
                  <div className="mt-4 text-white font-medium animate-pulse">
                    Generating quiz questions...
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {questions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
                messages={realComments}
                onSendMessage={handleSendMessage}
                currentQuestion={currentQuestion?.text}
              />
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Connect your wallet to receive on-chain rewards for your participation!</p>
        </div>
      </div>
    </div>
  );
} 