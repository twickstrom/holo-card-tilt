/*
 * SPDX-License-Identifier: MIT
 */

export type XY = [number, number];

export interface ElementBox {
  width: number;
  height: number;
  left: number;
  top: number;
  half: XY;
}

export interface PointerDerivatives {
  /** Pixel offset of the pointer from the element center. */
  delta: XY;
  /** Pixel distance of the pointer from the element center. */
  distance: number;
  /** Clockwise angle from the center to the pointer, in degrees, where `0` points up. */
  angle: number;
  /** How close the pointer is to the nearest edge: `0` at the center, `1` on the edge. */
  edge: number;
}

export const ZERO_POINTER_DERIVATIVES: PointerDerivatives = {
  delta: [0, 0],
  distance: 0,
  angle: 0,
  edge: 0,
};

export const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(Math.max(value, min), max);

export const round = (value: number, precision = 4): number => {
  const factor = 10 ** precision;

  return Math.round(value * factor) / factor;
};

/**
 * Reads the element's bounding box once, with the half extents pointer math reuses.
 */
export const readElementBox = (element: Element): ElementBox => {
  const rect = element.getBoundingClientRect();
  const width = rect.width || 1;
  const height = rect.height || 1;

  return {width, height, left: rect.left, top: rect.top, half: [width / 2, height / 2]};
};

/**
 * Converts viewport coordinates to a position inside the box, normalized to `0`–`1`.
 */
export const normalizePointer = (clientX: number, clientY: number, box: ElementBox): XY => [
  clamp((clientX - box.left) / box.width),
  clamp((clientY - box.top) / box.height),
];

const angleFromDeltas = (dx: number, dy: number): number => {
  if (dx === 0 && dy === 0) return 0;

  const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  return degrees < 0 ? degrees + 360 : degrees;
};

// Copyright (c) 2026 Simeydotme, MIT License.
const closenessToEdge = (half: XY, dx: number, dy: number): number => {
  const kx = dx ? half[0] / Math.abs(dx) : Infinity;
  const ky = dy ? half[1] / Math.abs(dy) : Infinity;

  return clamp(1 / Math.min(kx, ky));
};

/**
 * Derives angle, distance, and edge proximity from a normalized position.
 */
export const derivePointerState = (box: ElementBox, x: number, y: number): PointerDerivatives => {
  const dx = clamp(x) * box.width - box.half[0];
  const dy = clamp(y) * box.height - box.half[1];

  return {
    delta: [dx, dy],
    distance: Math.hypot(dx, dy),
    angle: angleFromDeltas(dx, dy),
    edge: closenessToEdge(box.half, dx, dy),
  };
};
