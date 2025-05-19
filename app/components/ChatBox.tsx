import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, MessageSquareReply } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  isCorrect?: boolean;
  isAIHost?: boolean;
  avatar?: string;
  likes?: number;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentQuestion?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, currentQuestion }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getMessageClass = (msg: Message) => {
    if (msg.isAIHost) {
      return "bg-quiz-primary text-white";
    }
    if (msg.isCorrect === true) {
      return "bg-quiz-correct text-white";
    }
    if (msg.isCorrect === false) {
      return "bg-quiz-incorrect text-white";
    }
    return "bg-gray-100 dark:bg-gray-700";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-lg font-bold">Comments</h2>
        <span className="text-sm text-gray-500 ml-2">({messages.length})</span>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in-up">
              <div className={`p-3 rounded-lg ${getMessageClass(msg)}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    {msg.avatar ? (
                      <AvatarImage src={msg.avatar} alt={msg.user} />
                    ) : (
                      <AvatarFallback className={`${msg.isAIHost ? 'bg-quiz-secondary' : 'bg-gray-300'} text-white`}>
                        {msg.isAIHost ? 'AI' : msg.user.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-medium ${msg.isAIHost ? 'text-white' : ''}`}>
                        {msg.user}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                    <p className="break-words mb-2">{msg.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <button className="flex items-center gap-1 opacity-70 hover:opacity-100">
                        <span>👍</span>
                        <span>{msg.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 opacity-70 hover:opacity-100">
                        <MessageSquareReply className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {currentQuestion && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
          <p className="text-sm font-medium">Current Question:</p>
          <p className="text-sm opacity-90">{currentQuestion}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-3 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-quiz-primary text-white px-4 py-2 rounded-lg hover:bg-quiz-primary/90"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox; 