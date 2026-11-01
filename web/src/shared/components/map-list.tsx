import { StringMap } from "../types";

export function Section({ title, children }: { title: string; children: preact.ComponentChildren }) {
  return (
    <section class="modal-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function MapList({title,entries}: {title: string; entries?: StringMap | undefined}){
    const pairs = Object.entries(entries ?? {});
    if(!pairs.length) return null;

    return(
        <Section title={title}>
            <ul class="pair-list">
                {pairs.map(([label,value]) => (
                    <li key={label}>
                        <span class="pair-label">{label}:</span>
                        <span class="pair-value">{value}</span>
                    </li>
                ))}
            </ul>
        </Section>
    )
}

export function MapListItemized({title,entries}: {title: string; entries?: StringMap | undefined}){
    const pairs = Object.entries(entries ?? {});
    if(!pairs.length) return null;

    return(
        <Section title={title}>
            <ul class="pair-list">
                {pairs.map(([label,value]) => (
                    <li key={label}>
                        <span class="pair-label">{label}.&#41; </span>
                        <span class="pair-value">{value}</span>
                    </li>
                ))}
            </ul>
        </Section>
    )
}