import type {ApiRow} from "@/components/api-table";

export const ROOT_PROPS: ApiRow[] = [
  {
    name: "variant",
    type: '"glare" | "spotlight" | "sheen"',
    defaultValue: '"glare"',
    description: "Shape of the light that follows the pointer.",
  },
  {
    name: "color",
    type: '"default" | "accent" | "success" | "warning" | "danger"',
    defaultValue: '"default"',
    description: "Theme color the glare and shadow are tinted with.",
  },
  {
    name: "tilt",
    type: '"none" | "sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "How far the element rotates toward the pointer.",
  },
  {
    name: "shadow",
    type: '"none" | "sm" | "md" | "lg" | boolean',
    defaultValue: '"none"',
    description: 'Depth of the shadow that shifts with the pointer. true is "md".',
  },
  {
    name: "tiltFactor",
    type: "number",
    defaultValue: "1",
    description: "Multiplies the horizontal rotation set by tilt.",
  },
  {
    name: "tiltFactorY",
    type: "number",
    defaultValue: "tiltFactor",
    description: "Multiplies the vertical rotation.",
  },
  {
    name: "scaleFactor",
    type: "number",
    defaultValue: "1",
    description: "Scale applied while active.",
  },
  {
    name: "springOptions",
    type: "SpringOptions",
    defaultValue: "{stiffness: 0.2, damping: 0.8}",
    description: "Physics for the glare, shadow, and scale.",
  },
  {
    name: "tiltSpringOptions",
    type: "SpringOptions",
    defaultValue: "springOptions",
    description: "Physics for the rotation.",
  },
  {
    name: "enterDelay",
    type: "number",
    defaultValue: "0",
    description: "Milliseconds the pointer must stay inside before the effect starts.",
  },
  {
    name: "exitDelay",
    type: "number",
    defaultValue: "200",
    description: "Milliseconds after the pointer leaves before returning to rest.",
  },
  {
    name: "isDisabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables pointer tracking, leaving the element flat and unlit.",
  },
  {
    name: "onActiveChange",
    type: "(isActive: boolean) => void",
    description: "Called when the element becomes active or returns to rest.",
  },
  {name: "glareIntensity", type: "number", defaultValue: "1", description: "Glare strength."},
  {
    name: "glareHue",
    type: "number",
    defaultValue: "270",
    description: 'Glare hue when color is "default".',
  },
  {
    name: "blendMode",
    type: "mix-blend-mode",
    defaultValue: '"overlay"',
    description: "Blend mode of the glare.",
  },
  {
    name: "shadowBlur",
    type: "number",
    description: "Shadow blur in pixels. Overrides the shadow size.",
  },
  {
    name: "shadowIntensity",
    type: "number",
    defaultValue: "1",
    description: "Shadow strength.",
  },
  {name: "glareMask", type: "string", description: "CSS mask-image confining the glare."},
  {
    name: "glareMaskMode",
    type: '"match-source" | "luminance" | "alpha"',
    defaultValue: '"match-source"',
    description: "CSS mask-mode for glareMask.",
  },
  {
    name: "glareMaskComposite",
    type: '"add" | "subtract" | "exclude" | "intersect"',
    defaultValue: '"add"',
    description: "CSS mask-composite for glareMask.",
  },
];

export const LAYER_PROPS: ApiRow[] = [
  {
    name: "depth",
    type: "number",
    defaultValue: "24",
    description: "Pixels the layer lifts toward the viewer while active.",
  },
];

export const CSS_VARIABLES: ApiRow[] = [
  {
    name: "--holo-card-tilt-perspective",
    type: "length",
    defaultValue: "600px",
    description: "3D perspective depth.",
  },
  {
    name: "--holo-card-tilt-rotation",
    type: "angle",
    defaultValue: "10deg",
    description: "Maximum rotation. Set by tilt.",
  },
  {
    name: "--holo-card-tilt-color",
    type: "color",
    defaultValue: "set by color",
    description: "Base color of the glare.",
  },
  {
    name: "--holo-card-tilt-shadow-color",
    type: "color",
    defaultValue: "black",
    description: "Shadow color. Set by color.",
  },
  {
    name: "--holo-card-tilt-shadow-opacity",
    type: "number",
    defaultValue: "0.125, 0.5 in dark mode",
    description: "Shadow opacity at full activation.",
  },
  {
    name: "--holo-card-tilt-custom-gradient",
    type: "image",
    description: "Replaces the glare background-image.",
  },
  {
    name: "--holo-card-tilt-custom-shadow",
    type: "shadow",
    description: "Replaces the rotator box-shadow.",
  },
];

export const RUNTIME_VARIABLES: ApiRow[] = [
  {
    name: "--holo-card-tilt-x",
    type: "0 – 1",
    defaultValue: "0.5",
    description: "Pointer position from the left edge.",
  },
  {
    name: "--holo-card-tilt-y",
    type: "0 – 1",
    defaultValue: "0.5",
    description: "Pointer position from the top edge.",
  },
  {
    name: "--holo-card-tilt-opacity",
    type: "0 – 1",
    defaultValue: "0",
    description: "Activation of the effect.",
  },
  {
    name: "--holo-card-tilt-scale",
    type: "number",
    defaultValue: "1",
    description: "Current scale.",
  },
  {
    name: "--holo-card-tilt-angle",
    type: "0deg – 360deg",
    defaultValue: "0deg",
    description: "Clockwise angle from the center to the pointer.",
  },
  {
    name: "--holo-card-tilt-from-center",
    type: "length",
    defaultValue: "0px",
    description: "Distance from the center to the pointer.",
  },
  {
    name: "--holo-card-tilt-at-edge",
    type: "0 – 1",
    defaultValue: "0",
    description: "Proximity of the pointer to the nearest edge.",
  },
  {
    name: "--holo-card-tilt-gradient-x",
    type: "percentage",
    defaultValue: "50%",
    description: "--holo-card-tilt-x as a percentage.",
  },
  {
    name: "--holo-card-tilt-gradient-y",
    type: "percentage",
    defaultValue: "50%",
    description: "--holo-card-tilt-y as a percentage.",
  },
];
