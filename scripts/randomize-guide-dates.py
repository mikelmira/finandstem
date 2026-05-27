"""
Re-stagger publishedAt + updatedAt on every guide so the set looks like
it was authored organically over the last three months rather than
dumped on the site in one batch.

Window:
  publishedAt:  2026-02-27 → 2026-05-25  (~3 months back from today)
  updatedAt:    each article's publishedAt + a few days, clamped to
                the last 7 days from today so freshness signal stays
                hot for AI overviews + GSC freshness ranking.

Dates are deterministic per slug (FNV-1a hash), so re-running this
script produces identical output. Re-rolling means renaming the
seed prefix.
"""
from __future__ import annotations

import re
import random
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES_DIR = ROOT / "src" / "content" / "guides"

PUBLISH_START = datetime(2026, 2, 27, tzinfo=timezone.utc)
PUBLISH_END = datetime(2026, 5, 25, tzinfo=timezone.utc)
UPDATE_FLOOR = datetime(2026, 5, 20, tzinfo=timezone.utc)
UPDATE_CEILING = datetime(2026, 5, 26, tzinfo=timezone.utc)

SEED_PREFIX = "v2026-05-27"  # change to re-roll the random distribution


def hash_seed(slug: str) -> int:
    """FNV-1a 32-bit hash. Same algorithm we use for catalogue timestamps."""
    h = 2166136261
    for ch in (SEED_PREFIX + ":" + slug).encode():
        h = ((h ^ ch) * 16777619) & 0xFFFFFFFF
    return h


def isoz(dt: datetime) -> str:
    """ISO 8601 with Z suffix instead of +00:00."""
    return dt.replace(microsecond=0).isoformat().replace("+00:00", "Z")


def pick_dates(slug: str) -> tuple[str, str]:
    rng = random.Random(hash_seed(slug))
    # publish_offset in seconds within the publish window
    publish_span_s = int((PUBLISH_END - PUBLISH_START).total_seconds())
    publish_offset_s = rng.randint(0, publish_span_s)
    # snap to a believable working hour (UTC 06:00 → 18:00)
    publish_dt = (PUBLISH_START + timedelta(seconds=publish_offset_s)).replace(
        hour=rng.randint(6, 18),
        minute=rng.choice([0, 15, 30, 45]),
        second=0,
        microsecond=0,
    )

    # updatedAt: floor at publish + 1 day, ceiling at UPDATE_CEILING.
    # Clip so updatedAt is always at-or-after UPDATE_FLOOR (recent
    # freshness signal) but never before publishedAt.
    earliest_update = max(publish_dt + timedelta(days=1), UPDATE_FLOOR)
    if earliest_update >= UPDATE_CEILING:
        update_dt = earliest_update
    else:
        update_span_s = int((UPDATE_CEILING - earliest_update).total_seconds())
        update_offset_s = rng.randint(0, update_span_s)
        update_dt = (earliest_update + timedelta(seconds=update_offset_s)).replace(
            hour=rng.randint(8, 17),
            minute=rng.choice([0, 15, 30, 45]),
            second=0,
            microsecond=0,
        )

    return isoz(publish_dt), isoz(update_dt)


NON_GUIDE = {"readme.md", "readme.mdx", "changelog.md", "license.md"}


def main() -> int:
    files = sorted(
        f
        for f in GUIDES_DIR.iterdir()
        if (f.suffix in {".mdx", ".md"}) and f.name.lower() not in NON_GUIDE
    )
    updates = []

    for path in files:
        text = path.read_text()
        # Find slug from frontmatter (first non-comment slug: line)
        slug_match = re.search(r'^slug:\s*"([^"]+)"', text, flags=re.MULTILINE)
        if not slug_match:
            print(f"  ! skipped {path.name} (no slug)")
            continue
        slug = slug_match.group(1)
        if slug.startswith("_"):
            print(f"  [skip] {slug} (template / draft)")
            continue

        published_at, updated_at = pick_dates(slug)

        new_text, pub_n = re.subn(
            r'^publishedAt:\s*"[^"]+"',
            f'publishedAt: "{published_at}"',
            text,
            count=1,
            flags=re.MULTILINE,
        )
        new_text, upd_n = re.subn(
            r'^updatedAt:\s*"[^"]+"',
            f'updatedAt: "{updated_at}"',
            new_text,
            count=1,
            flags=re.MULTILINE,
        )

        if pub_n + upd_n == 0:
            print(f"  ! skipped {slug} (no date fields found)")
            continue

        path.write_text(new_text)
        updates.append((path.name, slug, published_at, updated_at))

    # Sort and report by published date
    print(f"\nRandomised {len(updates)} guide date pair(s):")
    for name, slug, pub, upd in sorted(updates, key=lambda r: r[2]):
        print(f"  {pub}  →  upd {upd}   {slug}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
