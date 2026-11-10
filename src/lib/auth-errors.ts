/** Turn raw sign-in / sign-up errors into short, friendly messages. */
export function friendlyAuthError(message: string | undefined | null, mode: "signin" | "signup" | "reset" = "signin"): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("email not confirmed") || m.includes("not confirmed")) {
    return "Please confirm your email first — open the link we sent to your inbox.";
  }
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "That email and password don't match. Check them or create an account.";
  }
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already exists")) {
    return "That email already has an account — sign in instead.";
  }
  if (m.includes("weak") || m.includes("easy to guess") || m.includes("pwned")) {
    return "That password is too common and easy to guess. Please choose a stronger one.";
  }
  if (m.includes("not allowed") || m.includes("cannot receive email") || m.includes("invalid email") || m.includes("is invalid")) {
    return "That email address can't receive mail. Please use your real email.";
  }
  if (m.includes("rate limit") || m.includes("too many") || m.includes("security purposes")) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (m.includes("same") && m.includes("password")) {
    return "Your new password must be different from the old one.";
  }
  if (m.includes("fetch") || m.includes("network")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (mode === "signin") return "Sign-in didn't work. Please try again.";
  if (mode === "signup") return "We couldn't create your account. Please try again.";
  return "Something went wrong. Please try again.";
}

/** Read an error that an email link put in the URL (e.g. an expired or already-used link). */
export function linkErrorFromUrl(hash: string, search = ""): string | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const q = new URLSearchParams(search.replace(/^\?/, ""));
  const code = params.get("error_code") ?? q.get("error_code");
  const err = params.get("error") ?? q.get("error");
  if (!code && !err) return null;
  if (code === "otp_expired" || (params.get("error_description") ?? "").toLowerCase().includes("expired")) {
    return "This email link has expired or was already used. If you already confirmed your email, just sign in below.";
  }
  return "That email link didn't work. Please sign in, or request a new link.";
}
