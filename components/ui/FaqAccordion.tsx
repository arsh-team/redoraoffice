"use client";

import { useId, useState } from "react";

interface FaqAccordionProps {
  items: readonly { question: string; answer: string }[];
  /**
   * "list" is the homepage markup (.faqList, animated max-height);
   * "numbered" is the contact page markup (.faq, numbered rounded cards).
   */
  variant: "list" | "numbered";
}

/** Independent open/close accordion; several answers may be open at once, as on the reference. */
export function FaqAccordion({ items, variant }: FaqAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className={variant === "list" ? "faqList" : "faq"}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const button = (
          <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(index)}>
            {item.question} {variant === "list" ? <b>+</b> : <span>+</span>}
          </button>
        );
        return (
          <article key={item.question} className={isOpen ? "open" : undefined}>
            {button}
            {variant === "list" ? (
              <div id={panelId}>
                <p>{item.answer}</p>
              </div>
            ) : (
              <p id={panelId}>{item.answer}</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
