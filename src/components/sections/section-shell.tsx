import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "header" | "footer";
  containerClassName?: string;
  bleed?: boolean;
}

export function SectionShell({
  as: As = "section",
  className,
  containerClassName,
  bleed = false,
  children,
  ...rest
}: SectionShellProps) {
  return (
    <As
      className={cn(
        "relative w-full",
        bleed ? "" : "py-20 sm:py-24 md:py-28",
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-6 sm:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </As>
  );
}

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Eyebrow({ children, className, ...rest }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-[var(--brand)]"
      />
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "text-balance text-3xl font-semibold leading-[1.05] sm:text-4xl md:text-[2.75rem]",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
