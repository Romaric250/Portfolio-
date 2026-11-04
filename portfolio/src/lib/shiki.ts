import "server-only";
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";

type ShikiHighlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

let highlighterPromise: Promise<ShikiHighlighter> | null = null;

async function getHighlighter(): Promise<ShikiHighlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [
          "typescript",
          "javascript",
          "python",
          "bash",
          "json",
          "sql",
          "yaml",
          "markdown",
          "html",
          "css",
          "rust",
          "csharp",
        ],
      }),
    );
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: string,
  theme: "github-dark" | "github-light" = "github-dark",
): Promise<string> {
  const highlighter = await getHighlighter();
  const language = lang as BundledLanguage;
  try {
    return highlighter.codeToHtml(code, { lang: language, theme });
  } catch {
    return highlighter.codeToHtml(code, { lang: "text", theme });
  }
}

export async function highlightCodeBlocksInHtml(
  html: string,
  theme: "github-dark" | "github-light" = "github-dark",
): Promise<string> {
  const preRegex = /<pre(?:\s[^>]*)?><code(?:\s+class="language-([^"]+)")?[^>]*>([\s\S]*?)<\/code><\/pre>/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = preRegex.exec(html)) !== null) {
    parts.push(html.slice(lastIndex, match.index));
    const lang = match[1] ?? "text";
    const raw = match[2] ?? "";
    const decoded = raw
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
    parts.push(await highlightCode(decoded, lang, theme));
    lastIndex = preRegex.lastIndex;
  }

  parts.push(html.slice(lastIndex));
  return parts.join("");
}
