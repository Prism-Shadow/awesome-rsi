// Long-form posts are written in Markdown and loaded with Vite's ?raw suffix. They live apart from the
// post metadata in blogPosts.js, so the metadata can also be imported outside Vite (tests, the build).
import rsiDeepLearningEn from "./blog/rsi-deep-learning.en.md?raw";
import rsiGuideEn from "./blog/rsi-guide.en.md?raw";
import rsiDeepLearningZh from "./blog/rsi-deep-learning.zh.md?raw";
import rsiGuideZh from "./blog/rsi-guide.zh.md?raw";

export const blogMarkdown = {
  en: { "rsi-deep-learning": rsiDeepLearningEn, "understanding-rsi": rsiGuideEn },
  zh: { "rsi-deep-learning": rsiDeepLearningZh, "understanding-rsi": rsiGuideZh },
};
