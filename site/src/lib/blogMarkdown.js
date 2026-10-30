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
