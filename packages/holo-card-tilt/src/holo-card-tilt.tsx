/*
 * SPDX-License-Identifier: MIT
 */

"use client";

import type {HoloCardTiltVariants} from "./holo-card-tilt.styles.js";
import type {UseHoloCardTiltOptions} from "./use-holo-card-tilt.js";
import type {CSSProperties, ComponentProps, ReactNode, Ref} from "react";

import {createContext, use, useMemo} from "react";

import {holoCardTiltVariants} from "./holo-card-tilt.styles.js";
import {useHoloCardTilt} from "./use-holo-card-tilt.js";

type CSSVariables = Record<`--${string}`, string | number | undefined>;

const composeClassName = (
  slot: ((props?: {className?: string}) => string) | undefined,
  className?: string,
) => (slot ? slot({className}) : className);

/** Combines refs into one callback ref, forwarding React 19 ref cleanup functions. */
const mergeRefs =
  <T,>(...refs: (Ref<T> | undefined)[]) =>
  (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node);

        return typeof cleanup === "function" ? cleanup : () => ref(null);
      }

      if (ref) ref.current = node;

      return () => {
        if (ref) ref.current = null;
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  };

/* -------------------------------------------------------------------------------------------------
 * HoloCardTilt Context
 * -----------------------------------------------------------------------------------------------*/
interface HoloCardTiltContext {
  slots?: ReturnType<typeof holoCardTiltVariants>;
}

const HoloCardTiltContext = createContext<HoloCardTiltContext>({});

/* -------------------------------------------------------------------------------------------------
 * HoloCardTilt Root
 * -----------------------------------------------------------------------------------------------*/
interface HoloCardTiltRootProps
  extends Omit<ComponentProps<"div">, "color">, UseHoloCardTiltOptions {
  children?: ReactNode;
  className?: string;
  /** Shape of the light that follows the pointer. @default "glare" */
  variant?: HoloCardTiltVariants["variant"];
  /** Theme color the glare and shadow are tinted with. @default "default" */
  color?: HoloCardTiltVariants["color"];
  /** How far the element rotates toward the pointer. @default "md" */
  tilt?: HoloCardTiltVariants["tilt"];
  /** Depth of the shadow that shifts with the pointer. `true` is `"md"`. @default "none" */
  shadow?: HoloCardTiltVariants["shadow"] | boolean;
  /**
   * Whether a touch on the element holds the page still, so a drag tilts it instead of scrolling.
   * Pinch-zoom still works. Set to `false` for elements in a scrolling feed, where vertical drags
   * should keep scrolling the page.
   * @default true
   */
  shouldBlockScroll?: boolean;
  /** Multiplies the horizontal rotation set by `tilt`. @default 1 */
  tiltFactor?: number;
  /** Multiplies the vertical rotation set by `tilt`. Defaults to `tiltFactor`. */
  tiltFactorY?: number;
  /** Shadow blur radius in pixels. Sets `--holo-card-tilt-shadow-blur`. */
  shadowBlur?: number;
  /** Shadow strength, where `1` is the default. Sets `--holo-card-tilt-shadow-intensity`. */
  shadowIntensity?: number;
  /** Glare strength, where `1` is the default. Sets `--holo-card-tilt-glare-intensity`. */
  glareIntensity?: number;
  /** Hue (`0`–`360`) of the glare when `color` is `"default"`. Sets `--holo-card-tilt-glare-hue`. */
  glareHue?: number;
  /** `mix-blend-mode` of the glare. Sets `--holo-card-tilt-blend-mode`. */
  blendMode?: CSSProperties["mixBlendMode"];
  /** CSS `mask-image` confining the glare. Sets `--holo-card-tilt-glare-mask`. */
  glareMask?: string;
  /** CSS `mask-mode` for `glareMask`. Sets `--holo-card-tilt-glare-mask-mode`. */
  glareMaskMode?: "match-source" | "luminance" | "alpha";
  /** CSS `mask-composite` for `glareMask`. Sets `--holo-card-tilt-glare-mask-composite`. */
  glareMaskComposite?: "add" | "subtract" | "exclude" | "intersect";
}

const HoloCardTiltRoot = ({
  blendMode,
  children,
  className,
  color,
  enterDelay,
  exitDelay,
  glareHue,
  glareIntensity,
  glareMask,
  glareMaskComposite,
  glareMaskMode,
  isDisabled = false,
  onActiveChange,
  onPointerCancel,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  ref,
  scaleFactor,
  shadow = "none",
  shadowBlur,
  shadowIntensity,
  shouldBlockScroll,
  springOptions,
  style,
  tilt,
  tiltFactor,
  tiltFactorY,
  tiltSpringOptions,
  variant,
  ...props
}: HoloCardTiltRootProps) => {
  const resolvedShadow = shadow === true ? "md" : shadow === false ? "none" : shadow;

  const slots = useMemo(
    () => holoCardTiltVariants({color, shadow: resolvedShadow, tilt, variant, shouldBlockScroll}),
    [color, resolvedShadow, tilt, variant, shouldBlockScroll],
  );
  const contextValue = useMemo(() => ({slots}), [slots]);

  const {pointerProps, ref: tiltRef} = useHoloCardTilt({
    enterDelay,
    exitDelay,
    isDisabled,
    onActiveChange,
    scaleFactor,
    springOptions,
    tiltSpringOptions,
  });

  const mergedRef = useMemo(() => mergeRefs(tiltRef, ref), [tiltRef, ref]);

  const variables: CSSVariables = {
    "--holo-card-tilt-factor-x": tiltFactor,
    "--holo-card-tilt-factor-y": tiltFactorY ?? tiltFactor,
    "--holo-card-tilt-shadow-blur": shadowBlur,
    "--holo-card-tilt-shadow-intensity": shadowIntensity,
    "--holo-card-tilt-glare-intensity": glareIntensity,
    "--holo-card-tilt-glare-hue": glareHue,
    "--holo-card-tilt-blend-mode": blendMode,
    "--holo-card-tilt-glare-mask": glareMask,
    "--holo-card-tilt-glare-mask-mode": glareMaskMode,
    "--holo-card-tilt-glare-mask-composite": glareMaskComposite,
  };

  return (
    <HoloCardTiltContext value={contextValue}>
      <div
        {...props}
        ref={mergedRef}
        className={composeClassName(slots.base, className)}
        data-disabled={isDisabled ? "true" : undefined}
        data-slot="holo-card-tilt"
        style={{...variables, ...style} as CSSProperties}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          pointerProps.onPointerCancel();
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          pointerProps.onPointerEnter(event);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          pointerProps.onPointerLeave();
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          pointerProps.onPointerMove(event);
        }}
      >
        {children}
      </div>
    </HoloCardTiltContext>
  );
};

/* -------------------------------------------------------------------------------------------------
 * HoloCardTilt Rotator
 * -----------------------------------------------------------------------------------------------*/
interface HoloCardTiltRotatorProps extends ComponentProps<"div"> {
  children?: ReactNode;
  className?: string;
}

const HoloCardTiltRotator = ({className, ...props}: HoloCardTiltRotatorProps) => {
  const {slots} = use(HoloCardTiltContext);

  return (
    <div
      className={composeClassName(slots?.rotator, className)}
      data-slot="holo-card-tilt-rotator"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------------------------------
 * HoloCardTilt Glare
 * -----------------------------------------------------------------------------------------------*/
interface HoloCardTiltGlareProps extends ComponentProps<"div"> {
  children?: ReactNode;
  className?: string;
}

const HoloCardTiltGlare = ({className, ...props}: HoloCardTiltGlareProps) => {
  const {slots} = use(HoloCardTiltContext);

  return (
    <div
      aria-hidden="true"
      className={composeClassName(slots?.glare, className)}
      data-slot="holo-card-tilt-glare"
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------------------------------
 * HoloCardTilt Layer
 * -----------------------------------------------------------------------------------------------*/
interface HoloCardTiltLayerProps extends ComponentProps<"div"> {
  children?: ReactNode;
  className?: string;
  /** Distance in pixels the layer lifts toward the viewer while active. @default 24 */
  depth?: number;
}

const HoloCardTiltLayer = ({className, depth, style, ...props}: HoloCardTiltLayerProps) => {
  const {slots} = use(HoloCardTiltContext);
  const variables: CSSVariables = {
    "--holo-card-tilt-layer-depth": depth === undefined ? undefined : `${depth}px`,
  };

  return (
    <div
      className={composeClassName(slots?.layer, className)}
      data-slot="holo-card-tilt-layer"
      style={{...variables, ...style} as CSSProperties}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {HoloCardTiltRoot, HoloCardTiltRotator, HoloCardTiltGlare, HoloCardTiltLayer};

export type {
  HoloCardTiltRootProps,
  HoloCardTiltRotatorProps,
  HoloCardTiltGlareProps,
  HoloCardTiltLayerProps,
};
