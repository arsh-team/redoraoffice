import { Photo } from "@/components/ui/Photo";
import type { ArticleBlock } from "@/lib/content/articles";

/** Renders an article body from its structured blocks. */
export function ArticleBlocks({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "lead":
            return (
              <p key={index} className="lead">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2 key={index} id={block.id}>
                {block.text}
              </h2>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "pull":
            return (
              <div key={index} className="articlePull">
                <b>{block.label}</b>
                <p>{block.text}</p>
              </div>
            );
          case "figure":
            return (
              <figure key={index} className={block.organic ? "articleFigure organic" : "articleFigure"}>
                <Photo image={block.image} sizes="(max-width: 900px) 100vw, 760px" />
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          case "checklist":
            return (
              <div key={index} className="articleChecklist">
                <h3>{block.title}</h3>
                {block.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            );
          case "quote":
            return (
              <blockquote key={index} className="articleQuote">
                {block.text}
              </blockquote>
            );
        }
      })}
    </>
  );
}
