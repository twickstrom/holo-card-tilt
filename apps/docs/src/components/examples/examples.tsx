import type {CSSProperties} from "react";

import {Card, Chip} from "@heroui/react";
import {HoloCardTilt} from "holo-card-tilt";

import {Tile} from "./tile";

/* -------------------------------------------------------------------------------------------------
 * Hero
 * -----------------------------------------------------------------------------------------------*/
export function HeroExample() {
  return (
    <HoloCardTilt
      className="rounded-[2rem]"
      color="accent"
      scaleFactor={1.04}
      shadow="lg"
      tilt="lg"
    >
      <HoloCardTilt.Rotator>
        <Tile className="h-96 w-72 justify-between rounded-[2rem] p-7 transform-3d">
          <HoloCardTilt.Layer depth={40}>
            <Chip className="bg-white/15 text-white backdrop-blur" size="sm">
              React 19 · Next.js 16
            </Chip>
          </HoloCardTilt.Layer>
          <HoloCardTilt.Layer className="flex flex-col gap-1" depth={60}>
            <span className="text-3xl leading-none font-semibold">Holo Card Tilt</span>
            <span className="text-sm font-normal text-white/70">Move your pointer</span>
          </HoloCardTilt.Layer>
        </Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Usage
 * -----------------------------------------------------------------------------------------------*/
export const usageCode = `import {Card} from "@heroui/react";
import {HoloCardTilt} from "holo-card-tilt";

export function TiltedCard() {
  return (
    <HoloCardTilt className="w-80 rounded-3xl" shadow="md">
      <HoloCardTilt.Rotator>
        <Card className="rounded-3xl">
          <Card.Header>
            <Card.Title>Quarterly report</Card.Title>
            <Card.Description>Revenue grew 18% over the previous quarter.</Card.Description>
          </Card.Header>
        </Card>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}`;

export function UsageExample() {
  return (
    <HoloCardTilt className="w-80 rounded-3xl" shadow="md">
      <HoloCardTilt.Rotator>
        <Card className="rounded-3xl">
          <Card.Header>
            <Card.Title>Quarterly report</Card.Title>
            <Card.Description>Revenue grew 18% over the previous quarter.</Card.Description>
          </Card.Header>
        </Card>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
const VARIANTS = ["glare", "spotlight", "sheen"] as const;

export const variantCode = `<HoloCardTilt variant="glare" />
<HoloCardTilt variant="spotlight" />
<HoloCardTilt variant="sheen" />`;

export function VariantExample() {
  return VARIANTS.map((variant) => (
    <HoloCardTilt key={variant} className="rounded-3xl" variant={variant}>
      <HoloCardTilt.Rotator>
        <Tile>{variant}</Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  ));
}

const COLORS = ["default", "accent", "success", "warning", "danger"] as const;

export const colorCode = `<HoloCardTilt color="default" shadow="lg" />
<HoloCardTilt color="accent" shadow="lg" />
<HoloCardTilt color="success" shadow="lg" />
<HoloCardTilt color="warning" shadow="lg" />
<HoloCardTilt color="danger" shadow="lg" />`;

export function ColorExample() {
  return COLORS.map((color) => (
    <HoloCardTilt key={color} className="rounded-3xl" color={color} shadow="lg">
      <HoloCardTilt.Rotator>
        <Tile color={color}>{color}</Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  ));
}

const SIZES = ["sm", "md", "lg"] as const;

export const tiltCode = `<HoloCardTilt tilt="sm" />
<HoloCardTilt tilt="md" />
<HoloCardTilt tilt="lg" />`;

export function TiltExample() {
  return SIZES.map((size) => (
    <HoloCardTilt key={size} className="rounded-3xl" tilt={size}>
      <HoloCardTilt.Rotator>
        <Tile>{size}</Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  ));
}

export const shadowCode = `<HoloCardTilt shadow="sm" />
<HoloCardTilt shadow="md" />
<HoloCardTilt shadow="lg" />`;

export function ShadowExample() {
  return SIZES.map((size) => (
    <HoloCardTilt key={size} className="rounded-3xl" shadow={size}>
      <HoloCardTilt.Rotator>
        <Tile color="default">{size}</Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  ));
}

/* -------------------------------------------------------------------------------------------------
 * Recipes
 * -----------------------------------------------------------------------------------------------*/
export const layerCode = `<HoloCardTilt className="rounded-3xl" scaleFactor={1.05} tilt="lg">
  <HoloCardTilt.Rotator>
    <Tile className="h-56 w-56 items-center justify-center transform-3d">
      <HoloCardTilt.Layer depth={30}>
        <div className="size-32 rounded-2xl bg-white/15" />
      </HoloCardTilt.Layer>
      <HoloCardTilt.Layer className="absolute" depth={80}>
        <span className="text-2xl font-semibold">Depth</span>
      </HoloCardTilt.Layer>
    </Tile>
    <HoloCardTilt.Glare />
  </HoloCardTilt.Rotator>
</HoloCardTilt>`;

export function LayerExample() {
  return (
    <HoloCardTilt className="rounded-3xl" scaleFactor={1.05} tilt="lg">
      <HoloCardTilt.Rotator>
        <Tile className="h-56 w-56 items-center justify-center transform-3d">
          <HoloCardTilt.Layer depth={30}>
            <div className="size-32 rounded-2xl bg-white/15" />
          </HoloCardTilt.Layer>
          <HoloCardTilt.Layer className="absolute" depth={80}>
            <span className="text-2xl font-semibold">Depth</span>
          </HoloCardTilt.Layer>
        </Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}

const PRISM = {
  "--holo-card-tilt-custom-gradient": `conic-gradient(
    from var(--holo-card-tilt-angle) at var(--holo-card-tilt-gradient-x) var(--holo-card-tilt-gradient-y),
    var(--accent), var(--success), var(--warning), var(--danger), var(--accent))`,
} as CSSProperties;

export const gradientCode = `const PRISM = {
  "--holo-card-tilt-custom-gradient": \`conic-gradient(
    from var(--holo-card-tilt-angle) at var(--holo-card-tilt-gradient-x) var(--holo-card-tilt-gradient-y),
    var(--accent), var(--success), var(--warning), var(--danger), var(--accent))\`,
} as CSSProperties;

<HoloCardTilt blendMode="soft-light" className="rounded-3xl" style={PRISM}>
  …
</HoloCardTilt>`;

export function GradientExample() {
  return (
    <HoloCardTilt blendMode="soft-light" className="rounded-3xl" style={PRISM}>
      <HoloCardTilt.Rotator>
        <Tile className="h-56 w-56" color="default">
          Theme prism
        </Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}

const STRIPES = "repeating-linear-gradient(45deg, black 0 6px, transparent 6px 14px)";

export const maskCode = `const STRIPES = "repeating-linear-gradient(45deg, black 0 6px, transparent 6px 14px)";

<HoloCardTilt
  blendMode="plus-lighter"
  className="rounded-3xl"
  glareIntensity={1.5}
  glareMask={STRIPES}
  variant="spotlight"
>
  …
</HoloCardTilt>`;

export function MaskExample() {
  return (
    <HoloCardTilt
      blendMode="plus-lighter"
      className="rounded-3xl"
      glareIntensity={1.5}
      glareMask={STRIPES}
      variant="spotlight"
    >
      <HoloCardTilt.Rotator>
        <Tile className="h-56 w-56">Masked glare</Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}

export const stateCode = `<HoloCardTilt className="rounded-3xl transition-[filter] duration-300 data-[active=true]:saturate-150">
  …
</HoloCardTilt>`;

export function StateExample() {
  return (
    <HoloCardTilt className="rounded-3xl saturate-50 transition-[filter] duration-300 data-[active=true]:saturate-150">
      <HoloCardTilt.Rotator>
        <Tile className="h-56 w-56" color="success">
          data-active
        </Tile>
        <HoloCardTilt.Glare />
      </HoloCardTilt.Rotator>
    </HoloCardTilt>
  );
}
