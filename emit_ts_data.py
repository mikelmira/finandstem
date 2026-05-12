"""Convert the populated xlsx + species_detail.py into TS data files for the
Next.js catalogue site.

Outputs:
  src/data/species-detail.ts   — extended per-species reference content
  src/data/image-gallery.ts    — up to 5 Wikimedia images per slug, with
                                          license/author/credit/attribution flag

Idempotent — overwrites both files each run.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).parent
XLSX = ROOT / "aquascaping-catalogue-seed.xlsx"
TS_DATA_DIR = ROOT / "src" / "data"
SPECIES_DETAIL_TS = TS_DATA_DIR / "species-detail.ts"
IMAGE_GALLERY_TS = TS_DATA_DIR / "image-gallery.ts"
MANUAL_IMAGES_JSON = ROOT / "manual_images.json"
MANUAL_IMAGES_TS = TS_DATA_DIR / "manual-images.ts"

# Mirror the key order from species_detail.py / build_catalogue.py
FISH_KEYS = [
    ("habitat", "Habitat"),
    ("wildDiet", "Wild diet"),
    ("sexing", "Sexing"),
    ("breeding", "Breeding"),
    ("colorForms", "Color forms"),
    ("diseases", "Common diseases"),
    ("tankSetup", "Tank setup"),
    ("goodTankMates", "Good tank mates"),
    ("badTankMates", "Bad tank mates"),
    ("quarantine", "Quarantine"),
    ("conservation", "Conservation status"),
    ("priceRange", "Price range (USD)"),
    ("etymology", "Etymology"),
    ("misconceptions", "Misconceptions"),
    ("proTips", "Pro tips"),
]

PLANT_KEYS = [
    ("habitatNatural", "Habitat"),
    ("variants", "Variants / cultivars"),
    ("emersedForm", "Emersed form"),
    ("flowering", "Flowering"),
    ("fertilization", "Fertilization"),
    ("trimming", "Trimming"),
    ("deficiencies", "Common deficiencies"),
    ("algaeIssues", "Algae issues"),
    ("misidentification", "Misidentification"),
    ("priceRange", "Price range (USD)"),
    ("proTips", "Pro tips"),
]

SHRIMP_KEYS = [
    ("habitatNatural", "Habitat"),
    ("colorGrades", "Color grades / variants"),
    ("sexing", "Sexing"),
    ("molting", "Molting"),
    ("lifecycle", "Lifecycle"),
    ("diseases", "Diseases"),
    ("tankSetup", "Tank setup"),
    ("goodTankMates", "Good tank mates"),
    ("badTankMates", "Bad tank mates"),
    ("priceRange", "Price range (USD)"),
    ("proTips", "Pro tips"),
    ("commonMistakes", "Common mistakes"),
]

MOSS_KEYS = [
    ("habitatNatural", "Habitat"),
    ("identificationNotes", "Identification"),
    ("emersedForm", "Emersed form"),
    ("tying", "Tying / attachment"),
    ("tankSetup", "Tank setup"),
    ("algaeIssues", "Algae issues"),
    ("sisterSpecies", "Sister species"),
    ("variants", "Variants"),
    ("priceRange", "Price range (USD)"),
    ("proTips", "Pro tips"),
    ("commonMistakes", "Common mistakes"),
]


def main() -> int:
    sys.path.insert(0, str(ROOT))
    from species_detail import (
        FISH_DETAIL,
        PLANT_DETAIL,
        SHRIMP_DETAIL,
        MOSS_DETAIL,
    )

    if not XLSX.exists():
        print(f"missing xlsx: {XLSX}", file=sys.stderr)
        return 1
    wb = load_workbook(XLSX, read_only=True)

    # Map fish-001 → slug via the Fish/Plants/Shrimp/Mosses sheets
    id_to_slug: dict[str, str] = {}
    for sheet in ("Fish", "Plants", "Shrimp", "Mosses"):
        if sheet not in wb.sheetnames:
            continue
        ws = wb[sheet]
        rows = ws.iter_rows(values_only=True)
        next(rows)  # header
        for row in rows:
            sp_id, slug = row[0], row[1]
            if sp_id and slug:
                id_to_slug[sp_id] = slug

    # Build image gallery from the Images sheet
    if "Images" not in wb.sheetnames:
        print("missing Images sheet", file=sys.stderr)
        return 1
    ws_i = wb["Images"]
    hdrs = {c.value: idx for idx, c in enumerate(next(ws_i.iter_rows(max_row=1)))}

    def col(row, name):
        return row[hdrs[name]] if name in hdrs else None

    gallery: dict[str, list[dict]] = {}
    for row in ws_i.iter_rows(min_row=2, values_only=True):
        sp_id = col(row, "Species ID")
        url = col(row, "Direct Image URL")
        if not sp_id or not url:
            continue
        slug = id_to_slug.get(sp_id)
        if not slug:
            continue
        gallery.setdefault(slug, []).append(
            {
                "url": url,
                "descriptionUrl": col(row, "Description Page URL") or "",
                "fileTitle": col(row, "Commons File Title") or "",
                "license": col(row, "License (short)") or "",
                "licenseUrl": col(row, "License URL") or "",
                "author": col(row, "Author / Photographer") or "",
                "credit": col(row, "Credit") or "",
                "attributionRequired": bool(col(row, "Attribution Required")),
                "slot": col(row, "Use On Page") or "",
            }
        )

    # ----------------------------------------------------------------------
    # Emit species-detail.ts
    # ----------------------------------------------------------------------
    def emit_section(
        title: str,
        detail_map: dict[str, dict],
        keys: list[tuple[str, str]],
    ) -> str:
        out = [f"// {title}", "{"]
        for sp_id, blob in sorted(detail_map.items()):
            slug = id_to_slug.get(sp_id)
            if not slug:
                continue
            out.append(f"  {json.dumps(slug)}: [")
            for k, label in keys:
                v = blob.get(k, "")
                if not v:
                    continue
                out.append(
                    f"    {{ key: {json.dumps(k)}, label: {json.dumps(label)}, body: {json.dumps(v)} }},"
                )
            out.append("  ],")
        out.append("}")
        return "\n".join(out)

    ts = []
    ts.append("// Auto-generated by emit_ts_data.py — do not edit by hand.")
    ts.append("// Sources: species_detail.py + aquascaping-catalogue-seed.xlsx")
    ts.append("")
    ts.append("export interface DetailSection {")
    ts.append("  key: string;")
    ts.append("  label: string;")
    ts.append("  body: string;")
    ts.append("}")
    ts.append("")
    ts.append("type DetailMap = Record<string, DetailSection[]>;")
    ts.append("")
    ts.append("export const FISH_DETAIL: DetailMap = " + emit_section("Fish", FISH_DETAIL, FISH_KEYS) + ";")
    ts.append("")
    ts.append("export const PLANT_DETAIL: DetailMap = " + emit_section("Plants", PLANT_DETAIL, PLANT_KEYS) + ";")
    ts.append("")
    ts.append("export const SHRIMP_DETAIL: DetailMap = " + emit_section("Shrimp", SHRIMP_DETAIL, SHRIMP_KEYS) + ";")
    ts.append("")
    ts.append("export const MOSS_DETAIL: DetailMap = " + emit_section("Mosses", MOSS_DETAIL, MOSS_KEYS) + ";")
    ts.append("")
    ts.append("export function getDetailSections(")
    ts.append("  category: 'fish' | 'plants' | 'shrimp' | 'mosses',")
    ts.append("  slug: string,")
    ts.append("): DetailSection[] {")
    ts.append("  if (category === 'fish') return FISH_DETAIL[slug] ?? [];")
    ts.append("  if (category === 'plants') return PLANT_DETAIL[slug] ?? [];")
    ts.append("  if (category === 'shrimp') return SHRIMP_DETAIL[slug] ?? [];")
    ts.append("  return MOSS_DETAIL[slug] ?? [];")
    ts.append("}")
    ts.append("")

    SPECIES_DETAIL_TS.write_text("\n".join(ts), encoding="utf-8")
    print(f"wrote {SPECIES_DETAIL_TS}")

    # ----------------------------------------------------------------------
    # Emit image-gallery.ts
    # ----------------------------------------------------------------------
    gts = []
    gts.append("// Auto-generated by emit_ts_data.py — do not edit by hand.")
    gts.append("// Each entry: up to 5 Wikimedia images per species, with license + author for attribution.")
    gts.append("")
    gts.append("export interface GalleryImage {")
    gts.append("  url: string;")
    gts.append("  descriptionUrl: string;")
    gts.append("  fileTitle: string;")
    gts.append("  license: string;")
    gts.append("  licenseUrl: string;")
    gts.append("  author: string;")
    gts.append("  credit: string;")
    gts.append("  attributionRequired: boolean;")
    gts.append("  slot: string;")
    gts.append("}")
    gts.append("")
    gts.append("export const IMAGE_GALLERY: Record<string, GalleryImage[]> = {")
    for slug in sorted(gallery.keys()):
        items = gallery[slug]
        gts.append(f"  {json.dumps(slug)}: [")
        for it in items:
            gts.append("    {")
            for field in (
                "url",
                "descriptionUrl",
                "fileTitle",
                "license",
                "licenseUrl",
                "author",
                "credit",
                "slot",
            ):
                gts.append(f"      {field}: {json.dumps(it[field])},")
            gts.append(
                f"      attributionRequired: {str(it['attributionRequired']).lower()},"
            )
            gts.append("    },")
        gts.append("  ],")
    gts.append("};")
    gts.append("")
    gts.append('import { MANUAL_IMAGES } from "./manual-images";')
    gts.append("")
    gts.append("export function getGallery(slug: string): GalleryImage[] {")
    gts.append("  return [")
    gts.append("    ...(IMAGE_GALLERY[slug] ?? []),")
    gts.append("    ...(MANUAL_IMAGES[slug] ?? []),")
    gts.append("  ];")
    gts.append("}")
    gts.append("")

    IMAGE_GALLERY_TS.write_text("\n".join(gts), encoding="utf-8")
    print(f"wrote {IMAGE_GALLERY_TS}")

    # ----------------------------------------------------------------------
    # Emit manual-images.ts from manual_images.json (iNat + hand-curated)
    # ----------------------------------------------------------------------
    manual: dict[str, list[dict]] = {}
    if MANUAL_IMAGES_JSON.exists():
        try:
            manual = json.loads(MANUAL_IMAGES_JSON.read_text())
        except Exception as e:
            print(f"  ! couldn't parse {MANUAL_IMAGES_JSON}: {e}", file=sys.stderr)

    mts: list[str] = []
    mts.append("// Auto-generated by emit_ts_data.py — do not edit by hand.")
    mts.append("// Sources: manual_images.json (iNaturalist CC-BY/CC0 + hand-curated).")
    mts.append("// Photos in this file are NOT from Wikimedia Commons — they're")
    mts.append("// commercially-licensed photos from other sources used to fill gaps.")
    mts.append("")
    mts.append('import type { GalleryImage } from "./image-gallery";')
    mts.append("")
    mts.append("export const MANUAL_IMAGES: Record<string, GalleryImage[]> = {")
    for slug in sorted(manual.keys()):
        items = manual[slug] or []
        if not items:
            continue
        mts.append(f"  {json.dumps(slug)}: [")
        for it in items:
            mts.append("    {")
            for field in (
                "url",
                "descriptionUrl",
                "fileTitle",
                "license",
                "licenseUrl",
                "author",
                "credit",
                "slot",
            ):
                mts.append(f"      {field}: {json.dumps(it.get(field, ''))},")
            mts.append(
                f"      attributionRequired: {str(bool(it.get('attributionRequired', False))).lower()},"
            )
            mts.append("    },")
        mts.append("  ],")
    mts.append("};")
    mts.append("")
    mts.append("export function getManualImages(slug: string): GalleryImage[] {")
    mts.append("  return MANUAL_IMAGES[slug] ?? [];")
    mts.append("}")
    mts.append("")

    MANUAL_IMAGES_TS.write_text("\n".join(mts), encoding="utf-8")
    print(f"wrote {MANUAL_IMAGES_TS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
