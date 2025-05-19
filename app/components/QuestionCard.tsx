import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  timeLimit?: number; // in seconds
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  correctAnswer,
  onAnswer,
  timeLimit
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit || null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (timeLimit && timeLeft !== null && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => {
        setTimeLeft(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswerSubmit(null);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isAnswered]);

  const handleAnswerSubmit = (answer: string | null) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer) {
      const isCorrect = answer === correctAnswer;
      onAnswer(answer, isCorrect);
    } else {
      // Time ran out
      onAnswer("", false);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) return "answer-button answer-button-normal";
    if (option === correctAnswer) {
      return "answer-button answer-button-correct";
    }
    if (option === selectedAnswer && selectedAnswer !== correctAnswer) {
      return "answer-button answer-button-incorrect";
    }
    return "answer-button answer-button-normal opacity-60";
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {timeLeft !== null && (
        <div className="mb-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-quiz-primary h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / (timeLimit || 1)) * 100}%` }}
          />
        </div>
      )}
      <h2 className="text-xl font-semibold mb-6 text-center">{question}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={getButtonClass(option)}
            onClick={() => handleAnswerSubmit(option)}
            disabled={isAnswered}
            whileHover={!isAnswered ? { scale: 1.03 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {isAnswered && (
        <motion.div 
          className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-medium text-center">
            {selectedAnswer === correctAnswer 
              ? "🎉 Correct! Well done!" 
              : `❌ Incorrect. The correct answer is: ${correctAnswer}`}
          </p>
          <div className="flex justify-center mt-4">
            <button 
              className="px-4 py-2 bg-quiz-primary text-white rounded-lg hover:bg-quiz-primary/90 transition-colors"
              onClick={() => {}}
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard; 