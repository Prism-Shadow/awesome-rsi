export default function PageHead({ title, description, children }) {
  return (
    <header className={`page-head${children ? " has-aside" : ""}`}>
      <div className="page-head-text">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children ? <div className="page-head-aside">{children}</div> : null}
    </header>
  );
}
