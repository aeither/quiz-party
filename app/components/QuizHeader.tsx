import React from 'react';

interface QuizHeaderProps {
  tournamentName: string;
  currentRound: number;
  totalRounds: number;
  timeRemaining: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ tournamentName, currentRound, totalRounds, timeRemaining }) => (
  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
    <div>
      <h2 className="text-lg font-bold">{tournamentName}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">Round {currentRound} of {totalRounds}</p>
    </div>
    <div className="text-right">
      <span className="font-mono text-base bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">{timeRemaining}</span>
    </div>
  </div>
);

export default QuizHeader; 