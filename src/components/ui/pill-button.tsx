import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillButtonBaseProps {
  /** Children render to the left of the arrow puck. */
  children: React.ReactNode;
  /** Visual variant. `primary` is filled green; `ghost` is a bordered
   *  cream pill; `quiet` is borderless for inline links. */
  variant?: "primary" | "ghost" | "quiet";
  /** Icon used in the trailing puck. Defaults to ArrowRight. */
  arrow?: LucideIcon;
  /** Size. `md` is the default page-CTA size; `sm` is for inline
   *  "Read more"-style links on cards. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface PillButtonAsLink extends PillButtonBaseProps {
  href: string;
  type?: never;
}

interface PillButtonAsButton extends PillButtonBaseProps {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
}

type PillButtonProps = PillButtonAsLink | PillButtonAsButton;

/**
 * Field-guide pill button, a flat capsule with a circular arrow puck
 * tucked into its trailing edge. Mirrors the pattern across the
 * reference set (set 1 images 1+2, set 2 image 5). Use for the
 * primary site-wide CTAs and any "Read more" / "Explore" link.
 *
 *   <PillButton href="/plants">Browse catalogue</PillButton>
 *   <PillButton variant="ghost" size="sm">Read more</PillButton>
 *
 * Renders as `<a>` when `href` is provided, otherwise `<button>`.
 */
export function PillButton(props: PillButtonProps) {
  const {
    children,
    variant = "primary",
    arrow: Arrow = ArrowRight,
    size = "md",
    className,
  } = props;

  const sizes = {
    sm: {
      root: "h-9 pl-4 pr-1.5 text-xs",
      puck: "size-7",
      icon: "size-3.5",
    },
    md: {
      root: "h-11 pl-5 pr-2 text-sm",
      puck: "size-9",
      icon: "size-4",
    },
    lg: {
      root: "h-12 pl-6 pr-2 text-sm",
      puck: "size-10",
      icon: "size-4",
    },
  } as const;

  const variants = {
    primary:
      "bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[color-mix(in_oklab,var(--brand)_90%,black)]",
    ghost:
      "border border-foreground/15 bg-card text-foreground hover:border-[var(--brand)]/45 hover:text-foreground",
    quiet:
      "text-foreground hover:text-[var(--brand)]",
  } as const;

  const puckVariants = {
    primary:
      "bg-[color-mix(in_oklab,var(--brand-foreground)_18%,transparent)] text-[var(--brand-foreground)]",
    ghost:
      "bg-foreground text-background",
    quiet:
      "bg-foreground/10 text-foreground",
  } as const;

  const s = sizes[size];

  const inner = (
    <>
      <span className="font-medium">{children}</span>
      <span
        aria-hidden
        className={cn(
          "press inline-flex items-center justify-center rounded-full transition-transform duration-200 group-hover/pill:translate-x-0.5",
          s.puck,
          puckVariants[variant],
        )}
      >
        <Arrow className={s.icon} strokeWidth={1.75} />
      </span>
    </>
  );

  const classes = cn(
    "group/pill inline-flex shrink-0 items-center gap-3 rounded-full transition-colors duration-200",
    s.root,
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={"onClick" in props ? props.onClick : undefined}
      className={classes}
    >
      {inner}
    </button>
  );
}
