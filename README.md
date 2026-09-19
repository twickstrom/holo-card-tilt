# holo-card-tilt

[![npm version](https://img.shields.io/npm/v/holo-card-tilt?style=flat-square&color=black)](https://www.npmjs.com/package/holo-card-tilt)
[![tests](https://img.shields.io/github/actions/workflow/status/twickstrom/holo-card-tilt/ci.yml?branch=main&style=flat-square&label=tests)](https://github.com/twickstrom/holo-card-tilt/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/holo-card-tilt?style=flat-square)](https://www.npmjs.com/package/holo-card-tilt)
[![license](https://img.shields.io/npm/l/holo-card-tilt?style=flat-square&color=black)](./LICENSE)

![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

A tilt, glare, and shadow hover effect for React 19 and Next.js 16, built to
[HeroUI v3](https://heroui.com) conventions.

**[Demo and documentation](https://timwickstrom.com/projects/holo-card-tilt)**

```tsx
import {HoloCardTilt} from "holo-card-tilt";

<HoloCardTilt className="rounded-3xl" color="accent" shadow="md">
  <HoloCardTilt.Rotator>
    <Card>…</Card>
    <HoloCardTilt.Glare />
  </HoloCardTilt.Rotator>
</HoloCardTilt>;
```

Package documentation: [packages/holo-card-tilt](./packages/holo-card-tilt#readme).

## Repository

| Path                      | Contents                                                                    |
| ------------------------- | --------------------------------------------------------------------------- |
| `packages/holo-card-tilt` | The library, published to npm as `holo-card-tilt`.                          |
| `apps/demo`               | A Next.js 16 playground. Builds from public packages only.                  |
| `apps/docs`               | The documentation site. Uses `@heroui-pro/react`, which requires a license. |

## Development

Requires Node.js 20.9 or later and pnpm 9.

```bash
pnpm install
pnpm dev:demo   # library in watch mode + playground on http://localhost:3000
pnpm dev:docs   # library in watch mode + documentation on http://localhost:3001
pnpm test
```

To work without a HeroUI Pro license, install everything except the docs app:

```bash
pnpm install --filter "!docs"
```

### Documentation site

`apps/docs` installs `@heroui-pro/react`. Locally, authenticate once with
`npx heroui-pro@latest login`. In CI and on Vercel, set `HEROUI_AUTH_TOKEN` to a HeroUI Pro CI/CD
token.

Vercel project settings:

| Setting         | Value                                                |
| --------------- | ---------------------------------------------------- |
| Root Directory  | `apps/docs`                                          |
| Build Command   | `cd ../.. && pnpm build && pnpm --filter docs build` |
| Install Command | `pnpm install`                                       |

The site is published at https://timwickstrom.com/projects/holo-card-tilt. Set the
`DOCS_BASE_PATH` environment variable to `/projects/holo-card-tilt` so the app serves from that path,
and route that path to the deployment from the host of `timwickstrom.com`.

For a host with no Node.js server, build a static site instead:

```bash
pnpm build
DOCS_EXPORT=1 DOCS_BASE_PATH=/projects/holo-card-tilt pnpm --filter docs build
```

The output is `apps/docs/out`. Serve its contents from `/projects/holo-card-tilt/`.

### Releasing

Bump the version in `packages/holo-card-tilt/package.json`, then push a `v*` tag. The Release
workflow tests, builds, and publishes to npm with provenance. It requires an `NPM_TOKEN`
repository secret.

## License

[MIT](./LICENSE)
