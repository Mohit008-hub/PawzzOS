import { describe, expect, it } from "vitest";

import { friendlyAuthError, linkErrorFromUrl } from "@/lib/auth-errors";

describe("friendlyAuthError", () => {
  it("explains unconfirmed email", () => {
    expect(friendlyAuthError("Email not confirmed")).toMatch(/confirm your email/);
  });
  it("explains wrong password", () => {
    expect(friendlyAuthError("Invalid login credentials")).toMatch(/don't match/);
  });
  it("explains weak passwords", () => {
    expect(friendlyAuthError("Password is known to be weak and easy to guess, please choose a different one.", "signup")).toMatch(/too common/);
  });
  it("explains an existing account", () => {
    expect(friendlyAuthError("User already registered", "signup")).toMatch(/already has an account/);
  });
});

describe("linkErrorFromUrl", () => {
  it("detects an expired or reused confirmation link", () => {
    expect(linkErrorFromUrl("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired")).toMatch(/expired or was already used/);
  });
  it("returns null for a normal sign-in link", () => {
    expect(linkErrorFromUrl("#access_token=abc&type=signup")).toBeNull();
  });
});
