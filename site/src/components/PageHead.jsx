export default function PageHead({ title, description }) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
