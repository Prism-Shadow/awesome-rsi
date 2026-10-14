import { surveyPaper } from "../data/survey.js";
import { surveyCopy } from "../i18n.js";

export default function SurveyFeature({ lang }) {
  const copy = surveyCopy[lang];
  const pdfUrl = `${import.meta.env.BASE_URL}${surveyPaper.pdf}`;
  const date = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${surveyPaper.published}T00:00:00Z`));

  return (
    <section className="survey-feature" aria-labelledby="survey-title">
      <div className="survey-heading">
        <span className="survey-eyebrow">{copy.eyebrow}</span>
        <time className="survey-meta" dateTime={surveyPaper.published}>{date}</time>
      </div>
      <h2 id="survey-title">
        <a href={pdfUrl} target="_blank" rel="noreferrer">
          {lang === "zh" ? surveyPaper.titleZh : surveyPaper.title}
        </a>
      </h2>
      <p className="survey-summary">{copy.summary}</p>
      <div className="survey-actions">
        <a className="survey-read-link" href={pdfUrl} target="_blank" rel="noreferrer">
          {copy.read} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
