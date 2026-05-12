import type { AtmosphereImage } from "@/data/atmosphere";

interface PhotoCreditProps {
  image: AtmosphereImage;
  className?: string;
}

export function PhotoCredit({ image, className }: PhotoCreditProps) {
  return (
    <p
      className={[
        "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-[var(--abyss)]/65 px-2.5 py-1 text-[10px] font-medium text-foreground/90 backdrop-blur",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Photo:&nbsp;
      <a
        href={image.source}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:underline"
      >
        {image.photographer}
      </a>
      <span className="text-foreground/55">· Unsplash</span>
    </p>
  );
}
