/** Only allow same-origin relative paths as post-login destinations. */
export function safeRedirect(target: unknown, fallback = "/"): string {
  if (typeof target !== "string") return fallback;
  const t = target.trim();
  if (!t.startsWith("/") || t.startsWith("//") || t.startsWith("/\\")) return fallback;
  if (t.startsWith("/auth") || t.startsWith("/reset-password")) return fallback;
  return t;
}

export const AUTH_REDIRECT_KEY = "auth:redirect";
