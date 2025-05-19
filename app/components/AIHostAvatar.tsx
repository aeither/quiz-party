import React from 'react';

interface AIHostAvatarProps {
  message: string;
  isThinking?: boolean;
}

const AIHostAvatar: React.FC<AIHostAvatarProps> = ({ message, isThinking }) => (
  <div className="flex flex-col items-center">
    <div className="mb-2">
      <img
        src="https://api.dicebear.com/7.x/bottts/svg?seed=QuizBot"
        alt="QuizBot"
        className="w-20 h-20 rounded-full border-4 border-quiz-primary shadow-lg"
      />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow text-center min-w-[200px]">
      <span className="font-medium text-quiz-primary">QuizBot</span>
      <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">
        {isThinking ? <span className="italic">Thinking...</span> : message}
      </div>
    </div>
  </div>
);

export default AIHostAvatar; 