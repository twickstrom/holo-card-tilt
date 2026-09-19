/*
 * SPDX-License-Identifier: MIT
 */

import type {ElementBox} from "./pointer.js";
import type {SpringOptions, StrictSpringOptions} from "./spring.js";

import {
  ZERO_POINTER_DERIVATIVES,
  derivePointerState,
  normalizePointer,
  readElementBox,
  round,
} from "./pointer.js";
import {DEFAULT_SPRING_OPTIONS, Spring} from "./spring.js";

export interface TiltEngineOptions {
  scaleFactor: number;
  springOptions: SpringOptions;
  tiltSpringOptions: SpringOptions | undefined;
  enterDelay: number;
  exitDelay: number;
  isDisabled: boolean;
  onActiveChange: ((isActive: boolean) => void) | undefined;
}

/** Activation level above which the element counts as active. */
const ACTIVE_THRESHOLD = 0.01;

// Copyright (c) 2026 Simeydotme, MIT License.
/** The exit animation is looser than the entrance so the element drifts back to rest. */
const EXIT_STIFFNESS_RATIO = 0.2;
const EXIT_DAMPING_RATIO = 0.5;

const REST_POSITION = [0.5, 0.5] as const;

/**
 * Follows HeroUI's motion priority: the nearest `data-reduce-motion` attribute decides, and the
 * OS setting applies only when no ancestor sets one.
 */
const prefersReducedMotion = (element: Element): boolean => {
  const explicit = element.closest("[data-reduce-motion]")?.getAttribute("data-reduce-motion");

  if (explicit === "true") return true;
  if (explicit === "false") return false;

  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

/**
 * Drives the tilt for one element.
 *
 * Every animated value is written to the element as a CSS custom property from a single
 * `requestAnimationFrame` loop, so a running animation never triggers a React render.
 */
export class TiltEngine {
  private readonly activation = new Spring([0]);
  private readonly position = new Spring(REST_POSITION);

  private box: ElementBox | null = null;
  private boxIsStale = true;
  private frame: number | null = null;
  private lastFrameTime = 0;
  private enterTimeout: ReturnType<typeof setTimeout> | undefined;
  private exitTimeout: ReturnType<typeof setTimeout> | undefined;
  private pendingPosition: [number, number] | null = null;
  private isEngaged = false;
  private isActive = false;

  constructor(
    private readonly element: HTMLElement,
    private options: TiltEngineOptions,
  ) {}

  setOptions(options: TiltEngineOptions): void {
    const wasDisabled = this.options.isDisabled;

    this.options = options;

    if (options.isDisabled && !wasDisabled) this.reset();
  }

  enter(clientX: number, clientY: number): void {
    if (this.options.isDisabled || prefersReducedMotion(this.element)) return;

    clearTimeout(this.enterTimeout);
    clearTimeout(this.exitTimeout);
    this.boxIsStale = true;
    this.capture(clientX, clientY);

    if (this.isEngaged) {
      this.engage();

      return;
    }

    this.enterTimeout = setTimeout(() => this.engage(), this.options.enterDelay);
  }

  move(clientX: number, clientY: number): void {
    if (this.options.isDisabled) return;

    this.capture(clientX, clientY);

    if (this.isEngaged) this.applyPendingPosition();
  }

  leave(): void {
    clearTimeout(this.enterTimeout);
    clearTimeout(this.exitTimeout);
    this.pendingPosition = null;

    if (!this.isEngaged) return;

    this.exitTimeout = setTimeout(() => {
      const spring = this.resolveSpring(this.options.springOptions);
      const tiltSpring = this.resolveSpring(
        this.options.tiltSpringOptions ?? this.options.springOptions,
      );

      this.activation.stiffness = spring.stiffness * EXIT_STIFFNESS_RATIO;
      this.activation.damping = spring.damping * EXIT_DAMPING_RATIO;
      this.position.stiffness = tiltSpring.stiffness * EXIT_STIFFNESS_RATIO;
      this.position.damping = tiltSpring.damping * EXIT_DAMPING_RATIO;
      this.activation.setTarget([0]);
      this.position.setTarget(REST_POSITION);
      this.start();
    }, this.options.exitDelay);
  }

  /** Returns to rest immediately, with no animation. */
  reset(): void {
    this.destroy();
    this.isEngaged = false;
    this.activation.jump([0]);
    this.position.jump(REST_POSITION);
    this.write();
  }

  /** Releases timers and the animation frame. */
  destroy(): void {
    clearTimeout(this.enterTimeout);
    clearTimeout(this.exitTimeout);

    if (this.frame !== null) cancelAnimationFrame(this.frame);

    this.frame = null;
    this.pendingPosition = null;
  }

  private resolveSpring(options: SpringOptions): StrictSpringOptions {
    return {...DEFAULT_SPRING_OPTIONS, ...options};
  }

  private capture(clientX: number, clientY: number): void {
    // One layout read per frame at most; the loop marks the box stale after each write.
    if (this.boxIsStale || !this.box) {
      this.box = readElementBox(this.element);
      this.boxIsStale = false;
    }

    this.pendingPosition = normalizePointer(clientX, clientY, this.box);
  }

  private applyPendingPosition(): void {
    if (!this.pendingPosition) return;

    this.position.setTarget(this.pendingPosition);
    this.pendingPosition = null;
    this.start();
  }

  private engage(): void {
    const spring = this.resolveSpring(this.options.springOptions);
    const tiltSpring = this.resolveSpring(
      this.options.tiltSpringOptions ?? this.options.springOptions,
    );

    this.activation.stiffness = spring.stiffness;
    this.activation.damping = spring.damping;
    this.activation.precision = spring.precision;
    this.position.stiffness = tiltSpring.stiffness;
    this.position.damping = tiltSpring.damping;
    this.position.precision = tiltSpring.precision;
    this.isEngaged = true;
    this.activation.setTarget([1]);
    this.applyPendingPosition();
    this.start();
  }

  private start(): void {
    if (this.frame !== null) return;

    this.lastFrameTime = performance.now();
    this.frame = requestAnimationFrame(this.step);
  }

  private step = (now: number): void => {
    const elapsed = now - this.lastFrameTime;

    this.lastFrameTime = now;

    const activationSettled = this.activation.tick(elapsed);
    const positionSettled = this.position.tick(elapsed);

    // Staying engaged until the exit finishes lets a returning pointer skip the enter delay.
    if (activationSettled && this.activation.target[0] === 0) this.isEngaged = false;

    this.write();
    this.boxIsStale = true;
    this.frame = activationSettled && positionSettled ? null : requestAnimationFrame(this.step);
  };

  private write(): void {
    const {style} = this.element;
    const activation = this.activation.current[0]!;
    const x = this.position.current[0]!;
    const y = this.position.current[1]!;
    const pointer = this.box ? derivePointerState(this.box, x, y) : ZERO_POINTER_DERIVATIVES;

    style.setProperty("--holo-card-tilt-x", String(round(x)));
    style.setProperty("--holo-card-tilt-y", String(round(y)));
    style.setProperty("--holo-card-tilt-opacity", String(round(activation)));
    style.setProperty(
      "--holo-card-tilt-scale",
      String(round(1 + (this.options.scaleFactor - 1) * activation)),
    );
    style.setProperty("--holo-card-tilt-angle", `${round(pointer.angle, 2)}deg`);
    style.setProperty("--holo-card-tilt-from-center", `${round(pointer.distance, 2)}px`);
    style.setProperty("--holo-card-tilt-at-edge", String(round(pointer.edge)));

    const isActive = activation >= ACTIVE_THRESHOLD;

    if (isActive === this.isActive) return;

    this.isActive = isActive;

    if (isActive) {
      this.element.setAttribute("data-active", "true");
    } else {
      this.element.removeAttribute("data-active");
    }

    this.options.onActiveChange?.(isActive);
  }
}
