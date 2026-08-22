import { useEffect, useState } from "react";
import { blogPosts } from "../data/blogPosts.js";
import { blogPostsZh } from "../data/blogPosts.zh.js";
import { blogCopy } from "../i18n.js";

function formatDate(value, lang) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function postIdFromHash() {
  const match = window.location.hash.match(/^#blog\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Minimal inline markup so post text stays plain-string and easy to hand-edit:
// [label](url) becomes a link, **text** becomes bold. Everything else is literal.
function renderInline(text) {
  const nodes = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      const external = /^https?:\/\//.test(match[2]);
      nodes.push(
        <a
          key={key++}
          href={match[2]}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<strong key={key++}>{match[3]}</strong>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function ArticleBlock({ block }) {
  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List>
        {block.items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </List>
    );
  }
  if (block.type === "footnote") {
    return <p className="blog-footnote">{renderInline(block.text)}</p>;
  }
  return <p>{renderInline(block.text)}</p>;
}

function BlogIndex({ onOpenPost, posts, lang, copy }) {
  return (
    <section className="blog-index" aria-label={copy.posts}>
      <div className="blog-post-list">
        {posts.map((post) => (
          <a
            className="blog-post-card"
            href={`#blog/${encodeURIComponent(post.id)}`}
            key={post.id}
            onClick={(event) => {
              event.preventDefault();
              onOpenPost(post.id);
            }}
          >
            <span className="blog-post-meta">
              <span>{post.kind}</span>
              <time dateTime={post.published}>{formatDate(post.published, lang)}</time>
            </span>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <span className="blog-post-tags" aria-label={copy.tags}>
              {post.tags.map((tag) => <code key={tag}>{tag}</code>)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function BlogArticle({ post, onBack, lang, copy }) {
  return (
    <article className="blog-article" aria-labelledby="blog-article-title">
      <button className="blog-back-link" type="button" onClick={onBack}>{copy.back}</button>
      <div className="blog-article-meta">
        <span>{post.kind}</span>
        <time dateTime={post.published}>{formatDate(post.published, lang)}</time>
      </div>
      <h2 id="blog-article-title">{post.title}</h2>
      <p className="blog-article-lead">{post.summary}</p>

      {post.sections
        ? post.sections.map((section, index) => (
            <section className="blog-article-body" key={section.heading ?? index}>
              {section.heading ? <h3>{section.heading}</h3> : null}
              {section.blocks.map((block, blockIndex) => (
                <ArticleBlock block={block} key={blockIndex} />
              ))}
            </section>
          ))
        : (
          <section className="blog-article-body" aria-labelledby="release-highlights-title">
            <h3 id="release-highlights-title">{copy.included}</h3>
            <ul>
              {post.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </section>
        )}
    </article>
  );
}

export default function BlogTab({ lang }) {
  const [activePostId, setActivePostId] = useState(postIdFromHash);
  const posts = lang === "zh" ? blogPostsZh : blogPosts;
  const copy = blogCopy[lang];

  useEffect(() => {
    const handleHashChange = () => setActivePostId(postIdFromHash());
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const activePost = posts.find((post) => post.id === activePostId);
  const openPost = (postId) => {
    window.history.pushState(null, "", `#blog/${encodeURIComponent(postId)}`);
    setActivePostId(postId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closePost = () => {
    window.history.pushState(null, "", "#blog");
    setActivePostId(null);
  };

  return activePost
    ? <BlogArticle post={activePost} onBack={closePost} lang={lang} copy={copy} />
    : <BlogIndex onOpenPost={openPost} posts={posts} lang={lang} copy={copy} />;
}
