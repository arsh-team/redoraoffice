import { CompactConsultForm } from "@/components/forms/CompactConsultForm";

interface ConsultBandProps {
  /** Two-line heading. */
  heading: readonly [string, string];
  text: string;
  /** The reference offers a different set of project types on different pages. */
  projectTypes: readonly string[];
}

export const consultTypes = {
  full: ["طراحی کامل", "بازطراحی", "مشاوره متریال"],
  short: ["طراحی کامل", "بازطراحی"],
} as const;

/** Dark "start a project" band that closes the About, Services, Journal and article pages. */
export function ConsultBand({ heading, text, projectTypes }: ConsultBandProps) {
  return (
    <section className="consultOrganic wrap" id="consult">
      <div>
        <span>START A PROJECT</span>
        <h2>
          {heading[0]}
          <br />
          {heading[1]}
        </h2>
        <p>{text}</p>
      </div>
      <CompactConsultForm projectTypes={projectTypes} />
    </section>
  );
}
