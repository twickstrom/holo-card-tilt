/*
 * SPDX-License-Identifier: MIT
 */

import type {HoloCardTiltRootProps} from "./holo-card-tilt.js";
import type {ComponentProps} from "react";

import {
  HoloCardTiltGlare,
  HoloCardTiltLayer,
  HoloCardTiltRoot,
  HoloCardTiltRotator,
} from "./holo-card-tilt.js";

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/

// This module is deliberately not a client module. In a Server Component, the exports of a
// client module are opaque references whose properties cannot be read, so the parts are attached
// to a plain component here to keep `HoloCardTilt.Rotator` available on the server.
const HoloCardTiltComponent = (props: HoloCardTiltRootProps) => <HoloCardTiltRoot {...props} />;

HoloCardTiltComponent.displayName = "HoloCardTilt";

export const HoloCardTilt = Object.assign(HoloCardTiltComponent, {
  Root: HoloCardTiltRoot,
  Rotator: HoloCardTiltRotator,
  Glare: HoloCardTiltGlare,
  Layer: HoloCardTiltLayer,
});

export type HoloCardTilt = {
  Props: ComponentProps<typeof HoloCardTiltRoot>;
  RootProps: ComponentProps<typeof HoloCardTiltRoot>;
  RotatorProps: ComponentProps<typeof HoloCardTiltRotator>;
  GlareProps: ComponentProps<typeof HoloCardTiltGlare>;
  LayerProps: ComponentProps<typeof HoloCardTiltLayer>;
};

/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {HoloCardTiltRoot, HoloCardTiltRotator, HoloCardTiltGlare, HoloCardTiltLayer};

export type {
  HoloCardTiltRootProps,
  HoloCardTiltRootProps as HoloCardTiltProps,
  HoloCardTiltRotatorProps,
  HoloCardTiltGlareProps,
  HoloCardTiltLayerProps,
} from "./holo-card-tilt.js";

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export {holoCardTiltVariants} from "./holo-card-tilt.styles.js";

export type {HoloCardTiltVariants} from "./holo-card-tilt.styles.js";

/* -------------------------------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------------------------*/
export {useHoloCardTilt} from "./use-holo-card-tilt.js";

export type {UseHoloCardTiltOptions, UseHoloCardTiltResult} from "./use-holo-card-tilt.js";
export type {SpringOptions} from "./spring.js";
