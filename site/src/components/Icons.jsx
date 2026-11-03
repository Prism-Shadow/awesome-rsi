// Small icons for the header and the detail page actions, drawn on a 24px grid.
function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// A document with a folded corner.
export function PaperIcon() {
  return (
    <Icon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Icon>
  );
}

// An arrow into a tray.
export function DownloadIcon() {
  return (
    <Icon>
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14" />
    </Icon>
  );
}

// Curly braces, for a citation record.
export function CiteIcon() {
  return (
    <Icon>
      <path d="M8 4c-1.7 0-2.5.8-2.5 2.5v2.2c0 1.3-.7 2.3-2 2.3 1.3 0 2 1 2 2.3v2.2C5.5 17.2 6.3 18 8 18M16 4c1.7 0 2.5.8 2.5 2.5v2.2c0 1.3.7 2.3 2 2.3-1.3 0-2 1-2 2.3v2.2c0 1.7-.8 2.5-2.5 2.5" />
    </Icon>
  );
}

// Three linked nodes.
export function GraphIcon() {
  return (
    <Icon>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.4 7.4 15.5 6.4M7.2 9.2l3.6 6.6M16.9 8.3l-3.7 7.4" />
    </Icon>
  );
}

// A link chain, for project pages.
export function LinkIcon() {
  return (
    <Icon>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
    </Icon>
  );
}

// A small arrow pointing out, for links that leave the site.
export function ExternalIcon() {
  return (
    <Icon>
      <path d="M9 7h8v8M17 7 7 17" />
    </Icon>
  );
}

// The GitHub mark, filled.
export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
