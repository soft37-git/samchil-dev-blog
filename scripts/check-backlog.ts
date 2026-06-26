/**
 * Backlog rule (사용자 규칙 1): if remaining unwritten topics < THRESHOLD,
 * signal that 5 fresh, non-overlapping topics must be researched & appended.
 * This script only REPORTS the gap (deterministic). The actual search+selection
 * is done by the agent orchestrator (.claude/commands/blog-next.md).
 */
import { readFileSync } from "node:fs";
import { BACKLOG } from "./lib/posts.ts";

const THRESHOLD = 5;
const REPLENISH = 5;

interface Topic {
  slug: string;
  status: "todo" | "researching" | "drafted" | "published";
  [k: string]: unknown;
}

const topics: Topic[] = JSON.parse(readFileSync(BACKLOG, "utf8")).topics;
const remaining = topics.filter((t) => t.status === "todo" || t.status === "researching");

console.log(`backlog: ${remaining.length} unwritten / ${topics.length} total (threshold ${THRESHOLD}).`);

if (remaining.length < THRESHOLD) {
  console.log(
    `\n⟳ REPLENISH NEEDED — research & append ${REPLENISH} new non-overlapping topics.\n` +
      `  Existing slugs to avoid overlap:\n  ${topics.map((t) => t.slug).join(", ")}`
  );
  // Exit 0: this is a signal, not a build failure.
} else {
  console.log("backlog healthy — no replenishment needed.");
}
