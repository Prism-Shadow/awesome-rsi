import { useEffect, useState } from "react";
import { blogPosts } from "../data/blogPosts.js";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
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

function BlogIndex({ onOpenPost }) {
  return (
    <section className="blog-index" aria-label="Blog posts">
      <div className="blog-post-list">
        {blogPosts.map((post) => (
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
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </span>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <span className="blog-post-tags" aria-label="Post tags">
              {post.tags.map((tag) => <code key={tag}>{tag}</code>)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function BlogArticle({ post, onBack }) {
  return (
    <article className="blog-article" aria-labelledby="blog-article-title">
      <button className="blog-back-link" type="button" onClick={onBack}>← Back to blog</button>
      <div className="blog-article-meta">
        <span>{post.kind}</span>
        <time dateTime={post.published}>{formatDate(post.published)}</time>
      </div>
      <h2 id="blog-article-title">{post.title}</h2>
      <p className="blog-article-lead">{post.summary}</p>

      <section className="blog-article-body" aria-labelledby="release-highlights-title">
        <h3 id="release-highlights-title">What’s included</h3>
        <ul>
          {post.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      </section>
    </article>
  );
}

export default function BlogTab() {
  const [activePostId, setActivePostId] = useState(postIdFromHash);

  useEffect(() => {
    const handleHashChange = () => setActivePostId(postIdFromHash());
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const activePost = blogPosts.find((post) => post.id === activePostId);
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
    ? <BlogArticle post={activePost} onBack={closePost} />
    : <BlogIndex onOpenPost={openPost} />;
}
