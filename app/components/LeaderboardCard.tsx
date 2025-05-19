import { Medal, Star, Trophy } from 'lucide-react';
import React from 'react';

interface Player {
  id: string;
  name: string;
  score: number;
  avatar?: string;
}

interface LeaderboardCardProps {
  players: Player[];
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ players }) => {
  // Sort players by score (highest to lowest)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500 w-5 h-5" />;
      case 1:
        return <Medal className="text-gray-400 w-5 h-5" />;
      case 2:
        return <Medal className="text-amber-700 w-5 h-5" />;
      default:
        return <Star className="text-quiz-primary w-5 h-5" />;
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index < 3 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
            } transition-all hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                {getPositionIcon(index)}
              </div>
              <div className="flex items-center gap-2">
                {player.avatar ? (
                  <img 
                    src={player.avatar} 
                    alt={player.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-quiz-secondary text-white flex items-center justify-center font-bold text-xs">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{player.name}</span>
              </div>
            </div>
            <div className="font-bold text-lg text-quiz-primary">{player.score}</div>
          </div>
        ))}
        {sortedPlayers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No players yet</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardCard; 