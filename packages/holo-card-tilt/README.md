# holo-card-tilt

[![npm version](https://img.shields.io/npm/v/holo-card-tilt?style=flat-square&color=black)](https://www.npmjs.com/package/holo-card-tilt)
[![tests](https://img.shields.io/github/actions/workflow/status/twickstrom/holo-card-tilt/ci.yml?branch=main&style=flat-square&label=tests)](https://github.com/twickstrom/holo-card-tilt/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/holo-card-tilt?style=flat-square)](https://www.npmjs.com/package/holo-card-tilt)
[![license](https://img.shields.io/npm/l/holo-card-tilt?style=flat-square&color=black)](https://github.com/twickstrom/holo-card-tilt/blob/main/LICENSE)

![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

A tilt, glare, and shadow hover effect for React 19 and Next.js, built to
[HeroUI v3](https://heroui.com) conventions: compound parts, `tailwind-variants` slots, BEM
classes, and theme tokens.

**[Demo and documentation](https://timwickstrom.com/projects/holo-card-tilt)**

- **No renders while animating.** Pointer movement is written to CSS variables from a single
  `requestAnimationFrame` loop. React renders once, on mount.
- **Server-rendered at rest.** The markup is identical on the server and the client, with no
  generated ids and no hydration warnings.
- **Themed.** `color="accent"` tints the glare and shadow from your HeroUI theme, in light mode,
  dark mode, and custom design systems.
- **Accessible motion.** Follows HeroUI's motion rules: flat under `data-reduce-motion="true"` or
  the OS reduced-motion setting, and `data-reduce-motion="false"` opts back in.
- **Touch-ready.** A touch on the element holds the page still, so a drag tilts it instead of
  scrolling. Pinch-zoom still works, and `shouldBlockScroll={false}` hands vertical drags back to
  the page.
- **Small.** One runtime dependency, `tailwind-variants`, which HeroUI already installs.

## Requirements

- React 19 or later
- Tailwind CSS v4
- `@heroui/styles` 3 or later

## Installation

```bash
npm install holo-card-tilt
pnpm add holo-card-tilt
yarn add holo-card-tilt
bun add holo-card-tilt
```

Import the stylesheet after HeroUI's:

```css
/* globals.css */
@import "tailwindcss";
@import "@heroui/styles";
@import "holo-card-tilt/css";
```

## Usage

```tsx
import {Card} from "@heroui/react";
import {HoloCardTilt} from "holo-card-tilt";

export function TiltedCard() {
  return (
    <HoloCardTilt className="w-80 rounded-3xl" shadow="md">
      <HoloCardTilt.Rotator>
        <Card>
          <Card.Header>
            <Card.Title>Hover me</Card.Title>
            <Card.Description>The card tilts toward the pointer.</Card.Description>
          </Card.Header>
        </Card>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}
```

`HoloCardTilt` is a client component. It can be rendered from a Server Component, and its children
can be Server Components.

## Anatomy

```tsx
<HoloCardTilt>
  <HoloCardTilt.Rotator>
    {/* your content */}
    <HoloCardTilt.Layer />
    <HoloCardTilt.Glare />
  </HoloCardTilt.Rotator>
</HoloCardTilt>
```

| Part                   | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `HoloCardTilt`         | Perspective wrapper. Tracks the pointer and owns every CSS variable. |
| `HoloCardTilt.Rotator` | The element that rotates and scales. Required.                       |
| `HoloCardTilt.Glare`   | The light that follows the pointer. Place it last so it sits on top. |
| `HoloCardTilt.Layer`   | Content that lifts toward the viewer while the effect is active.     |

Set the corner radius on `HoloCardTilt`. The rotator and glare inherit it.

## Variants

```tsx
<HoloCardTilt variant="spotlight" color="accent" tilt="lg" shadow="lg" />
```

| Prop      | Values                                                    | Default     |
| --------- | --------------------------------------------------------- | ----------- |
| `variant` | `"glare"` `"spotlight"` `"sheen"`                         | `"glare"`   |
| `color`   | `"default"` `"accent"` `"success"` `"warning"` `"danger"` | `"default"` |
| `tilt`    | `"none"` `"sm"` `"md"` `"lg"`                             | `"md"`      |
| `shadow`  | `"none"` `"sm"` `"md"` `"lg"`, or `true` for `"md"`       | `"none"`    |

The variants are exported as `holoCardTiltVariants` and can be extended the same way as HeroUI's:

```tsx
import {holoCardTiltVariants} from "holo-card-tilt";
import {tv} from "@heroui/styles";

const myTiltVariants = tv({
  extend: holoCardTiltVariants,
  variants: {tilt: {xl: {base: "[--holo-card-tilt-rotation:28deg]"}}},
});
```

## Props

### HoloCardTilt

| Prop                 | Type                          | Default                          | Description                                                                                   |
| -------------------- | ----------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| `tiltFactor`         | `number`                      | `1`                              | Multiplies the horizontal rotation set by `tilt`.                                             |
| `tiltFactorY`        | `number`                      | `tiltFactor`                     | Multiplies the vertical rotation.                                                             |
| `scaleFactor`        | `number`                      | `1`                              | Scale applied while active.                                                                   |
| `springOptions`      | `SpringOptions`               | `{stiffness: 0.2, damping: 0.8}` | Physics for the glare, shadow, and scale.                                                     |
| `tiltSpringOptions`  | `SpringOptions`               | `springOptions`                  | Physics for the rotation.                                                                     |
| `enterDelay`         | `number`                      | `0`                              | Milliseconds the pointer must stay inside before the effect starts.                           |
| `exitDelay`          | `number`                      | `200`                            | Milliseconds after the pointer leaves before returning to rest.                               |
| `isDisabled`         | `boolean`                     | `false`                          | Disables pointer tracking, leaving the element flat and unlit.                                |
| `shouldBlockScroll`  | `boolean`                     | `true`                           | Whether a touch on the element holds the page still, so a drag tilts it instead of scrolling. |
| `onActiveChange`     | `(isActive: boolean) => void` | -                                | Called when the element becomes active or returns to rest.                                    |
| `glareIntensity`     | `number`                      | `1`                              | Glare strength. Sets `--holo-card-tilt-glare-intensity`.                                      |
| `glareHue`           | `number`                      | `270`                            | Glare hue when `color` is `"default"`. Sets `--holo-card-tilt-glare-hue`.                     |
| `blendMode`          | `mix-blend-mode`              | `"overlay"`                      | Sets `--holo-card-tilt-blend-mode`.                                                           |
| `shadowBlur`         | `number`                      | -                                | Shadow blur in pixels. Overrides the `shadow` size.                                           |
| `shadowIntensity`    | `number`                      | `1`                              | Shadow strength. Sets `--holo-card-tilt-shadow-intensity`.                                    |
| `glareMask`          | `string`                      | -                                | CSS `mask-image` confining the glare.                                                         |
| `glareMaskMode`      | `string`                      | `"match-source"`                 | CSS `mask-mode` for `glareMask`.                                                              |
| `glareMaskComposite` | `string`                      | `"add"`                          | CSS `mask-composite` for `glareMask`.                                                         |

Also supports all native `div` attributes.

Spring values use the same scale as Svelte's `Spring`.

### HoloCardTilt.Layer

| Prop    | Type     | Default | Description                                            |
| ------- | -------- | ------- | ------------------------------------------------------ |
| `depth` | `number` | `24`    | Pixels the layer lifts toward the viewer while active. |

Layers rely on `transform-style: preserve-3d`, which is not inherited. A layer that is not a direct
child of `HoloCardTilt.Rotator` needs `transform-style: preserve-3d` (Tailwind's `transform-3d`) on
every element between them. `overflow: hidden`, `filter`, or `opacity` below `1` on those elements
flattens the layer.

## Styling

### CSS classes

- `.holo-card-tilt` — perspective wrapper
- `.holo-card-tilt__rotator` — 3D tilt layer
- `.holo-card-tilt__glare` — pointer-tracked light
- `.holo-card-tilt__layer` — lifted content
- `.holo-card-tilt--{glare|spotlight|sheen}` — variant
- `.holo-card-tilt--{default|accent|success|warning|danger}` — color
- `.holo-card-tilt--tilt-{none|sm|md|lg}` — tilt
- `.holo-card-tilt--shadow-{sm|md|lg}` — shadow
- `.holo-card-tilt--block-scroll` — holds the page still while the element is touched

Styles live in `@layer components`, so Tailwind utilities passed through `className` override them.

### State attributes

- `[data-active="true"]` — the effect is running
- `[data-disabled="true"]` — `isDisabled` is set

```tsx
<HoloCardTilt className="transition-[filter] data-[active=true]:brightness-110" />
```

### CSS variables

Set these on `HoloCardTilt` to restyle it without overriding classes.

| Variable                           | Default                     | Description                           |
| ---------------------------------- | --------------------------- | ------------------------------------- |
| `--holo-card-tilt-perspective`     | `600px`                     | 3D perspective depth                  |
| `--holo-card-tilt-rotation`        | `10deg`                     | Maximum rotation, set by `tilt`       |
| `--holo-card-tilt-color`           | set by `color`              | Base color of the glare               |
| `--holo-card-tilt-shadow-color`    | `black`                     | Shadow color, set by `color`          |
| `--holo-card-tilt-shadow-opacity`  | `0.125`, `0.5` in dark mode | Shadow opacity at full activation     |
| `--holo-card-tilt-custom-gradient` | -                           | Replaces the glare `background-image` |
| `--holo-card-tilt-custom-shadow`   | -                           | Replaces the rotator `box-shadow`     |

These are driven by the pointer and are read-only:

| Variable                       | Range             | Description                                    |
| ------------------------------ | ----------------- | ---------------------------------------------- |
| `--holo-card-tilt-x`           | `0`–`1`           | Pointer position from the left edge            |
| `--holo-card-tilt-y`           | `0`–`1`           | Pointer position from the top edge             |
| `--holo-card-tilt-opacity`     | `0`–`1`           | Activation of the effect                       |
| `--holo-card-tilt-scale`       | `1`–`scaleFactor` | Current scale                                  |
| `--holo-card-tilt-angle`       | `0deg`–`360deg`   | Clockwise angle from the center to the pointer |
| `--holo-card-tilt-from-center` | pixels            | Distance from the center to the pointer        |
| `--holo-card-tilt-at-edge`     | `0`–`1`           | Proximity of the pointer to the nearest edge   |
| `--holo-card-tilt-gradient-x`  | `0%`–`100%`       | `--holo-card-tilt-x` as a percentage           |
| `--holo-card-tilt-gradient-y`  | `0%`–`100%`       | `--holo-card-tilt-y` as a percentage           |
| `--holo-card-tilt-shadow-x`    | `-1`–`1`          | Horizontal shadow direction                    |
| `--holo-card-tilt-shadow-y`    | `-1`–`1`          | Vertical shadow direction                      |

A custom glare built from them:

```tsx
<HoloCardTilt
  style={{
    "--holo-card-tilt-custom-gradient": `conic-gradient(
      from var(--holo-card-tilt-angle) at var(--holo-card-tilt-gradient-x) var(--holo-card-tilt-gradient-y),
      var(--accent), var(--success), var(--warning), var(--danger), var(--accent))`,
  }}
/>
```

## useHoloCardTilt

The hook behind `HoloCardTilt`. It drives the same CSS variables on any element.

```tsx
"use client";

import {useHoloCardTilt} from "holo-card-tilt";

export function Tilted({children}: {children: React.ReactNode}) {
  const {ref, pointerProps} = useHoloCardTilt({scaleFactor: 1.05});

  return (
    <div ref={ref} {...pointerProps} className="holo-card-tilt">
      <div className="holo-card-tilt__rotator">{children}</div>
    </div>
  );
}
```

## Inspired by

- [Holo Card by HeroUI](https://heroui.pro/docs/react/components/holo-card)
- [Pokemon Cards V2 by Simon Goellner](https://poke-holo.simey.me/)
- [Hover-tilt by Simon Goellner](https://github.com/simeydotme/hover-tilt)
- [React Next Tilt by Rashid Shamloo](https://github.com/rashidshamloo/react-next-tilt)

## License

[MIT](https://github.com/twickstrom/holo-card-tilt/blob/main/LICENSE)
