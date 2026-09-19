/*
 * SPDX-License-Identifier: MIT
 */

"use client";

import type {TiltEngineOptions} from "./engine.js";
import type {SpringOptions} from "./spring.js";
import type {PointerEvent, RefCallback} from "react";

import {useCallback, useEffect, useMemo, useRef} from "react";

import {TiltEngine} from "./engine.js";

export interface UseHoloCardTiltOptions {
  /** Scale applied while active. Values above `1` grow the element. @default 1 */
  scaleFactor?: number;
  /** Spring physics for the glare, shadow, and scale. @default {stiffness: 0.2, damping: 0.8} */
  springOptions?: SpringOptions;
  /** Spring physics for the rotation. Defaults to `springOptions`. */
  tiltSpringOptions?: SpringOptions;
  /** Milliseconds the pointer must stay inside before the effect starts. @default 0 */
  enterDelay?: number;
  /** Milliseconds after the pointer leaves before the element returns to rest. @default 200 */
  exitDelay?: number;
  /** Disables pointer tracking, leaving the element flat and unlit. @default false */
  isDisabled?: boolean;
  /** Called when the element becomes active or returns to rest. */
  onActiveChange?: (isActive: boolean) => void;
}

export interface UseHoloCardTiltResult<T extends HTMLElement> {
  /** Attach to the element that tracks the pointer and receives the CSS variables. */
  ref: RefCallback<T>;
  /** Spread onto the same element. */
  pointerProps: {
    onPointerEnter: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerLeave: () => void;
    onPointerCancel: () => void;
  };
}

const EMPTY_SPRING: SpringOptions = {};

/**
 * Tracks the pointer over an element and animates the `--holo-card-tilt-*` CSS variables on it.
 *
 * `HoloCardTilt` is built on this hook. Use it directly to drive a custom element with the
 * same variables.
 */
export function useHoloCardTilt<T extends HTMLElement = HTMLDivElement>({
  enterDelay = 0,
  exitDelay = 200,
  isDisabled = false,
  onActiveChange,
  scaleFactor = 1,
  springOptions = EMPTY_SPRING,
  tiltSpringOptions,
}: UseHoloCardTiltOptions = {}): UseHoloCardTiltResult<T> {
  const options: TiltEngineOptions = {
    enterDelay,
    exitDelay,
    isDisabled,
    onActiveChange,
    scaleFactor,
    springOptions,
    tiltSpringOptions,
  };
  const engineRef = useRef<TiltEngine | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
    engineRef.current?.setOptions(options);
  });

  const ref = useCallback<RefCallback<T>>((node) => {
    if (!node) return;

    const engine = new TiltEngine(node, optionsRef.current);

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const pointerProps = useMemo(
    () => ({
      onPointerEnter: (event: PointerEvent) =>
        engineRef.current?.enter(event.clientX, event.clientY),
      onPointerMove: (event: PointerEvent) => engineRef.current?.move(event.clientX, event.clientY),
      onPointerLeave: () => engineRef.current?.leave(),
      onPointerCancel: () => engineRef.current?.leave(),
    }),
    [],
  );

  return {pointerProps, ref};
}
