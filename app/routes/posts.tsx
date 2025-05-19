import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Bonsai API endpoints
const PROFILE_HANDLE = 'janus25';
const POST_SLUG = '2zg0xn118re86jsjhjq';
const PROFILE_POSTS_API = `https://app.onbons.ai/api/profile/${PROFILE_HANDLE}/posts`;
const SINGLE_POST_API = `https://app.onbons.ai/api/media/${POST_SLUG}`;
const SINGLE_POST_COMMENTS_API = `https://app.onbons.ai/api/media/${POST_SLUG}/comments`;

const statEmojis = {
  reactions: '💖',
  comments: '💬',
  reposts: '🔄',
};

export const Route = createFileRoute("/posts")({
  component: PostsPage,
});

export default function PostsPage() {
  const [view, setView] = useState<'profile' | 'single'>('profile');

  // Profile posts state
  const [profilePosts, setProfilePosts] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Single post state
  const [singlePost, setSinglePost] = useState<any | null>(null);
  const [singlePostLoading, setSinglePostLoading] = useState(false);
  const [singlePostError, setSinglePostError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // Fetch profile posts
  useEffect(() => {
    if (view !== 'profile') return;
    setProfileLoading(true);
    setProfileError(null);
    fetch(PROFILE_POSTS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile posts');
        return res.json();
      })
      .then(data => setProfilePosts(data.items || []))
      .catch(err => setProfileError(err.message))
      .finally(() => setProfileLoading(false));
  }, [view]);

  // Fetch single post and comments
  useEffect(() => {
    if (view !== 'single') return;
    setSinglePostLoading(true);
    setSinglePostError(null);
    fetch(SINGLE_POST_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch post');
        return res.json();
      })
      .then(data => setSinglePost(data))
      .catch(err => setSinglePostError(err.message))
      .finally(() => setSinglePostLoading(false));

    setCommentsLoading(true);
    setCommentsError(null);
    fetch(SINGLE_POST_COMMENTS_API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(data => setComments(data.items || []))
      .catch(err => setCommentsError(err.message))
      .finally(() => setCommentsLoading(false));
  }, [view]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-purple-200 to-orange-100 flex flex-col items-center py-8 px-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        className="mb-8 w-full max-w-2xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 drop-shadow-lg mb-2 flex items-center justify-center gap-2">
          <span role="img" aria-label="party">🎉</span> Bonsai Smart Media Playground <span role="img" aria-label="sparkles">✨</span>
        </h1>
        <p className="text-lg md:text-xl text-pink-600 font-semibold">Explore fun posts and comments!</p>
      </motion.div>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-full font-bold border-2 shadow-lg transition-all duration-200 text-lg flex items-center gap-2
            ${view === 'profile'
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white border-pink-400 scale-105'
              : 'bg-white text-purple-600 border-purple-300 hover:scale-105 active:scale-95'}`}
          style={{ boxShadow: view === 'profile' ? '0 4px 20px 0 #f472b6aa' : undefined }}
          onClick={() => setView('profile')}
        >
          <span role="img" aria-label="profile">🧑‍🎤</span> Profile Posts
        </button>
        <button
          className={`px-6 py-3 rounded-full font-bold border-2 shadow-lg transition-all duration-200 text-lg flex items-center gap-2
            ${view === 'single'
              ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white border-orange-400 scale-105'
              : 'bg-white text-orange-600 border-orange-300 hover:scale-105 active:scale-95'}`}
          style={{ boxShadow: view === 'single' ? '0 4px 20px 0 #fb7185aa' : undefined }}
          onClick={() => setView('single')}
        >
          <span role="img" aria-label="post">📝</span> Single Post
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-extrabold text-purple-700 mb-4 flex items-center gap-2">
                <span role="img" aria-label="profile">🧑‍🎤</span> Posts by <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full ml-1">{PROFILE_HANDLE}</span>
              </h2>
              {profileLoading && <div className="text-lg text-purple-500 font-bold animate-pulse">Loading posts...</div>}
              {profileError && <div className="text-red-500 font-bold">{profileError}</div>}
              <div className="space-y-6">
                {profilePosts.length === 0 && !profileLoading && !profileError && (
                  <div className="text-pink-500 font-bold">No posts found.</div>
                )}
                {profilePosts.map((post, idx) => (
                  <motion.div
                    key={post.postId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, type: 'spring', stiffness: 120 }}
                    className="border-4 border-purple-200 rounded-3xl p-5 bg-white shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={post.profile?.picture || '/default-avatar.png'}
                        alt={post.profile?.handle || 'avatar'}
                        className="w-14 h-14 rounded-full object-cover border-4 border-pink-200 shadow"
                      />
                      <div>
                        <div className="font-extrabold text-lg text-purple-700 flex items-center gap-1">
                          {post.profile?.displayName || post.profile?.handle}
                          <span className="ml-1 text-xs bg-pink-200 text-pink-700 px-2 py-0.5 rounded-full">@{post.profile?.handle}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="font-bold text-xl text-orange-500 flex items-center gap-2">
                        <span role="img" aria-label="template">📚</span> {post.template || 'Untitled'}
                      </div>
                      <div className="text-gray-700 text-base mt-1">{post.description || ''}</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{new Date(post.createdAt * 1000).toLocaleString()}</div>
                    <div className="mt-2 flex gap-4 text-lg font-bold">
                      <span className="flex items-center gap-1 text-pink-500">{statEmojis.reactions} {post.stats?.reactions || 0}</span>
                      <span className="flex items-center gap-1 text-purple-500">{statEmojis.comments} {post.stats?.comments || 0}</span>
                      <span className="flex items-center gap-1 text-orange-500">{statEmojis.reposts} {post.stats?.reposts || 0}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'single' && (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-extrabold text-orange-500 mb-4 flex items-center gap-2">
                <span role="img" aria-label="post">📝</span> Single Post
              </h2>
              {singlePostLoading && <div className="text-lg text-orange-500 font-bold animate-pulse">Loading post...</div>}
              {singlePostError && <div className="text-red-500 font-bold">{singlePostError}</div>}
              {singlePost && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  className="border-4 border-orange-200 rounded-3xl p-5 bg-white shadow-xl mb-8 relative overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={singlePost.profile?.picture || '/default-avatar.png'}
                      alt={singlePost.profile?.handle || 'avatar'}
                      className="w-14 h-14 rounded-full object-cover border-4 border-orange-200 shadow"
                    />
                    <div>
                      <div className="font-extrabold text-lg text-orange-500 flex items-center gap-1">
                        {singlePost.profile?.displayName || singlePost.profile?.handle}
                        <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">@{singlePost.profile?.handle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="font-bold text-xl text-purple-500 flex items-center gap-2">
                      <span role="img" aria-label="template">📚</span> {singlePost.template || 'Untitled'}
                    </div>
                    <div className="text-gray-700 text-base mt-1">{singlePost.description || ''}</div>
                    {singlePost.mediaUrl && (
                      <a href={singlePost.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-2">Media Link</a>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{new Date(singlePost.createdAt * 1000).toLocaleString()}</div>
                  <div className="mt-2 flex gap-4 text-lg font-bold">
                    <span className="flex items-center gap-1 text-pink-500">{statEmojis.reactions} {singlePost.stats?.reactions || 0}</span>
                    <span className="flex items-center gap-1 text-purple-500">{statEmojis.comments} {singlePost.stats?.comments || 0}</span>
                    <span className="flex items-center gap-1 text-orange-500">{statEmojis.reposts} {singlePost.stats?.reposts || 0}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">Category: {singlePost.category || 'N/A'}</span>
                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">Status: {singlePost.status || 'N/A'}</span>
                    <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">Featured: {singlePost.featured ? 'Yes' : 'No'}</span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Processing: {singlePost.isProcessing ? 'Yes' : 'No'}</span>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">Estimated Cost: {singlePost.estimatedCost || 'N/A'}</span>
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Version Count: {singlePost.versionCount || 0}</span>
                  </div>
                </motion.div>
              )}
              <h3 className="text-xl font-extrabold text-purple-500 mb-2 flex items-center gap-2">
                <span role="img" aria-label="comments">💬</span> Comments
              </h3>
              {commentsLoading && <div className="text-lg text-purple-500 font-bold animate-pulse">Loading comments...</div>}
              {commentsError && <div className="text-red-500 font-bold">{commentsError}</div>}
              <div className="space-y-6">
                {comments.length === 0 && !commentsLoading && !commentsError && (
                  <div className="text-pink-500 font-bold">No comments found.</div>
                )}
                {comments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04, type: 'spring', stiffness: 120 }}
                    className="border-4 border-purple-100 rounded-2xl p-4 bg-white shadow flex items-start gap-3"
                  >
                    <img
                      src={comment.profile?.picture || '/default-avatar.png'}
                      alt={comment.profile?.handle || 'avatar'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-pink-200 shadow"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-purple-600 flex items-center gap-1">
                        {comment.profile?.displayName || comment.profile?.handle}
                        <span className="ml-1 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">@{comment.profile?.handle}</span>
                        <span className="text-xs text-gray-400 ml-2">{new Date(comment.createdAt * 1000).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-700 text-base mt-1">{comment.content || ''}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 