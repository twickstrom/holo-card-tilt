"use client";

import {useHoloCardTilt} from "holo-card-tilt";

export const hookCode = `"use client";

import {useHoloCardTilt} from "holo-card-tilt";

export function Spotlight() {
  const {ref, pointerProps} = useHoloCardTilt({exitDelay: 0});

  return (
    <div
      ref={ref}
      {...pointerProps}
      className="rounded-3xl border border-border p-10"
      style={{
        backgroundImage: \`radial-gradient(
          circle at calc(var(--holo-card-tilt-x, 0.5) * 100%) calc(var(--holo-card-tilt-y, 0.5) * 100%),
          oklch(from var(--accent) l c h / calc(var(--holo-card-tilt-opacity, 0) * 0.35)),
          transparent 60%)\`,
      }}
    >
      A spotlight with no tilt
    </div>
  );
}`;

export function HookExample() {
  const {pointerProps, ref} = useHoloCardTilt({exitDelay: 0});

  return (
    <div
      ref={ref}
      {...pointerProps}
      className="border-border rounded-3xl border p-10"
      style={{
        backgroundImage: `radial-gradient(
          circle at calc(var(--holo-card-tilt-x, 0.5) * 100%) calc(var(--holo-card-tilt-y, 0.5) * 100%),
          oklch(from var(--accent) l c h / calc(var(--holo-card-tilt-opacity, 0) * 0.35)),
          transparent 60%)`,
      }}
    >
      A spotlight with no tilt
    </div>
  );
}
