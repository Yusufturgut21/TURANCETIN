import Image, { type ImageProps } from "next/image";

function shouldSkipOptimize(src: string): boolean {
  return (
    src.includes("images.unsplash.com") ||
    src.includes("placehold.co") ||
    src.startsWith("/placeholder")
  );
}

type Props = ImageProps & {
  /** width/height CSS çakışmasını engelle (marka logoları vb.) */
  keepAspect?: boolean;
};

/**
 * Unsplash/placehold görsellerinde Next optimizer timeout'unu önler.
 * fill kullanırken varsayılan sizes ekler.
 */
export function SmartImage({
  src,
  keepAspect,
  className,
  style,
  sizes,
  fill,
  ...rest
}: Props) {
  const srcStr = typeof src === "string" ? src : "";
  const unoptimized =
    rest.unoptimized ?? (srcStr ? shouldSkipOptimize(srcStr) : false);

  return (
    <Image
      src={src}
      fill={fill}
      sizes={fill ? sizes || "(max-width: 768px) 100vw, 50vw" : sizes}
      unoptimized={unoptimized}
      className={className}
      style={
        keepAspect
          ? { width: "auto", height: "auto", ...style }
          : style
      }
      {...rest}
    />
  );
}
