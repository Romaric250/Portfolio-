import type { JsonLd as JsonLdShape } from "@/lib/seo/jsonld";

function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean).filter((v) => v !== undefined);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const c = clean(v);
      if (c !== undefined && c !== null && !(Array.isArray(c) && c.length === 0)) out[k] = c;
    }
    return out;
  }
  return value;
}

/** Server-rendered JSON-LD. Strips undefined/null/empty values so the output validates. */
export function JsonLd({ data }: { data: JsonLdShape | JsonLdShape[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON-LD must be inline; escape "<" to prevent script breakout.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clean(item)).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
