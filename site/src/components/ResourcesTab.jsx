import { books, courses, learningMaterials } from "../data/resources.js";
import { localizedValue, resourcesCopy } from "../i18n.js";

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

export default function ResourcesTab({ lang }) {
  const copy = resourcesCopy[lang];
  return (
    <>
      <section className="resource-section">
        <h2>{copy.books}</h2>
        <div className="resource-grid">
          {books.map((b) => (
            <ResourceCard
              key={b.title}
              title={localizedValue(b, "title", lang)}
              by={localizedValue(b, "author", lang)}
              description={localizedValue(b, "description", lang)}
              url={b.url}
            />
          ))}
        </div>
      </section>
      <section className="resource-section">
        <h2>{copy.courses}</h2>
        <div className="resource-grid">
          {courses.map((c) => (
            <ResourceCard
              key={c.title}
              title={localizedValue(c, "title", lang)}
              by={localizedValue(c, "provider", lang)}
              description={localizedValue(c, "description", lang)}
              url={c.url}
              links={c.links}
            />
          ))}
        </div>
      </section>
      <section className="resource-section">
        <h2>{copy.learningMaterials}</h2>
        <div className="resource-grid">
          {learningMaterials.map((material) => (
            <ResourceCard
              key={material.title}
              title={localizedValue(material, "title", lang)}
              by={localizedValue(material, "provider", lang)}
              description={localizedValue(material, "description", lang)}
              url={material.url}
            />
          ))}
        </div>
      </section>
    </>
  );
}
