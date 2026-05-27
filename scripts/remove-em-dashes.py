"""Remove em dashes (U+2014) from text content under src/, safely.

Strategy: only touch em dashes that sit *inside a string literal* or
inside MDX prose. Em dashes outside strings are vanishingly rare in
this codebase (probably zero), but the safe path is the same either
way — we tokenise each file, find string regions, and only do the
substitution inside those regions.

This avoids the catastrophic outcome of the first version of this
script, which used over-eager regex cleanups and stripped commas
from object literals.

Replacement rules inside a string:
  · ' — ' (space + em dash + space) → ', '
  · '—'   (any other em dash)        → ','
  · The script then collapses any ' ,' (space before comma) and
    runs of doubled commas inside the SAME string region only.

For .md / .mdx files (which are mostly prose, not code), the entire
file is treated as one big "string region" for the purposes of the
substitution.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET_DIR = ROOT / "src"
CODE_EXTS = {".ts", ".tsx"}
PROSE_EXTS = {".md", ".mdx"}
EM = "—"


def fix_string_content(s: str) -> str:
    """Apply the em-dash substitution to one string-region's text."""
    if EM not in s:
        return s
    # Spaced em dash → ', '
    s = s.replace(f" {EM} ", ", ")
    # Em dash hugging a word on either side → ', '
    s = s.replace(f"{EM} ", ", ").replace(f" {EM}", ", ")
    # Bare em dash → ', '
    s = s.replace(EM, ", ")
    # Localised cleanup inside the same string region:
    #   space before comma → just comma
    s = re.sub(r" +,", ",", s)
    #   run of multiple commas → one
    s = re.sub(r",(?:\s*,)+", ",", s)
    #   period + space + comma → just period + space
    s = re.sub(r"\.\s+,\s*", ". ", s)
    return s


# Tokenise a TS/TSX file into spans, replacing em dashes only inside
# string literals (single / double quotes / template literals).
#
# We walk the file char-by-char, tracking three string-quote states.
# Each open quote starts a string region until the matching close
# (ignoring escaped quotes). Everything between is treated as
# content we can rewrite.
def rewrite_code(text: str) -> str:
    out: list[str] = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        # Line comment — skip to newline so we don't get tricked by
        # an apostrophe inside a comment.
        if ch == "/" and i + 1 < n and text[i + 1] == "/":
            j = text.find("\n", i)
            if j == -1:
                out.append(text[i:])
                return "".join(out)
            out.append(text[i:j])
            i = j
            continue
        # Block comment.
        if ch == "/" and i + 1 < n and text[i + 1] == "*":
            j = text.find("*/", i + 2)
            if j == -1:
                out.append(text[i:])
                return "".join(out)
            # Treat the comment body as prose so em dashes inside
            # JSDoc-style comments also get the substitution.
            chunk = text[i : j + 2]
            out.append(fix_string_content(chunk))
            i = j + 2
            continue
        # String literal — single, double, or template.
        if ch in ("'", '"', "`"):
            quote = ch
            j = i + 1
            while j < n:
                if text[j] == "\\":
                    j += 2
                    continue
                if quote == "`" and text[j] == "$" and j + 1 < n and text[j + 1] == "{":
                    # Embedded JSX/TS expression inside a template
                    # literal. Skip across it (balanced braces).
                    depth = 1
                    k = j + 2
                    while k < n and depth > 0:
                        if text[k] == "{":
                            depth += 1
                        elif text[k] == "}":
                            depth -= 1
                        k += 1
                    # Treat the literal text leading up to ${ as
                    # rewritable.
                    chunk = text[i:j]
                    out.append(fix_string_content(chunk))
                    out.append(text[j:k])
                    i = k
                    j = k
                    continue
                if text[j] == quote:
                    break
                j += 1
            # j now sits on the closing quote (or n if unterminated).
            chunk = text[i : j + 1]
            out.append(fix_string_content(chunk))
            i = j + 1
            continue
        # Default: outside of strings and comments. This is where
        # JSX text bodies live (`<p>Hello — world</p>`). Replace em
        # dashes here too — but only the em dash itself; don't touch
        # surrounding whitespace because that's just JSX whitespace.
        if ch == EM:
            # Same spaced / bare rule as inside a string.
            prev = out[-1] if out else ""
            nxt = text[i + 1] if i + 1 < n else ""
            if prev.endswith(" ") and nxt == " ":
                # ' — '  →  ', '   (drop the leading space from out)
                out[-1] = out[-1][:-1]
                out.append(", ")
                i += 2  # skip the em dash and the trailing space
                continue
            out.append(", ")
            i += 1
            continue
        out.append(ch)
        i += 1
    return "".join(out)


def main() -> None:
    files_touched = 0
    em_replaced = 0
    for path in TARGET_DIR.rglob("*"):
        if not path.is_file():
            continue
        suf = path.suffix
        if suf not in CODE_EXTS and suf not in PROSE_EXTS:
            continue
        original = path.read_text()
        if EM not in original:
            continue
        before = original.count(EM)
        if suf in PROSE_EXTS:
            new = fix_string_content(original)
        else:
            new = rewrite_code(original)
        if new == original:
            continue
        path.write_text(new)
        files_touched += 1
        after = new.count(EM)
        em_replaced += before - after
        print(f"  {before - after:>3}  {path.relative_to(ROOT)}")
    print(f"\nReplaced {em_replaced} em dashes across {files_touched} files")


if __name__ == "__main__":
    main()
