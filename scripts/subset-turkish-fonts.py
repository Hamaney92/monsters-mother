"""Generate reviewed Turkish glyph overlays; never modify Fontsource originals.

Requires fonttools==4.66.1 and brotli==1.2.0. Run from the repository root.
Full Latin and Latin Extended faces remain available as fallbacks in fonts.css.
"""
from pathlib import Path
import hashlib
import json
import shutil
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path.cwd()
out = root / "public" / "fonts"
out.mkdir(exist_ok=True)
codes = {0x011E, 0x011F, 0x0130, 0x015E, 0x015F}
manifest = {"codepoints": sorted(codes), "fonts": []}
for package, style, weights in [
    ("manrope", "normal", (200, 800)),
    ("cormorant-garamond", "normal", (300, 700)),
    ("cormorant-garamond", "italic", (300, 700)),
]:
    base = root / "node_modules" / "@fontsource-variable" / package
    source = base / "files" / f"{package}-latin-ext-wght-{style}.woff2"
    original_bytes = source.read_bytes()
    original = TTFont(source)
    assert codes <= set(original.getBestCmap()), f"Missing original glyphs: {source}"
    font = TTFont(source, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.glyph_names = True
    options.hinting = True
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=codes)
    sub.subset(font)
    font.flavor = "woff2"
    # Glyph outlines, positioning and weight axes must not change.
    assert font.getBestCmap().keys() == original.getBestCmap().keys() & codes
    assert [(a.axisTag, a.minValue, a.maxValue) for a in font["fvar"].axes] == [(a.axisTag, a.minValue, a.maxValue) for a in original["fvar"].axes]
    for code in codes:
        glyph = original.getBestCmap()[code]
        assert font["hmtx"][glyph] == original["hmtx"][glyph]
        assert font["glyf"][glyph].getCoordinates(font["glyf"])[0] == original["glyf"][glyph].getCoordinates(original["glyf"])[0]
        assert [(v.axes, v.coordinates) for v in font["gvar"].variations[glyph]] == [(v.axes, v.coordinates) for v in original["gvar"].variations[glyph]]
    target = out / f"{package}-turkish-overlay-{style}.woff2"
    font.save(target)
    reopened = TTFont(target)
    assert codes <= set(reopened.getBestCmap())
    assert source.read_bytes() == original_bytes
    license_target = out / f"{package}-OFL.txt"
    shutil.copyfile(base / "LICENSE", license_target)
    manifest["fonts"].append({
        "file": f"fonts/{target.name}", "source": str(source.relative_to(root)).replace("\\", "/"),
        "sourceSha256": hashlib.sha256(original_bytes).hexdigest(),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "bytes": target.stat().st_size, "originalBytes": len(original_bytes),
        "style": style, "weightRange": weights, "license": f"fonts/{license_target.name}",
        "glyphMetricsAndOutlinesVerified": True,
    })
    print(f"{target.name}: {len(original_bytes)} -> {target.stat().st_size} bytes")
(root / "src" / "data" / "turkish-fonts.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
