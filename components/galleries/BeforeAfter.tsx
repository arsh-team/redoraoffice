"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Photo } from "@/components/ui/Photo";
import type { ImageKey } from "@/lib/content/images";

interface BeforeAfterProps {
  id?: string;
  before: { image: ImageKey; alt: string };
  after: { image: ImageKey; alt: string };
  sizes?: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

/** Draggable before/after comparison. The divider can also be moved with the arrow keys. */
export function BeforeAfter({ id, before, after, sizes }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  /** Share of the frame, measured from the right edge, that shows the "before" image. */
  const [split, setSplit] = useState(50);

  const moveTo = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setSplit(clamp(100 - ((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft") setSplit((value) => clamp(value + step));
    else if (event.key === "ArrowRight") setSplit((value) => clamp(value - step));
    else if (event.key === "Home") setSplit(0);
    else if (event.key === "End") setSplit(100);
    else return;
    event.preventDefault();
  };

  const position = `${split}%`;

  return (
    <div
      ref={frame}
      className="compareVisual"
      id={id}
      onPointerDown={onPointerDown}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <Photo className="afterImg" image={after.image} alt={after.alt} sizes={sizes} />
      <div className="beforeLayer" style={{ width: position }}>
        <Photo image={before.image} alt={before.alt} sizes={sizes} />
      </div>
      <div className="compareLine" style={{ right: position }} />
      <button
        className="compareHandle"
        type="button"
        role="slider"
        aria-label="مقایسه قبل و بعد"
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        style={{ right: position }}
        onKeyDown={onKeyDown}
      >
        ↔
      </button>
      <span className="compareLabel beforeLabel">قبل</span>
      <span className="compareLabel afterLabel">بعد</span>
    </div>
  );
}
