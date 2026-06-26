/**
 * Validate every post's frontmatter against the fixed schema (blog.md §4).
 * Also enforces ko/en pairing + hreflang/canonical sanity.
 * Exit 1 on any error (used by CI).
 */
import { FrontmatterSchema } from "../schema/frontmatter.ts";
import { parsePost } from "./lib/frontmatter.ts";
import { listPosts } from "./lib/posts.ts";

let errors = 0;
const fail = (file: string, msg: string) => {
  console.error(`✗ ${file}: ${msg}`);
  errors++;
};

const ko = new Set(listPosts("ko").map((p) => p.slug));
const en = new Set(listPosts("en").map((p) => p.slug));

for (const post of [...listPosts("ko"), ...listPosts("en")]) {
  const { data } = parsePost(post.path);
  const result = FrontmatterSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(post.path, `${issue.path.join(".") || "(root)"} — ${issue.message}`);
    }
    continue;
  }
  const fm = result.data;
  if (fm.lang !== post.lang) fail(post.path, `lang=${fm.lang} but file is under /${post.lang}`);
  if (fm.slug !== post.slug) fail(post.path, `slug=${fm.slug} but filename is ${post.slug}.mdx`);
  // ko/en must be a pair (same slug in both languages) unless still a draft
  const partner = post.lang === "ko" ? en : ko;
  if (!fm.draft && !partner.has(post.slug)) {
    fail(post.path, `no ${post.lang === "ko" ? "en" : "ko"} pair for slug "${post.slug}" (hreflang 짝 누락)`);
  }
}

if (errors > 0) {
  console.error(`\nfrontmatter: ${errors} error(s).`);
  process.exit(1);
}
console.log("frontmatter: all posts valid ✓");
