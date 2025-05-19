import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchPostAndComments } from '../lib/lensApi';

const POST_IDS = [
  '3nscjarhr9ewvjdwk7y',
  '3hcfsqhf0x3x7sg7m0s',
  '1dy7kvpqjmd2rzkp9fz',
];

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(POST_IDS.map(id => fetchPostAndComments(id).then(res => ({ ...res.post, id }))))
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-orange-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">Welcome to Quiz Party!</h1>
        <p className="text-lg text-gray-700 mb-6">Test your knowledge and join the fun. Choose a quiz to get started:</p>
        {loading ? (
          <div className="text-lg text-purple-500 font-bold animate-pulse">Loading quizzes...</div>
        ) : (
          <div className="w-full max-w-3xl overflow-x-auto">
            <div className="flex gap-6 py-2 px-1" style={{ minWidth: 700 }}>
              {posts.concat(posts).map((post, idx) => (
                <motion.div
                  key={post.id + '-' + idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, rotate: -2 + Math.random() * 4 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="min-w-[320px] max-w-xs bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-lg p-5 flex flex-col items-center border-2 border-purple-200 relative"
                >
                  {post.image && (
                    <img src={post.image} alt="quiz" className="w-32 h-32 rounded-xl object-cover mb-3 border-4 border-pink-200 shadow" />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <img src={post.authorAvatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-purple-700">{post.author}</span>
                    <span className="text-xs text-gray-500">@{post.authorHandle}</span>
                  </div>
                  <div className="text-lg font-semibold text-purple-900 mb-1 line-clamp-2 text-center">{post.content || 'Quiz'}</div>
                  <div className="flex gap-3 text-sm text-gray-500 mb-3">
                    <span>💖 {post.stats?.reactions || 0}</span>
                    <span>💬 {post.stats?.comments || 0}</span>
                    <span>🔄 {post.stats?.reposts || 0}</span>
                  </div>
                  <Link to="/quiz/$postId" params={{ postId: post.id }} className="w-full">
                    <button className="w-full px-4 py-2 rounded-full font-bold bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow hover:scale-105 active:scale-95 transition-all duration-200 mt-auto">
                      Start Quiz
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
