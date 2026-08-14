import { books, courses } from "../data/resources.js";

function ResourceCard({ kind, title, by, description, url }) {
  return (
    <div className="resource-card">
      <span className="resource-kind">{kind}</span>
      <h3>{url ? <a href={url}>{title}</a> : title}</h3>
      <p>{description}</p>
      <span className="resource-by">{by}</span>
    </div>
  );
}

export default function ResourcesTab() {
  return (
    <>
      <section className="resource-section">
        <h2>Books</h2>
        <p className="placeholder-note">
          Placeholder entries — a curated book list is coming soon.
        </p>
        <div className="resource-grid">
          {books.map((b) => (
            <ResourceCard
              key={b.title}
              kind="Book"
              title={b.title}
              by={b.author}
              description={b.description}
              url={b.url}
            />
          ))}
        </div>
      </section>
      <section className="resource-section">
        <h2>Courses</h2>
        <p className="placeholder-note">
          Placeholder entries — a curated course list is coming soon.
        </p>
        <div className="resource-grid">
          {courses.map((c) => (
            <ResourceCard
              key={c.title}
              kind="Course"
              title={c.title}
              by={c.provider}
              description={c.description}
              url={c.url}
            />
          ))}
        </div>
      </section>
    </>
  );
}
