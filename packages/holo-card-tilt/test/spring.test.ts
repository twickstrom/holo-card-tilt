import {describe, expect, it} from "vitest";

import {Spring} from "../src/spring.js";

const FRAME = 1000 / 60;

const run = (spring: Spring, maxFrames = 2000) => {
  let frames = 0;

  while (!spring.tick(FRAME) && frames < maxFrames) frames++;

  return frames;
};

describe("Spring", () => {
  it("starts settled on its initial value", () => {
    const spring = new Spring([0.5, 0.5]);

    expect(spring.isSettled).toBe(true);
    expect(spring.tick(FRAME)).toBe(true);
  });

  it("converges exactly on the target", () => {
    const spring = new Spring([0]);

    spring.setTarget([1]);

    const frames = run(spring);

    expect(frames).toBeLessThan(2000);
    expect(spring.current[0]).toBe(1);
    expect(spring.isSettled).toBe(true);
  });

  it("overshoots when damping is low", () => {
    const spring = new Spring([0], {stiffness: 0.2, damping: 0.1});
    let peak = 0;

    spring.setTarget([1]);

    for (let i = 0; i < 300; i++) {
      spring.tick(FRAME);
      peak = Math.max(peak, spring.current[0]!);
    }

    expect(peak).toBeGreaterThan(1);
  });

  it("settles sooner with higher stiffness", () => {
    const soft = new Spring([0], {stiffness: 0.05, damping: 0.8});
    const stiff = new Spring([0], {stiffness: 0.4, damping: 0.8});

    soft.setTarget([1]);
    stiff.setTarget([1]);

    expect(run(stiff)).toBeLessThan(run(soft));
  });

  it("caps long frames so a stalled tab cannot fling the value", () => {
    const spring = new Spring([0]);

    spring.setTarget([1]);
    spring.tick(5000);

    expect(spring.current[0]).toBeLessThan(1);
  });

  it("jumps without animating", () => {
    const spring = new Spring([0, 0]);

    spring.setTarget([1, 1]);
    spring.tick(FRAME);
    spring.jump([0.25, 0.75]);

    expect(spring.current).toEqual([0.25, 0.75]);
    expect(spring.isSettled).toBe(true);
  });
});
