// CLI entry: `pnpm data:peek <url>... [--all]` prints the CfP-relevant lines of pages (decoded correctly, few tokens).
import { convertHtmlToLines, extractSignalContext } from "./PageSignal";
import { fetchPage } from "./PageFetcher";

// Upper bound of printed lines per page, to keep the output cheap.
const MAX_LINES = 120;

const args = process.argv.slice(2);
const urls = args.filter((arg) => !arg.startsWith("--"));
const showAll = args.includes("--all");
if (urls.length === 0) {
  console.error("Usage: pnpm data:peek <url> [more urls ...] [--all]");
  process.exit(2);
}

let failed = false;
for (const url of urls) {
  console.log(`## ${url}`);
  try {
    const page = await fetchPage(url);
    if (!("html" in page)) {
      console.log("(binary document such as a PDF; read it with WebFetch)");
      continue;
    }
    const lines = showAll ? convertHtmlToLines(page.html) : extractSignalContext(page.html);
    lines.slice(0, MAX_LINES).forEach((line) => console.log(line));
    if (lines.length > MAX_LINES) {
      console.log(`(… ${lines.length - MAX_LINES} more lines)`);
    }
    if (lines.length === 0) {
      console.log("(no text; probably script-rendered — try WebFetch or WebSearch)");
    }
  } catch (error) {
    failed = true;
    console.log(`(fetch failed: ${error instanceof Error ? error.message : String(error)})`);
  }
}
process.exit(failed ? 1 : 0);
