/** Shared paths + enumeration for the content factory. */
import { readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

export const ROOT = new URL("../../", import.meta.url).pathname;
export const POSTS_DIR = join(ROOT, "content", "posts");
export const DATA_DIR = join(ROOT, "content", "data");
export const BACKLOG = join(ROOT, "backlog", "topics.json");

export interface PostFile {
  lang: "ko" | "en";
  slug: string;
  path: string;
}

export function listPosts(lang: "ko" | "en"): PostFile[] {
  const dir = join(POSTS_DIR, lang);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ lang, slug: basename(f, ".mdx"), path: join(dir, f) }));
}

export function allPosts(): PostFile[] {
  return [...listPosts("ko"), ...listPosts("en")];
}

export function dataPath(slug: string): string {
  return join(DATA_DIR, `${slug}.sources.json`);
}
