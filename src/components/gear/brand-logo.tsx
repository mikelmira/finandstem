import { brandLogo } from "@/data/suppliers";
import { cn } from "@/lib/utils";

/**
 * A brand's official logo at a fixed height, or nothing if we don't have one.
 * Plain <img> because logos are tiny static files (SVG or small webp).
 */
export function BrandLogo({
  brand,
  className,
  eager = false,
}: {
  brand: string;
  className?: string;
  /** Above-the-fold logos load straight away. */
  eager?: boolean;
}) {
  const logo = brandLogo(brand);
  if (!logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={`${brand} logo`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-7 w-auto max-w-[9rem] object-contain object-left", className)}
    />
  );
}
