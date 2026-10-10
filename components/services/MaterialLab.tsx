"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { materialSwatches } from "@/lib/content/services";

/** Material picker: choosing a swatch updates the "suggested combination" label on the photo. */
export function MaterialLab() {
  const [selected, setSelected] = useState(materialSwatches[0]);

  return (
    <div className="wrap materialGrid">
      <div className="materialCopy">
        <span className="eyebrow">MATERIAL LAB</span>
        <h2>
          متریال را فقط انتخاب نمی‌کنیم؛
          <br />
          با هم <em>ترکیبش</em> می‌کنیم.
        </h2>
        <p>پالت هر پروژه بر اساس نور، مقیاس فضا و سبک زندگی شکل می‌گیرد.</p>
        <div className="swatches" role="group" aria-label="انتخاب متریال">
          {materialSwatches.map((swatch) => (
            <button
              key={swatch.key}
              type="button"
              aria-pressed={swatch.key === selected.key}
              onClick={() => setSelected(swatch)}
            >
              <i className={swatch.key} />
              <b>{swatch.label}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="materialVisual">
        <Photo image="dark" sizes="(max-width: 900px) 100vw, 55vw" />
        <div className="matLabel" aria-live="polite">
          ترکیب پیشنهادی
          <br />
          <strong id="matName">{selected.name}</strong>
        </div>
      </div>
    </div>
  );
}
