import { describe, expect, it } from "vitest";

import { safeRedirect } from "@/lib/auth-redirect";

describe("safeRedirect", () => {
  it("keeps same-site paths like /education", () => {
    expect(safeRedirect("/education")).toBe("/education");
  });
  it("blocks other websites", () => {
    expect(safeRedirect("https://evil.com")).toBe("/");
    expect(safeRedirect("//evil.com")).toBe("/");
  });
  it("never loops back to the sign-in page", () => {
    expect(safeRedirect("/auth?redirect=/")).toBe("/");
  });
  it("falls back to home when missing", () => {
    expect(safeRedirect(undefined)).toBe("/");
  });
});
