// Downloads venue pages over HTTP with an honest user agent, decoding Japanese charsets and hashing PDFs.
import { createHash } from "node:crypto";
import { decodeBody } from "./PageSignal";
import type { FetchedPage } from "./PageWatcher";

const USER_AGENT =
  "Mozilla/5.0 (compatible; GameRelatedCfPs-PageWatcher; +https://github.com/konbraphat51/GameRelatedCfPs)";

/** Downloads a page with a timeout; HTML is decoded (incl. non-UTF-8 Japanese pages), PDFs are hashed. */
export async function fetchPage(url: string): Promise<FetchedPage> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "en,ja;q=0.8" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  const body = await response.arrayBuffer();
  if (/pdf|octet-stream/i.test(contentType ?? "")) {
    return { binaryHash: createHash("sha256").update(new Uint8Array(body)).digest("hex") };
  }
  return { html: decodeBody(body, contentType) };
}
