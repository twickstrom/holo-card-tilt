import {buttonVariants} from "@heroui/styles";

import {ApiTable} from "@/components/api-table";
import {Code} from "@/components/code";
import {Example} from "@/components/example";
import {InstallTabs} from "@/components/install-tabs";
import {
  ColorExample,
  GradientExample,
  HeroExample,
  LayerExample,
  MaskExample,
  ShadowExample,
  StateExample,
  TiltExample,
  UsageExample,
  VariantExample,
  colorCode,
  gradientCode,
  layerCode,
  maskCode,
  shadowCode,
  stateCode,
  tiltCode,
  usageCode,
  variantCode,
} from "@/components/examples/examples";
import {HookExample, hookCode} from "@/components/examples/hook-example";
import {Section, SubSection} from "@/components/section";
import {SiteNavbar} from "@/components/site-navbar";
import {CSS_VARIABLES, LAYER_PROPS, ROOT_PROPS, RUNTIME_VARIABLES} from "@/lib/api";
import {GITHUB_URL} from "@/lib/site";

const cssCode = `@import "tailwindcss";
@import "@heroui/styles";
@import "holo-card-tilt/css";`;

const anatomyCode = `import {HoloCardTilt} from "holo-card-tilt";

<HoloCardTilt>
  <HoloCardTilt.Rotator>
    {/* your content */}
    <HoloCardTilt.Layer />
    <HoloCardTilt.Glare />
  </HoloCardTilt.Rotator>
</HoloCardTilt>`;

const extendCode = `import {tv} from "@heroui/styles";
import {HoloCardTilt, holoCardTiltVariants} from "holo-card-tilt";

const tiltVariants = tv({
  extend: holoCardTiltVariants,
  variants: {
    tilt: {xl: {base: "[--holo-card-tilt-rotation:28deg]"}},
  },
});

const {base} = tiltVariants({tilt: "xl"});

<HoloCardTilt className={base()}>…</HoloCardTilt>`;

export default function Page() {
  return (
    <>
      <SiteNavbar />
      <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6 pt-16 pb-24" id="top">
        <header className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Tilt anything toward the pointer
            </h1>
            <p className="text-muted max-w-xl text-lg">
              A tilt, glare, and shadow hover effect for React 19 and Next.js 16. Compound parts,
              variants, and theme tokens, in the conventions of HeroUI v3.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className={buttonVariants({variant: "primary"})} href="#installation">
                Get Started
              </a>
              <a className={buttonVariants({variant: "outline"})} href={GITHUB_URL}>
                GitHub
              </a>
            </div>
          </div>
          <div className="flex justify-center md:px-8">
            <HeroExample />
          </div>
        </header>

        <Section
          description="Requires React 19, Tailwind CSS v4, and @heroui/styles 3 or later."
          id="installation"
          title="Installation"
        >
          <InstallTabs packages="holo-card-tilt" />
          <p className="text-muted max-w-2xl">Import the stylesheet after HeroUI&apos;s.</p>
          <Code code={cssCode} language="css" title="globals.css" />
        </Section>

        <Section
          description="Wrap any content in a rotator and add a glare. HoloCardTilt renders from Server Components, and its children can be Server Components."
          id="usage"
          title="Usage"
        >
          <Example code={usageCode}>
            <UsageExample />
          </Example>
          <SubSection
            description="HoloCardTilt tracks the pointer and owns every CSS variable. Rotator is the element that turns. Glare is the light, placed last so it sits on top. Layer lifts content toward the viewer. Set the corner radius on HoloCardTilt; the rotator and glare inherit it."
            title="Anatomy"
          >
            <Code code={anatomyCode} />
          </SubSection>
        </Section>

        <Section
          description="Every variant is a tailwind-variants slot backed by a BEM class, so they extend and override the same way HeroUI components do."
          id="variants"
          title="Variants"
        >
          <SubSection
            description="The shape of the light that follows the pointer."
            title="Variant"
          >
            <Example code={variantCode}>
              <VariantExample />
            </Example>
          </SubSection>
          <SubSection
            description="The glare and shadow take their tint from your theme tokens, in light mode, dark mode, and custom design systems."
            title="Color"
          >
            <Example code={colorCode}>
              <ColorExample />
            </Example>
          </SubSection>
          <SubSection
            description="How far the element rotates. tiltFactor multiplies it."
            title="Tilt"
          >
            <Example code={tiltCode}>
              <TiltExample />
            </Example>
          </SubSection>
          <SubSection
            description="A shadow that shifts with the pointer and fades in with the effect. It is tinted by color, and --holo-card-tilt-shadow-color sets it to any color."
            title="Shadow"
          >
            <Example code={shadowCode}>
              <ShadowExample />
            </Example>
          </SubSection>
          <SubSection
            description="holoCardTiltVariants is exported for use with tv."
            title="Extending"
          >
            <Code code={extendCode} />
          </SubSection>
        </Section>

        <Section id="recipes" title="Recipes">
          <SubSection
            description="Layers lift toward the viewer as the effect activates. Elements between the rotator and a layer need transform-3d."
            title="Depth"
          >
            <Example code={layerCode}>
              <LayerExample />
            </Example>
          </SubSection>
          <SubSection
            description="Replace the glare with any background built from the pointer variables."
            title="Custom Gradient"
          >
            <Example code={gradientCode}>
              <GradientExample />
            </Example>
          </SubSection>
          <SubSection
            description="Confine the glare to a pattern, a logo, or the foil areas of a card with any CSS mask-image."
            title="Glare Mask"
          >
            <Example code={maskCode}>
              <MaskExample />
            </Example>
          </SubSection>
          <SubSection
            description="data-active is set while the effect runs. Style against it with Tailwind's data variant."
            title="Active State"
          >
            <Example code={stateCode}>
              <StateExample />
            </Example>
          </SubSection>
          <SubSection
            description="The hook behind HoloCardTilt drives the same CSS variables on any element."
            title="useHoloCardTilt"
          >
            <Example code={hookCode}>
              <HookExample />
            </Example>
          </SubSection>
        </Section>

        <Section id="api" title="API">
          <SubSection description="Also supports all native div attributes." title="HoloCardTilt">
            <ApiTable label="HoloCardTilt props" rows={ROOT_PROPS} />
          </SubSection>
          <SubSection title="HoloCardTilt.Layer">
            <ApiTable label="HoloCardTilt.Layer props" rows={LAYER_PROPS} />
          </SubSection>
          <SubSection
            description="Set these on HoloCardTilt to restyle it without overriding classes."
            title="CSS Variables"
          >
            <ApiTable
              label="CSS variables"
              nameHeading="Variable"
              rows={CSS_VARIABLES}
              typeHeading="Value"
            />
          </SubSection>
          <SubSection
            description="Driven by the pointer and read-only. Use them in custom gradients, shadows, and transforms."
            title="Runtime Variables"
          >
            <ApiTable
              label="Runtime variables"
              nameHeading="Variable"
              rows={RUNTIME_VARIABLES}
              typeHeading="Range"
            />
          </SubSection>
        </Section>
      </main>
      <footer className="text-muted mx-auto max-w-5xl px-6 pb-12 text-sm">MIT</footer>
    </>
  );
}
