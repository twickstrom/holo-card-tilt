import {readFileSync} from "node:fs";
import {resolve} from "node:path";

import {describe, expect, it} from "vitest";

const read = (file: string) => readFileSync(resolve(process.cwd(), "src", file), "utf8");
const isClientModule = (source: string) => /^\s*["']use client["'];?\s*$/m.test(source);

describe("module boundaries", () => {
  it("keeps the entry server-safe so HoloCardTilt.Rotator resolves in Server Components", () => {
    expect(isClientModule(read("index.tsx"))).toBe(false);
    expect(isClientModule(read("holo-card-tilt.styles.ts"))).toBe(false);
  });

  it("marks the modules that use hooks as client modules", () => {
    expect(isClientModule(read("holo-card-tilt.tsx"))).toBe(true);
    expect(isClientModule(read("use-holo-card-tilt.ts"))).toBe(true);
  });
});
