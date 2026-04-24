"use client";

import { useRef, useState } from "react";

type Props = {
  className?: string;
  width: number;
  height: number;
  /** Decorative when company name is shown next to it */
  decorative?: boolean;
};

/**
 * Tries `public/kawn-logo.png` first, then `public/kawn-logo.svg`.
 * Raster logos must be real PNG/JPEG saved as `.png` — never rename a `.jpg` to `.svg`.
 */
export function KawnLogo({
  className,
  width,
  height,
  decorative = false,
}: Props) {
  const [src, setSrc] = useState("/kawn-logo.png");
  const didFallback = useRef(false);

  return (
    <img
      src={src}
      alt={decorative ? "" : "Kawn"}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (!didFallback.current) {
          didFallback.current = true;
          setSrc("/kawn-logo.svg");
        }
      }}
    />
  );
}
