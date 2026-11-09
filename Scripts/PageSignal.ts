// Extracts the CfP-relevant text of a web page so unrelated edits (menus, news, footers) do not count as changes.
import { createHash } from "node:crypto";

// Lines worth watching: years, deadline/submission vocabulary in English and Japanese.
const SIGNAL_PATTERN =
  /(20\d\d|deadline|submi|call for|cfp|due|notification|abstract|camera|special issue|track|締切|〆切|期限|募集|投稿|開催|申込|論文)/i;

// Lines that change without meaning anything (copyright years, visitor counters).
const NOISE_PATTERN =
  /(©|copyright|all rights reserved|last (modified|updated)|最終更新|アクセス数)/i;

// Elements whose end starts a new line of text.
const BLOCK_END_PATTERN =
  /<(br|\/(p|div|li|h[1-6]|tr|td|th|dt|dd|section|article|table|nav|header|footer|ul|ol))\b[^>]*>/gi;

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&ndash;": "–",
  "&mdash;": "—",
};

/** Converts HTML to plain-text lines. */
export function convertHtmlToLines(html: string): string[] {
  const text = html
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(BLOCK_END_PATTERN, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? " ");
  return text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);
}

/** Returns the distinct lines of `html` that look CfP-related, in page order. */
export function extractSignalLines(html: string): string[] {
  const lines = convertHtmlToLines(html).filter(isSignalLine);
  return [...new Set(lines.map((line) => line.slice(0, 300)))];
}

/** True when a text line looks CfP-related and is not known noise. */
export function isSignalLine(line: string): boolean {
  return SIGNAL_PATTERN.test(line) && !NOISE_PATTERN.test(line);
}

/** Returns CfP-related lines plus `radius` neighbouring lines each, for human/LLM reading. */
export function extractSignalContext(html: string, radius = 1): string[] {
  const lines = convertHtmlToLines(html);
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (isSignalLine(line)) {
      for (let offset = -radius; offset <= radius; offset++) {
        keep.add(index + offset);
      }
    }
  });
  return lines.filter((_, index) => keep.has(index)).map((line) => line.slice(0, 300));
}

/** Returns a short, stable hash of `lines`. */
export function hashLines(lines: readonly string[]): string {
  return createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);
}

/** Decodes a response body using the charset from the header or a `<meta>` tag (e.g. Shift_JIS pages). */
export function decodeBody(body: ArrayBuffer, contentType: string | null): string {
  const headerCharset = /charset=["']?([\w-]+)/i.exec(contentType ?? "")?.[1];
  const head = new TextDecoder("latin1").decode(body.slice(0, 4096));
  const metaCharset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1];
  const charset = headerCharset ?? metaCharset ?? "utf-8";
  try {
    return new TextDecoder(charset).decode(body);
  } catch {
    return new TextDecoder("utf-8").decode(body);
  }
}
