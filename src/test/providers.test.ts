import { describe, expect, it } from "vitest";

import { DEFAULT_QUERY, PROVIDERS, filterProviders, nearestEmergency } from "@/lib/providers";

describe("provider filters", () => {
  it("Rating 4.0+ drops a provider rated 3.9", () => {
    const ids = filterProviders(PROVIDERS, { ...DEFAULT_QUERY, tags: ["Rating 4.0+"] }).map((p) => p.id);
    expect(ids).not.toContain("p8");
    expect(ids).toContain("p10"); // rated 4.3
  });

  it("Open 24/7 + ICU Facility must both match", () => {
    const ids = filterProviders(PROVIDERS, { ...DEFAULT_QUERY, tags: ["Open 24/7", "ICU Facility"] }).map(
      (p) => p.id,
    );
    expect(ids.sort()).toEqual(["p1", "p8"]);
  });

  it("Exotic/Birds pet type only shows providers that treat them", () => {
    const ids = filterProviders(PROVIDERS, { ...DEFAULT_QUERY, pet: "Exotic/Birds" }).map((p) => p.id);
    expect(ids.sort()).toEqual(["p3", "p5", "p6", "p9"]);
  });

  it("sorts by distance by default and by rating when asked", () => {
    expect(filterProviders(PROVIDERS, DEFAULT_QUERY)[0]?.id).toBe("p1");
    expect(filterProviders(PROVIDERS, { ...DEFAULT_QUERY, sort: "rating" })[0]?.id).toBe("p6");
  });

  it("emergency locator returns nearest open 24/7 hospitals and ambulances", () => {
    expect(nearestEmergency(PROVIDERS).map((p) => p.id)).toEqual(["p1", "p6", "p8"]);
  });
});
