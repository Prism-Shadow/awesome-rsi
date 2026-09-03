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

function unescapeMarkdown(text) {
  return text.replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1");
}

// Minimal inline markup so post text stays plain-string and easy to hand-edit.
function renderInline(text, keyPrefix = "inline") {
  const normalized = unescapeMarkdown(text);
  const nodes = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = pattern.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(normalized.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      const external = /^https?:\/\//.test(match[2]);
      nodes.push(
        <a
          key={`${keyPrefix}-${key++}`}
          href={match[2]}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {renderInline(match[1], `${keyPrefix}-link-${key}`)}
        </a>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${key++}`}>{match[3]}</strong>);
    } else {
      nodes.push(<code key={`${keyPrefix}-${key++}`}>{match[4]}</code>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < normalized.length) {
    nodes.push(normalized.slice(lastIndex));
  }
  return nodes;
}

function isMarkdownBlockStart(line) {
  const value = line.trim();
  return /^#{1,6}\s+/.test(value)
    || /^!\[[^\]]*\]\([^)]+\)$/.test(value)
    || /^[-*]\s+/.test(value)
    || /^\d+\.\s+/.test(value)
    || /^\$[^$].*\$$/.test(value);
}

function headingId(text, index) {
  const slug = unescapeMarkdown(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return slug || `section-${index}`;
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      // The article card already renders the title, so omit the Markdown H1.
      if (heading[1].length > 1) {
        blocks.push({
          type: "heading",
          level: heading[1].length,
          text: heading[2],
          id: headingId(heading[2], blocks.length),
        });
      }
      index += 1;
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      blocks.push({ type: "image", alt: image[1], src: image[2] });
      index += 1;
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    if (orderedMatch || unorderedMatch) {
      const ordered = Boolean(orderedMatch);
      const items = [];
      while (index < lines.length) {
        const candidate = lines[index].trim();
        if (!candidate) {
          index += 1;
          continue;
        }
        const item = candidate.match(ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    if (/^\$[^$].*\$$/.test(line)) {
      blocks.push({ type: "equation", text: unescapeMarkdown(line) });
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isMarkdownBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

function resolveBlogImage(src) {
  const normalized = unescapeMarkdown(src);
  const sourcePrefix = "图片和附件/";
  if (normalized.startsWith(sourcePrefix)) {
    return `${import.meta.env.BASE_URL}blog/rsi-guide/${normalized.slice(sourcePrefix.length)}`;
  }
  return normalized;
}

function MarkdownArticle({ markdown, copy }) {
  const blocks = parseMarkdown(markdown);
  const contents = blocks.filter(
    (block) => block.type === "heading" && (block.level === 2 || block.level === 3),
  );

  return (
    <div className="blog-guide-layout">
      {contents.length > 1 ? (
        <nav className="blog-toc" aria-label={copy.contents}>
          <strong>{copy.contents}</strong>
          <ul>
            {contents.map((item) => (
              <li className={`blog-toc-item blog-toc-item--level-${item.level}`} key={item.id}>
                <button
                  type="button"
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                >
                  {renderInline(item.text)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <section className="blog-markdown">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            const Heading = block.level === 2 ? "h3" : "h4";
            return <Heading id={block.id} key={block.id}>{renderInline(block.text)}</Heading>;
          }
          if (block.type === "image") {
            const src = resolveBlogImage(block.src);
            return (
              <figure className="blog-figure" key={`${block.src}-${index}`}>
                <a href={src} target="_blank" rel="noreferrer">
                  <img src={src} alt={unescapeMarkdown(block.alt)} loading="lazy" decoding="async" />
                </a>
              </figure>
            );
          }
          if (block.type === "list") {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={`list-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>
                ))}
              </List>
            );
          }
          if (block.type === "equation") {
            return <div className="blog-equation" key={`equation-${index}`}>{block.text}</div>;
          }
          return <p key={`paragraph-${index}`}>{renderInline(block.text, `paragraph-${index}`)}</p>;
        })}
      </section>
    </div>
  );
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
    <article className={`blog-article${post.markdown ? " blog-article--guide" : ""}`} aria-labelledby="blog-article-title">
      <div className="blog-article-header">
        <button className="blog-back-link" type="button" onClick={onBack}>{copy.back}</button>
        <div className="blog-article-meta">
          <span>{post.kind}</span>
          <time dateTime={post.published}>{formatDate(post.published, lang)}</time>
        </div>
        <h2 id="blog-article-title">{post.title}</h2>
        <p className="blog-article-lead">{post.summary}</p>
      </div>

      {post.markdown
        ? <MarkdownArticle markdown={post.markdown} copy={copy} />
        : post.sections
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
