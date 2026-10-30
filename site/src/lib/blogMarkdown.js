export function unescapeMarkdown(text) {
  return text.replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1");
}

export function resolveBlogImage(src) {
  const normalized = unescapeMarkdown(src);
  if (normalized.startsWith("blog/")) {
    return `${import.meta.env.BASE_URL}${normalized}`;
  }
  const sourcePrefix = "图片和附件/";
  if (normalized.startsWith(sourcePrefix)) {
    return `${import.meta.env.BASE_URL}blog/rsi-guide/${normalized.slice(sourcePrefix.length)}`;
  }
  return normalized;
}

// The cover shown in post lists: a small image set on the post, else the first figure in its Markdown.
export function blogCover(post) {
  const src = post.cover ?? post.markdown?.match(/^!\[[^\]]*\]\(([^)]+)\)$/m)?.[1];
  return src ? resolveBlogImage(src) : null;
}
