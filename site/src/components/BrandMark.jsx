// The loop mark from assets/readme/logo.svg, drawn with theme colors.
export default function BrandMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 124 124" aria-hidden="true">
      <rect width="124" height="124" rx="34" fill="var(--accent-soft)" />
      <g fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M37 38 A36 36 0 0 1 96 48" />
        <path d="m95 34 2 16-15-4" />
        <path d="M98 67 A36 36 0 0 1 62 99" />
        <path d="m74 107-15-8 12-9" />
        <path d="M44 94 A36 36 0 0 1 29 54" />
        <path d="m17 63 12-11 5 15" />
      </g>
      <circle cx="62" cy="62" r="10" fill="var(--accent)" />
    </svg>
  );
}
