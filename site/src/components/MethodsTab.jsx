import { methods } from "../data/methods.js";

function MethodCard({ method }) {
  return (
    <article className="resource-card method-card">
      <div className="method-card-meta">
        <span className="paper-nick">{method.version}</span>
        <span className="method-status">{method.status}</span>
      </div>
      <h3>
        <a href={method.links[0].url} target="_blank" rel="noreferrer">{method.name}</a>
      </h3>
      <p>{method.description}</p>
      <dl className="method-taxonomy">
        {method.taxonomy.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="paper-tags" aria-label={`${method.name} categories`}>
        {method.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div className="resource-links" aria-label={`${method.name} links`}>
        {method.links.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
            {link.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}

export default function MethodsTab() {
  return (
    <>
      <section className="methods-placeholder" aria-labelledby="methods-title">
        <div className="methods-placeholder-index" aria-hidden="true">02 / Methods</div>
        <div>
          <span className="methods-placeholder-kicker">Open-source implementations</span>
          <h2 id="methods-title">Methods &amp; Systems</h2>
          <p>
            Open-source systems and repeatable methods for building and evaluating self-improving
            agents. Each entry identifies what evolves, how iteration works, and where to inspect
            the implementation.
          </p>
          <div className="methods-placeholder-scope" aria-label="Method categories">
            <span>Learning methods</span>
            <span>Agent systems</span>
            <span>Training loops</span>
            <span>Memory &amp; skills</span>
          </div>
        </div>
      </section>
      <section className="resource-section" aria-labelledby="method-list-title">
        <h2 id="method-list-title">Agent systems &amp; evolution loops</h2>
        <div className="resource-grid">
          {methods.map((method) => <MethodCard method={method} key={method.id} />)}
        </div>
      </section>
    </>
  );
}
