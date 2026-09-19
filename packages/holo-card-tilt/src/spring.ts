/*
 * SPDX-License-Identifier: MIT
 */

/**
 * Physics options for a spring. Values use the same scale as Svelte's `Spring`.
 */
export interface SpringOptions {
  /** How strongly the value is pulled toward its target, `0`–`1`. Higher is faster. */
  stiffness?: number;
  /** How quickly oscillation is absorbed, `0`–`1`. Lower is bouncier. */
  damping?: number;
  /** Distance from the target below which the spring is considered settled. */
  precision?: number;
}

export type StrictSpringOptions = Required<SpringOptions>;

export const DEFAULT_SPRING_OPTIONS: StrictSpringOptions = {
  stiffness: 0.2,
  damping: 0.8,
  precision: 0.001,
};

// Copyright (c) Svelte contributors, MIT License.
/** Longest frame the integrator will accept, so a backgrounded tab cannot fling the value. */
const MAX_FRAME_MS = 1000 / 30;

/**
 * A fixed-dimension spring, integrated one animation frame at a time.
 *
 * The spring owns no timer. A caller drives it from a single `requestAnimationFrame`
 * loop so that several springs share one frame callback.
 */
export class Spring {
  readonly current: number[];
  readonly target: number[];
  stiffness: number;
  damping: number;
  precision: number;

  private readonly last: number[];

  constructor(initial: readonly number[], options: SpringOptions = {}) {
    const resolved = {...DEFAULT_SPRING_OPTIONS, ...options};

    this.current = [...initial];
    this.target = [...initial];
    this.last = [...initial];
    this.stiffness = resolved.stiffness;
    this.damping = resolved.damping;
    this.precision = resolved.precision;
  }

  /** Whether every dimension is resting on its target. */
  get isSettled(): boolean {
    return this.current.every((value, i) => value === this.target[i] && value === this.last[i]);
  }

  setTarget(target: readonly number[]): void {
    for (let i = 0; i < this.target.length; i++) {
      this.target[i] = target[i] ?? this.target[i]!;
    }
  }

  /** Moves straight to a value with no animation. */
  jump(value: readonly number[]): void {
    for (let i = 0; i < this.current.length; i++) {
      const next = value[i] ?? this.current[i]!;

      this.current[i] = next;
      this.target[i] = next;
      this.last[i] = next;
    }
  }

  // Copyright (c) Svelte contributors, MIT License.
  /**
   * Advances the spring by `elapsedMs` and reports whether it has settled.
   */
  tick(elapsedMs: number): boolean {
    // Time is measured in 60fps frames, which keeps stiffness and damping frame-rate independent.
    const dt = (Math.min(Math.max(elapsedMs, 0), MAX_FRAME_MS) * 60) / 1000;

    if (dt === 0) return this.isSettled;

    let settled = true;

    for (let i = 0; i < this.current.length; i++) {
      const current = this.current[i]!;
      const target = this.target[i]!;
      const delta = target - current;
      const velocity = (current - this.last[i]!) / dt;
      const acceleration = this.stiffness * delta - this.damping * velocity;
      const step = (velocity + acceleration) * dt;

      this.last[i] = current;

      if (Math.abs(step) < this.precision && Math.abs(delta) < this.precision) {
        this.current[i] = target;
        this.last[i] = target;
      } else {
        this.current[i] = current + step;
        settled = false;
      }
    }

    return settled;
  }
}
