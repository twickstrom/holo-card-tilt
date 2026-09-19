# holo-card-tilt

A tilt, glare, and shadow hover effect for React 19 and Next.js 16, built to HeroUI v3 conventions.
Published to npm as `holo-card-tilt`. The exported component is `HoloCardTilt`.

## Repository layout

| Path                      | Contents                                                                       |
| ------------------------- | ------------------------------------------------------------------------------ |
| `packages/holo-card-tilt` | The library. The only published package.                                       |
| `apps/demo`               | Next.js 16 playground on port 3000. Builds from public packages only.          |
| `apps/docs`               | Next.js 16 documentation site on port 3001. Uses licensed `@heroui-pro/react`. |

pnpm workspace. Node.js 20.9 or later, pnpm 9.

## Commands

Run from the repository root.

```bash
pnpm install
pnpm build        # build the library
pnpm test         # library tests (vitest, jsdom)
pnpm typecheck    # every workspace
pnpm lint         # prettier --check
pnpm format       # prettier --write
pnpm dev:demo     # library watch + playground, http://localhost:3000
pnpm dev:docs     # library watch + docs, http://localhost:3001
pnpm build:all    # library, then both apps
```

The apps consume the library from `packages/holo-card-tilt/dist`. Rebuild the library after changing
it, or run one of the `dev:*` scripts, which keep it building in watch mode.

`apps/docs` installs `@heroui-pro/react`. Locally that needs `npx heroui-pro@latest login`; in CI and
on Vercel it needs `HEROUI_AUTH_TOKEN`. Without a license, install with `pnpm install --filter "!docs"`.

Before finishing a change: `pnpm format`, `pnpm lint`, `pnpm test`, `pnpm build`, and build any app
the change touches.

## Using the component

```css
/* globals.css — order matters */
@import "tailwindcss";
@import "@heroui/styles";
@import "holo-card-tilt/css";
```

```tsx
import {HoloCardTilt} from "holo-card-tilt";

<HoloCardTilt className="w-80 rounded-3xl" color="accent" shadow="md">
  <HoloCardTilt.Rotator>
    <Card>…</Card>
    <HoloCardTilt.Layer depth={40}>…</HoloCardTilt.Layer>
    <HoloCardTilt.Glare />
  </HoloCardTilt.Rotator>
</HoloCardTilt>;
```

- `HoloCardTilt` is the perspective wrapper. It tracks the pointer and owns every CSS variable. Set
  the corner radius here; the rotator and glare inherit it.
- `HoloCardTilt.Rotator` is the element that rotates and scales. Required.
- `HoloCardTilt.Glare` is the pointer-tracked light. Place it last so it sits on top.
- `HoloCardTilt.Layer` lifts content toward the viewer while active. Every element between the
  rotator and a layer needs `transform-style: preserve-3d` (Tailwind `transform-3d`).
- Variants: `variant` (`glare | spotlight | sheen`), `color`
  (`default | accent | success | warning | danger`), `tilt` (`none | sm | md | lg`), `shadow`
  (`none | sm | md | lg`, or `true`).
- It works from Server Components with dot notation and no `"use client"` in the consumer.
- `useHoloCardTilt` drives the same CSS variables on any element.

The full API is in `packages/holo-card-tilt/README.md`.

## Library architecture

All source is in `packages/holo-card-tilt/src`.

| File                       | Role                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `index.tsx`                | Public entry. Assembles the compound component and re-exports. Not a client module.      |
| `holo-card-tilt.tsx`       | Root, Rotator, Glare, and Layer components. Client module.                               |
| `holo-card-tilt.styles.ts` | `holoCardTiltVariants`: `tailwind-variants` slots mapping props to BEM modifier classes. |
| `holo-card-tilt.css`       | All styling, in `@layer components`. Plain CSS with no `@apply`.                         |
| `use-holo-card-tilt.ts`    | Hook that binds a `TiltEngine` to an element. Client module.                             |
| `engine.ts`                | `TiltEngine`: pointer handling, timers, the animation loop, and DOM writes.              |
| `spring.ts`                | Fixed-dimension spring integrator, ticked by the engine.                                 |
| `pointer.ts`               | Pure pointer math: box reads, normalization, angle, distance, edge proximity.            |

How it fits together:

1. The root renders once. Props become either modifier classes (through `holoCardTiltVariants`) or
   inline CSS variables such as `--holo-card-tilt-glare-intensity`.
2. Pointer events reach `TiltEngine`, which sets spring targets.
3. One `requestAnimationFrame` loop ticks two springs (activation and position) and writes the
   runtime variables (`--holo-card-tilt-x`, `-y`, `-opacity`, `-scale`, `-angle`, `-from-center`,
   `-at-edge`) straight to the element with `style.setProperty`. It also toggles `data-active`.
4. CSS turns those variables into the transform, glare, and shadow with `calc()`.

## Invariants

Changes must preserve these.

- **No React renders during animation.** Animated values go to the DOM from the engine. Do not move
  them into state.
- **`index.tsx` stays server-safe.** It must not contain `"use client"`. In a Server Component the
  exports of a client module are opaque references, so `HoloCardTilt.Rotator` would be `undefined`.
  Only `holo-card-tilt.tsx` and `use-holo-card-tilt.ts` are client modules.
  `test/boundaries.test.ts` enforces this.
- **The build preserves module boundaries.** It is `tsc` to ESM, not a bundler; bundling merges
  modules and drops the `"use client"` directives. Relative imports carry explicit `.js`
  extensions.
- **Server output is at rest.** No generated ids, no runtime variables in server markup, no
  hydration mismatch.
- **Names stay distinct from HeroUI Pro's HoloCard.** Pro's stylesheet defines `.holo-card`,
  `.holo-card__*`, and `--holo-card-*`. This package uses `.holo-card-tilt` and
  `--holo-card-tilt-*` so both work in one app. Never introduce a bare `.holo-card` class or a
  `--holo-card-<name>` variable.
- **Motion preferences follow HeroUI.** The nearest `data-reduce-motion` attribute decides
  (`"true"` off, `"false"` on); the OS setting applies only when no ancestor sets one.
- **One runtime dependency:** `tailwind-variants`. Peers: `react`, `react-dom`, `@heroui/styles`.

## Conventions

- HeroUI v3 vocabulary: compound parts with dot notation, `variant` / `color` / sm-md-lg scales,
  `isDisabled`, `data-slot` on every part, `data-active` and `data-disabled` state attributes, BEM
  classes (`.block__element`, `.block--modifier`).
- Variants live in `holo-card-tilt.styles.ts` and only select class names. Behavior lives in CSS
  variables and the engine.
- Colors come from HeroUI theme tokens (`--accent`, `--success`, `--foreground`, …) through
  `oklch(from …)`. No hardcoded brand colors.
- Customization points are CSS variables read with `var(--name, fallback)`, so utilities and inline
  styles override them. Component styles stay in `@layer components`.
- Code style: Prettier (`printWidth` 100, no bracket spacing), strict TypeScript with
  `noUncheckedIndexedAccess`. Comments explain why, not what.
- In the apps, look up HeroUI component APIs before using them; HeroUI v3 uses `onPress`, compound
  anatomy, and specific value shapes. `apps/demo` may use only `@heroui/react`. `apps/docs` may also
  use `@heroui-pro/react`.

## Licensing and attribution

- The project is MIT licensed.
- Code derived from other MIT-licensed work carries a one-line copyright comment directly above it.
  These comments are required by the MIT License. Keep them with the code they annotate when moving
  or refactoring it, and do not remove them.
- Third parties are named only in those comments and in the "Inspired by" section of
  `packages/holo-card-tilt/README.md`.
- `@heroui-pro/react` is proprietary. Never copy its source or CSS into this repository. Follow its
  conventions only.
- `.claude/` and `.agents/` hold licensed HeroUI Pro skills and are gitignored. Never commit them.
  Never commit tokens; `HEROUI_AUTH_TOKEN` and `NPM_TOKEN` live in CI secrets.

## Documentation voice

READMEs, the docs site, and code comments speak in the project's voice and describe the subject.
They do not describe how the work was done, assess their own quality, or address a reviewer.

## Releasing

1. Bump `version` in `packages/holo-card-tilt/package.json`.
2. Commit, then push a `v*` tag. `.github/workflows/release.yml` tests, builds, and publishes with
   provenance. It needs the `NPM_TOKEN` repository secret.

A manual release is `pnpm --filter holo-card-tilt publish --access public`. `prepack` copies
`LICENSE` and `NOTICE` into the package, builds, and runs `publint`.

## Deploying the docs

Vercel project with Root Directory `apps/docs`, Install Command `pnpm install`, Build Command
`cd ../.. && pnpm build && pnpm --filter docs build`, and the `HEROUI_AUTH_TOKEN` environment
variable.
