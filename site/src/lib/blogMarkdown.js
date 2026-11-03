export function unescapeMarkdown(text) {
  return text.replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1");
}

// Post images live under public/blog/; other sources are full URLs.
export function resolveBlogImage(src) {
  const normalized = unescapeMarkdown(src);
  return normalized.startsWith("blog/") ? `${import.meta.env.BASE_URL}${normalized}` : normalized;
}

// The small image shown in post lists, if the post sets one.
export function blogCover(post) {
  return post.cover ? resolveBlogImage(post.cover) : null;
}
