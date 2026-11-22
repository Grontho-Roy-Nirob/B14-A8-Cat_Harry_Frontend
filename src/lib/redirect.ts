export const REDIRECT_PARAM = "redirect";

// Only same-origin absolute paths are safe to redirect to. Anything else
// (protocol-relative URLs, backslashes, control characters) falls back to "/".
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/"
) {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\u0000-\u001F\u007F]/.test(value)) return fallback;
  return value;
}

// Read at interaction time so this stays safe in statically rendered pages.
export function requestedPath() {
  if (typeof window === "undefined") return "/";
  return safeRedirectPath(
    new URLSearchParams(window.location.search).get(REDIRECT_PARAM)
  );
}
