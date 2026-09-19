import type {CSSProperties, ReactNode} from "react";

import {twMerge} from "tailwind-merge";

interface TileProps {
  children?: ReactNode;
  className?: string;
  /** Theme color token the tile's gradient is built from. */
  color?: "accent" | "success" | "warning" | "danger" | "default";
}

/** A colorful surface for examples. Glare blends with what is beneath it, so color shows it best. */
export function Tile({children, className, color = "accent"}: TileProps) {
  const base = color === "default" ? "var(--surface-tertiary)" : `var(--${color})`;
  const style = {
    background: `linear-gradient(140deg, ${base}, oklch(from ${base} calc(l - 0.22) c calc(h + 35)))`,
  } as CSSProperties;

  return (
    <div
      className={twMerge(
        "flex h-44 w-36 flex-col justify-end rounded-3xl p-4 text-sm font-medium text-white",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
