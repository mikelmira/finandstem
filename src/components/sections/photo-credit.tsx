import type { AtmosphereImage } from "@/data/atmosphere";

interface PhotoCreditProps {
  image: AtmosphereImage;
  className?: string;
}

export function PhotoCredit({ image, className }: PhotoCreditProps) {
  return (
    <p
      className={[
        "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/85 backdrop-blur",
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
      <span className="text-white/55">· Unsplash</span>
    </p>
  );
}
