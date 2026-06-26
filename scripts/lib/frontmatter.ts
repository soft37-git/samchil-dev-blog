/**
 * Minimal YAML-frontmatter reader for our FIXED schema subset.
 * Supports: `key: value`, quoted strings, inline arrays `[a, b]`, booleans.
 * Intentionally tiny — the schema is controlled, so we avoid a yaml dependency.
 */
import { readFileSync } from "node:fs";

export interface ParsedPost {
  path: string;
  data: Record<string, unknown>;
  body: string;
}

function coerce(raw: string): unknown {
  const v = raw.trim();
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter((s) => s.length > 0);
  }
  return v.replace(/^['"]|['"]$/g, "");
}

export function parsePost(path: string): ParsedPost {
  const text = readFileSync(path, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`No frontmatter block found in ${path}`);
  }
  const [, fm, body] = match;
  const data: Record<string, unknown> = {};
  for (const line of fm.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).replace(/\s+#.*$/, ""); // strip trailing comment
    data[key] = coerce(value);
  }
  return { path, data, body };
}
