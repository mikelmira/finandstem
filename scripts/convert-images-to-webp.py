"""Convert every JPG/PNG inside public/images/ to WebP.

Next.js's runtime image pipeline already serves WebP/AVIF to browsers
that send the matching `Accept` header — but the source files in the
repo are still 250+ MB of JPG/PNG. Converting the sources cuts both
the repo footprint and Vercel's image-optimization cold-start cost,
because there are far fewer raw bytes to read off origin.

Strategy:
  · Walk public/images/ recursively
  · For each .jpg / .jpeg / .png, re-encode as WebP at quality 82
    (visually-lossless for photography; ~30 % smaller than JPG-q85)
  · Delete the original after a successful write
  · Skip files smaller than the WebP output (rare but possible for
    already-tiny PNGs)
  · Emit a one-line summary per file plus a totals block at the end

Safe to re-run: any .webp already in the tree is left alone (no
matching source to re-encode).
"""

from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "public" / "images"
QUALITY = 82  # WebP encoder quality 0–100. 82 ≈ visually lossless.
METHOD = 6  # 0 (fast) – 6 (slow, best). 6 is fine for a one-off pass.


def convert_one(src: Path) -> tuple[int, int] | None:
    """Convert one file. Returns (old_bytes, new_bytes) or None on skip."""
    dst = src.with_suffix(".webp")
    if dst.exists() and src.suffix == ".webp":
        return None
    try:
        with Image.open(src) as im:
            # WebP supports both lossy and lossless. Photography → lossy
            # at QUALITY. PNGs with alpha get lossless to preserve the
            # alpha channel exactly.
            has_alpha = im.mode in ("RGBA", "LA") or (
                im.mode == "P" and "transparency" in im.info
            )
            if has_alpha:
                im = im.convert("RGBA")
                im.save(dst, "WEBP", lossless=True, method=METHOD)
            else:
                im = im.convert("RGB")
                im.save(dst, "WEBP", quality=QUALITY, method=METHOD)
    except Exception as exc:
        print(f"  ! {src.relative_to(ROOT)}: {exc}")
        return None

    old_bytes = src.stat().st_size
    new_bytes = dst.stat().st_size

    if new_bytes >= old_bytes and not has_alpha:
        # WebP is bigger than the original (rare on small images).
        # Keep the original and drop the WebP.
        dst.unlink()
        print(f"  = {src.name}  (webp would be larger — kept original)")
        return None

    # Success — delete the original
    src.unlink()
    return (old_bytes, new_bytes)


def main() -> None:
    if not IMAGES_DIR.exists():
        print(f"images directory not found: {IMAGES_DIR}")
        sys.exit(1)

    targets = [
        p
        for p in IMAGES_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    ]
    targets.sort()
    print(f"Found {len(targets)} JPG/PNG files under public/images/")

    total_old = 0
    total_new = 0
    converted = 0
    for src in targets:
        rel = src.relative_to(IMAGES_DIR)
        result = convert_one(src)
        if result is None:
            continue
        old, new = result
        total_old += old
        total_new += new
        converted += 1
        ratio = (new / old) * 100
        print(
            f"  {rel}  {old / 1024:>7.1f} kB  →  "
            f"{new / 1024:>7.1f} kB  ({ratio:5.1f}%)"
        )

    if converted == 0:
        print("\nNothing to convert.")
        return

    mb = 1024 * 1024
    saved = total_old - total_new
    overall = (total_new / total_old) * 100
    print(
        f"\n=== Summary ===\n"
        f"Converted: {converted} files\n"
        f"Before:    {total_old / mb:7.1f} MB\n"
        f"After:     {total_new / mb:7.1f} MB\n"
        f"Saved:     {saved / mb:7.1f} MB ({100 - overall:.1f}% smaller; "
        f"webp/original = {overall:.1f}%)"
    )


if __name__ == "__main__":
    main()
