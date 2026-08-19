import { books, courses, learningMaterials } from "../data/resources.js";

function ResourceCard({ title, by, description, url, links }) {
  return (
    <div className="resource-card">
      <h3>
        {url
          ? <a href={url} target="_blank" rel="noreferrer">{title}</a>
          : title}
      </h3>
      <p>{description}</p>
      {links && (
        <div className="resource-links" aria-label={`${title} links`}>
          {links.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
      <span className="resource-by">{by}</span>
    </div>
  );
}

export default function ResourcesTab() {
  return (
    <>
      <section className="resource-section">
        <h2>Books</h2>
        <div className="resource-grid">
          {books.map((b) => (
            <ResourceCard
              key={b.title}
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
        <div className="resource-grid">
          {courses.map((c) => (
            <ResourceCard
              key={c.title}
              title={c.title}
              by={c.provider}
              description={c.description}
              url={c.url}
              links={c.links}
            />
          ))}
        </div>
      </section>
      <section className="resource-section">
        <h2>Learning Materials</h2>
        <div className="resource-grid">
          {learningMaterials.map((material) => (
            <ResourceCard
              key={material.title}
              title={material.title}
              by={material.provider}
              description={material.description}
              url={material.url}
            />
          ))}
        </div>
      </section>
    </>
  );
}
