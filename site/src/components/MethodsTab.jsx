import { methodsCopy } from "../i18n.js";

export default function MethodsTab({ lang }) {
  const copy = methodsCopy[lang];
  return (
    <section className="methods-placeholder" aria-labelledby="methods-placeholder-title">
      <div className="methods-placeholder-index" aria-hidden="true">{copy.index}</div>
      <div>
        <span className="methods-placeholder-kicker">{copy.kicker}</span>
        <h2 id="methods-placeholder-title">{copy.title}</h2>
        <p>{copy.body}</p>
        <div className="methods-placeholder-scope" aria-label={copy.scopeLabel}>
          {copy.scopes.map((scope) => <span key={scope}>{scope}</span>)}
        </div>
      </div>
    </section>
  );
}
