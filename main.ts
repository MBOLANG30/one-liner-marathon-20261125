// One-Liner Marathon entry — a single original one-line joke.
// The program writes the joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default "output") and verifies the written bytes match exactly.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE = "I asked my smart fridge what's for dinner and it said 'whatever expires first' — the most honest answer in this house.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
const entryPath = join(outDir, "entry.txt");

// Validate: 1–280 chars (Unicode code points), exactly one line,
// no leading/trailing whitespace, no control characters.
const chars = [...JOKE];
if (chars.length < 1 || chars.length > 280) {
  console.error(`Invalid joke length: ${chars.length} chars`);
  process.exit(1);
}
if (JOKE !== JOKE.trim()) {
  console.error("Joke has leading or trailing whitespace");
  process.exit(1);
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  console.error("Joke must be a single line");
  process.exit(1);
}
for (const ch of JOKE) {
  if (ch.charCodeAt(0) < 0x20) {
    console.error("Joke contains a control character");
    process.exit(1);
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(entryPath, JOKE + "\n", "utf8");
const back = readFileSync(entryPath, "utf8");
if (back !== JOKE + "\n") {
  console.error("Verification failed: written bytes differ");
  process.exit(1);
}
console.log(`Wrote ${chars.length} chars to ${entryPath}`);
