import React, { useEffect, useState } from 'react';

interface QuizHeaderProps {
  currentRound: number;
  totalRounds: number;
  timeRemaining: number; // in seconds
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ currentRound, totalRounds, timeRemaining }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeRemaining);

  useEffect(() => {
    setSecondsLeft(timeRemaining);
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">Round {currentRound} of {totalRounds}</p>
      </div>
      <div className="text-right">
        <span className="font-mono text-base bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">{formatTime(secondsLeft)}</span>
      </div>
    </div>
  );
};

export default QuizHeader; 