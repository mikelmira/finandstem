import { getProduct, anyLinked, type Product } from "@/data/products";

interface ProductNoteProps {
  /** Product ids from the registry, in the order they should appear. */
  productIds: string[];
  /** Context-specific heading, e.g. "Targeted treatments" or "Ready-made dosing". */
  heading?: string;
  className?: string;
}

/**
 * An understated editorial note that recommends products where they genuinely
 * help with what the page is teaching. It reads as guidance, not an advert: a
 * quiet eyebrow, the product name, and a plain sentence on what it does. Links
 * appear only once a product has a real (affiliate) URL; until then the name is
 * plain text so the recommendation still stands.
 */
export function ProductNote({
  productIds,
  heading = "Products that can help",
  className,
}: ProductNoteProps) {
  const products = productIds
    .map(getProduct)
    .filter((p): p is Product => Boolean(p));

  if (products.length === 0) return null;

  const linked = anyLinked(productIds);

  return (
    <aside
      className={
        "mt-8 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur" +
        (className ? ` ${className}` : "")
      }
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        {heading}
      </p>
      <ul className="mt-3 space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="text-sm leading-relaxed text-foreground/90"
          >
            {p.href ? (
              <a
                href={p.href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
              >
                {p.name}
              </a>
            ) : (
              <span className="font-medium text-foreground">{p.name}</span>
            )}
            <span className="text-muted-foreground"> — {p.blurb}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        {linked
          ? `${products[0].brand} products. Some links are affiliate links; they cost you nothing extra, and we only point to gear we would use ourselves.`
          : `${products[0].brand} products, listed because they fit the job.`}
      </p>
    </aside>
  );
}
