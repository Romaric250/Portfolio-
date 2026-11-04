import sanitizeHtml from "sanitize-html";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4", "pre", "code", "span"]);

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      code: ["class"],
      span: ["class"],
      a: ["href", "name", "target", "rel", "id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
