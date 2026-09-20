import Image from "next/image";
import { forwardRef } from "react";

type FloralLayerProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /** actual on-screen width (e.g. "(min-width: 640px) 128px, 96px") — lets
   * next/image request a properly small file instead of one sized for the
   * full source resolution passed via width/height. */
  sizes?: string;
};

/**
 * A single decorative botanical layer — one subtle corner accent per
 * section. Kept as its own DOM node — not merged into a background image —
 * so it can be targeted individually with GSAP.
 */
const FloralLayer = forwardRef<HTMLImageElement, FloralLayerProps>(
  ({ src, alt = "", width, height, className, priority, sizes }, ref) => {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        aria-hidden={alt === "" ? true : undefined}
        className={className}
      />
    );
  }
);

FloralLayer.displayName = "FloralLayer";

export default FloralLayer;
