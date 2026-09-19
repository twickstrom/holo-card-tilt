import {describe, expect, it} from "vitest";

import {derivePointerState, normalizePointer} from "../src/pointer.js";

const box = {width: 200, height: 100, left: 50, top: 20, half: [100, 50] as [number, number]};

describe("normalizePointer", () => {
  it("maps viewport coordinates into the box", () => {
    expect(normalizePointer(150, 70, box)).toEqual([0.5, 0.5]);
    expect(normalizePointer(50, 20, box)).toEqual([0, 0]);
  });

  it("clamps positions outside the box", () => {
    expect(normalizePointer(-500, 9000, box)).toEqual([0, 1]);
  });
});

describe("derivePointerState", () => {
  it("is zeroed at the center", () => {
    expect(derivePointerState(box, 0.5, 0.5)).toEqual({
      delta: [0, 0],
      distance: 0,
      angle: 0,
      edge: 0,
    });
  });

  it("measures the angle clockwise from the top", () => {
    expect(derivePointerState(box, 0.5, 0).angle).toBe(0);
    expect(derivePointerState(box, 1, 0.5).angle).toBe(90);
    expect(derivePointerState(box, 0.5, 1).angle).toBe(180);
    expect(derivePointerState(box, 0, 0.5).angle).toBe(270);
  });

  it("reports edge proximity from 0 to 1", () => {
    expect(derivePointerState(box, 0.75, 0.5).edge).toBeCloseTo(0.5);
    expect(derivePointerState(box, 1, 0.5).edge).toBe(1);
    expect(derivePointerState(box, 1, 1).edge).toBe(1);
  });
});
