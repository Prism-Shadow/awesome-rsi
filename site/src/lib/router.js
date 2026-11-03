// Client-side navigation between the site's paths: links within the site update the history and
// notify App instead of loading the page again, so list filters and scroll survive a round trip.
import { BASE, routeFromPath } from "./navigation.js";

export const LOCATION_CHANGE = "locationchange";

export function navigate(url, { replace = false } = {}) {
  window.history[replace ? "replaceState" : "pushState"](null, "", url);
  window.dispatchEvent(new Event(LOCATION_CHANGE));
}

// The link a click should be handled in the page, or null to let the browser follow it: new tabs,
// other sites, files such as PDFs and images, and anchors within the current page.
export function inPageLink(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target.closest?.("a[href]");
  if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.startsWith(BASE)) return null;
  if (routeFromPath(url.pathname).tab === "notFound") return null;
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return null;
  return url;
}
