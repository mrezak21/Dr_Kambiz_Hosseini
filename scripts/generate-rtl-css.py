#!/usr/bin/env python3
"""Mirror physical LTR CSS properties for RTL (rtlcss-style)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

# Order matters: longer names before shorter (e.g. padding-left before left).
PROP_PAIRS = [
    ("margin-left", "margin-right"),
    ("padding-left", "padding-right"),
    ("border-top-left-radius", "border-top-right-radius"),
    ("border-bottom-left-radius", "border-bottom-right-radius"),
    ("border-left-width", "border-right-width"),
    ("border-left-color", "border-right-color"),
    ("border-left-style", "border-right-style"),
    ("border-left", "border-right"),
]

# Standalone positioning properties only (not padding-left, etc.)
POS_LEFT = re.compile(r"(?<![\w-])left\s*:")
POS_RIGHT = re.compile(r"(?<![\w-])right\s*:")

VALUE_SWAPS = [
    (r"\btext-align:\s*left\b", "text-align: right"),
    (r"\btext-align:\s*right\b", "text-align: left"),
    (r"\bfloat:\s*left\b", "float: right"),
    (r"\bfloat:\s*right\b", "float: left"),
    (r"background-position:\s*left\b", "background-position: right"),
    (r"background-position:\s*right\b", "background-position: left"),
    (r"translateX\(\s*(-?[\d.]+(?:px|rem|em|%)?)\s*\)", r"translateX(\1)"),  # handled separately
]

PLACEHOLDER = "\0RTL_SWAP\0"


def swap_position_props(css: str) -> str:
    css = POS_LEFT.sub("__POS_L__:", css)
    css = POS_RIGHT.sub("left:", css)
    css = css.replace("__POS_L__:", "right:")
    return css


def swap_four_value_shorthand(css: str, prop: str) -> str:
    pattern = re.compile(
        rf"({re.escape(prop)})\s*:\s*"
        r"(-?[\d.]+(?:px|rem|em|%)?)\s+"
        r"(-?[\d.]+(?:px|rem|em|%)?)\s+"
        r"(-?[\d.]+(?:px|rem|em|%)?)\s+"
        r"(-?[\d.]+(?:px|rem|em|%)?)\s*;",
        re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        name, top, right, bottom, left = match.groups()
        return f"{name}: {top} {left} {bottom} {right};"

    return pattern.sub(repl, css)


def swap_properties(css: str) -> str:
    for a, b in PROP_PAIRS:
        css = css.replace(a, PLACEHOLDER)
        css = css.replace(b, a)
        css = css.replace(PLACEHOLDER, b)
    css = swap_four_value_shorthand(css, "padding")
    css = swap_four_value_shorthand(css, "margin")
    return swap_position_props(css)


def swap_values(css: str) -> str:
    css = re.sub(r"\btext-align:\s*left\b", "text-align: __RTL_TA__", css)
    css = re.sub(r"\btext-align:\s*right\b", "text-align: left", css)
    css = re.sub(r"text-align:\s*__RTL_TA__", "text-align: right", css)

    css = re.sub(r"\bfloat:\s*left\b", "float: __RTL_FL__", css)
    css = re.sub(r"\bfloat:\s*right\b", "float: left", css)
    css = re.sub(r"float:\s*__RTL_FL__", "float: right", css)

    css = re.sub(
        r"background-position:\s*left\b",
        "background-position: __RTL_BP__",
        css,
    )
    css = re.sub(
        r"background-position:\s*right\b",
        "background-position: left",
        css,
    )
    css = re.sub(
        r"background-position:\s*__RTL_BP__",
        "background-position: right",
        css,
    )

    def flip_translate_x(match: re.Match[str]) -> str:
        val = match.group(1).strip()
        if val.startswith("-"):
            return f"translateX({val[1:]})"
        if val.startswith("calc("):
            return match.group(0)
        return f"translateX(-{val})"

    css = re.sub(
        r"translateX\(\s*(-?[^)]+)\s*\)",
        flip_translate_x,
        css,
    )
    return css


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    src = root / "css" / "custom.css"
    dst = root / "css" / "custom.rtl.css"
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    if len(sys.argv) > 2:
        dst = Path(sys.argv[2])

    css = src.read_text(encoding="utf-8")
    header = "/* RTL mirror of custom.css — use with <html dir=\"rtl\"> */\n"
    out = swap_values(swap_properties(css))
    dst.write_text(header + out, encoding="utf-8")
    print(f"Wrote {dst} ({len(out)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
