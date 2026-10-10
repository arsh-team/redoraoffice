// Runs inside the page (via page.evaluate). Returns one record per element with
// a stable structural key, its box relative to its parent, and the computed
// styles that define the design. scripts/compare.mjs diffs two such snapshots.
export function collectLayout() {
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "BR", "OPTION", "NEXT-ROUTE-ANNOUNCER"]);
  // State and implementation-only classes that must not affect an element's identity.
  const IGNORED_CLASSES = new Set([
    "reveal-item", "motion-in", "show", "active", "scrolled", "header-hidden", "open",
    "pageRoot", "homePage", "aboutPage", "servicesPage", "innerPage", "blogPage", "contactPage",
    "articlePage", "detailPage", "detailPageV47", "hiddenProject", "filtered-out",
  ]);
  const records = [];

  const signature = (element) => {
    const classes = (typeof element.className === "string" ? element.className : "")
      .split(/\s+/)
      .filter((name) => name && !IGNORED_CLASSES.has(name) && !/[:[\]/]/.test(name))
      .sort();
    return element.tagName.toLowerCase() + (classes.length ? "." + classes.join(".") : "");
  };

  const walk = (element, parentKey, parentRect) => {
    const counts = new Map();
    for (const child of element.children) {
      if (SKIP_TAGS.has(child.tagName)) continue;
      // Honeypots and the skip link are implementation details on both sides.
      if (child.matches('input[name="website"], input[name="_token"], .srOnly, a[href="#main-content"]')) continue;
      // Framework streaming containers appended to <body>.
      if (element === document.body && child.matches("div[hidden]:not([class])")) continue;

      // Transparent wrapper: children are keyed as if they belonged to the parent.
      if (child.classList.contains("pageRoot")) {
        walk(child, parentKey, parentRect);
        continue;
      }

      const sig = signature(child);
      const index = counts.get(sig) ?? 0;
      counts.set(sig, index + 1);
      const key = `${parentKey} > ${sig}[${index}]`;

      const box = child.getBoundingClientRect();
      const rect = { x: box.left + window.scrollX, y: box.top + window.scrollY, w: box.width, h: box.height };
      const style = getComputedStyle(child);
      const round = (value) => Math.round(value * 10) / 10;
      records.push({
        key,
        rx: round(rect.x - parentRect.x),
        ry: round(rect.y - parentRect.y),
        y: round(rect.y),
        w: round(rect.w),
        h: round(rect.h),
        style: {
          display: style.display,
          position: style.position,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          color: style.color,
          background: style.backgroundColor,
          radius: `${style.borderTopLeftRadius} ${style.borderTopRightRadius} ${style.borderBottomRightRadius} ${style.borderBottomLeftRadius}`,
          opacity: style.opacity,
        },
        text: child.children.length === 0 ? (child.textContent ?? "").trim().slice(0, 80) : undefined,
      });
      walk(child, key, rect);
    }
  };

  walk(document.body, "body", { x: 0, y: 0 });
  return records;
}
