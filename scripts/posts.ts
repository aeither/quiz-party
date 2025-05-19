import { AnyPost, Post as LensPost, Repost as LensRepost, mainnet, postId, PostReferenceType, PublicClient } from "@lens-protocol/client";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";

export const client = PublicClient.create({
  environment: mainnet,
});

// Bonsai app address
const LENS_BONSAI_APP = "0x640c9184b31467C84096EB2829309756DDbB3f44";

// Helper to extract Smart Media info
function getSmartMediaLight(post: any) {
  // Use root if present
  const attributes = post.root ? post.root.metadata?.attributes : post.metadata?.attributes;
  const isSmartMedia = post.app?.address === LENS_BONSAI_APP && attributes?.some((attr: any) => attr.key === 'template');
  if (!isSmartMedia) return null;
  const template = attributes?.find((attr: any) => attr.key === "template");
  const category = attributes?.find((attr: any) => attr.key === "templateCategory");
  const mediaUrl = attributes?.find((attr: any) => attr.key === "apiUrl");
  const isCanvas = attributes?.find((attr: any) => attr.key === "isCanvas");
  return {
    ...(template && {
      template: {
        id: template.value,
        formatted: template.value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())
      }
    }),
    ...(category && {
      category: {
        id: category.value,
        formatted: category.value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())
      }
    }),
    mediaUrl: mediaUrl?.value,
    isCanvas: !!isCanvas?.value
  };
}

function isLensPost(post: AnyPost): post is LensPost {
  return post.__typename === 'Post';
}
function isLensRepost(post: AnyPost): post is LensRepost {
  return post.__typename === 'Repost';
}

// Helper to fetch comments for a post
async function fetchCommentsForPost(postIdValue: string) {
  const result = await fetchPostReferences(client, {
    referencedPost: postId(postIdValue),
    referenceTypes: [PostReferenceType.CommentOn],
  });

  if (result.isErr()) {
    console.error("Error fetching comments:", result.error);
    return [];
  }
  return result.value.items;
}

async function fetchPosts(authorAddress: string) {
  const result = await fetchPost(client, {
    post: postId("2zg0xn118re86jsjhjq"),
  });

  if (result.isErr()) {
    console.error("Error fetching posts:", result.error);
    return [];
  }
  const post = result.value!;

  // Smart Media detection
  const smartMedia = getSmartMediaLight(post);
  const isSmartMedia = !!smartMedia;

  // Handle both Post and Repost
  let metadata, stats;
  if (isLensPost(post)) {
    metadata = post.metadata;
    stats = post.stats;
  } else if (isLensRepost(post)) {
    // Use bracket notation to access 'root' to avoid TS property errors
    const repost = post as any;
    const root = repost['root'];
    if (root && root.__typename === 'Post') {
      metadata = root.metadata;
      stats = root.stats;
    } else {
      metadata = undefined;
      stats = undefined;
    }
  } else {
    metadata = undefined;
    stats = undefined;
  }

  const formattedPost = {
    id: post.id,
    slug: post.slug,
    content: metadata?.content || "",
    image: metadata?.image?.item || null,
    createdAt: post.timestamp,
    stats: stats,
    author: post.author?.metadata?.name || post.author?.username?.localName || "",
    authorHandle: post.author?.username?.localName || "",
    authorAvatar: post.author?.metadata?.picture || null,
    isSmartMedia,
    ...(isSmartMedia && { smartMedia }),
  };

  console.log("🚀 ~ fetchPosts ~ formattedPost:", formattedPost);

  // Fetch and log comments
  const comments = await fetchCommentsForPost(post.id);
  console.log("💬 Comments for post:", comments);

  return formattedPost;
}

// Example usage
const authorAddress = "0x1234..."; // Replace with actual EVM address
fetchPosts(authorAddress).then(post => {
  // console.log("Fetched post:", post);
});
