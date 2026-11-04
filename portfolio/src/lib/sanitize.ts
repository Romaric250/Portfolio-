import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "del",
  "ins",
  "sub",
  "sup",
  "a",
  "img",
  "blockquote",
  "pre",
  "code",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "caption",
  "figure",
  "figcaption",
  "div",
  "span",
  "iframe",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "name", "target", "rel", "title"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  div: ["class"],
  span: ["class"],
  code: ["class"],
  pre: ["class"],
};

const ALLOWED_CLASSES = {
  div: ["callout"],
  span: ["callout"],
};

const ALLOWED_IFRAME_HOSTNAMES = ["www.youtube-nocookie.com", "youtube-nocookie.com"];

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedClasses: ALLOWED_CLASSES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
    exclusiveFilter(frame) {
      if (frame.tag === "iframe") {
        const src = frame.attribs.src ?? "";
        try {
          const host = new URL(src, "https://example.com").hostname;
          return !ALLOWED_IFRAME_HOSTNAMES.includes(host);
        } catch {
          return true;
        }
      }
      return false;
    },
  });
}
