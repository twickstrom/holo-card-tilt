/*
 * SPDX-License-Identifier: MIT
 */

import type {VariantProps} from "tailwind-variants";

import {tv} from "tailwind-variants";

export const holoCardTiltVariants = tv({
  slots: {
    base: "holo-card-tilt",
    rotator: "holo-card-tilt__rotator",
    glare: "holo-card-tilt__glare",
    layer: "holo-card-tilt__layer",
  },
  variants: {
    /** Shape of the light that follows the pointer. */
    variant: {
      glare: {base: "holo-card-tilt--glare"},
      spotlight: {base: "holo-card-tilt--spotlight"},
      sheen: {base: "holo-card-tilt--sheen"},
    },
    /** Theme color the glare and shadow are tinted with. */
    color: {
      default: {base: "holo-card-tilt--default"},
      accent: {base: "holo-card-tilt--accent"},
      success: {base: "holo-card-tilt--success"},
      warning: {base: "holo-card-tilt--warning"},
      danger: {base: "holo-card-tilt--danger"},
    },
    /** How far the element rotates toward the pointer. */
    tilt: {
      none: {base: "holo-card-tilt--tilt-none"},
      sm: {base: "holo-card-tilt--tilt-sm"},
      md: {base: "holo-card-tilt--tilt-md"},
      lg: {base: "holo-card-tilt--tilt-lg"},
    },
    /** Depth of the shadow that shifts with the pointer. */
    shadow: {
      none: {},
      sm: {base: "holo-card-tilt--shadow holo-card-tilt--shadow-sm"},
      md: {base: "holo-card-tilt--shadow holo-card-tilt--shadow-md"},
      lg: {base: "holo-card-tilt--shadow holo-card-tilt--shadow-lg"},
    },
  },
  defaultVariants: {
    variant: "glare",
    color: "default",
    tilt: "md",
    shadow: "none",
  },
});

export type HoloCardTiltVariants = VariantProps<typeof holoCardTiltVariants>;
