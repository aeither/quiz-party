import { AnyPost, Post as LensPost, Repost as LensRepost, mainnet, postId, PostReferenceType, PublicClient } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";

export const client = PublicClient.create({ environment: mainnet });

function isLensPost(post: AnyPost): post is LensPost {
  return post.__typename === 'Post';
}
function isLensRepost(post: AnyPost): post is LensRepost {
  return post.__typename === 'Repost';
}

export async function fetchPostAndComments(postIdValue: string) {
  const result = await fetchPost(client, { post: postId(postIdValue) });
  if (result.isErr()) throw new Error(result.error.message);
  const post = result.value!;

  // Get metadata and stats
  let metadata, stats;
  if (isLensPost(post)) {
    metadata = post.metadata;
    stats = post.stats;
  } else if (isLensRepost(post)) {
    const root = (post as any)['root'];
    if (root && root.__typename === 'Post') {
      metadata = root.metadata;
      stats = root.stats;
    }
  }

  // Format post
  const formattedPost = {
    id: post.id,
    content: metadata?.content || "",
    image: metadata?.image?.item || null,
    createdAt: post.timestamp,
    stats: stats,
    author: post.author?.metadata?.name || post.author?.username?.localName || "",
    authorHandle: post.author?.username?.localName || "",
    authorAvatar: post.author?.metadata?.picture || null,
  };

  // Fetch comments
  const commentsResult = await fetchPostReferences(client, {
    referencedPost: postId(postIdValue),
    referenceTypes: [PostReferenceType.CommentOn],
  });
  const comments = commentsResult.isOk() ? commentsResult.value.items : [];

  // Format comments for ChatBox
  const formattedComments = comments.map((c: any) => ({
    id: c.id,
    user: c.author?.metadata?.name || c.author?.username?.localName || "",
    content: c.metadata?.content || "",
    timestamp: new Date(c.timestamp),
    avatar: c.author?.metadata?.picture || undefined,
    likes: c.stats?.upvotes || 0,
  }));

  return { post: formattedPost, comments: formattedComments };
} 