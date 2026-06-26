/**
 * Quality gate (blog.md §6). One miss = do not publish.
 * Deterministic checks are ERRORS; judgment checks ("공부 일기" tone) are WARNINGS.
 * Drafts (frontmatter draft: true) are skipped with a notice.
 */
import { existsSync } from "node:fs";
import { parsePost } from "./lib/frontmatter.ts";
import { listPosts, dataPath } from "./lib/posts.ts";

let errors = 0;
let warns = 0;
const err = (f: string, m: string) => { console.error(`✗ ${f}: ${m}`); errors++; };
const warn = (f: string, m: string) => { console.warn(`⚠ ${f}: ${m}`); warns++; };

// Decision / Why / Rejected table — the heart of section 5. Accept ko & en headers.
const DECISION_TABLE = /\|[^\n]*(decision|결정)[^\n]*\|[^\n]*(why|이유|근거)[^\n]*\|[^\n]*(rejected|폐기)[^\n]*\|/i;
const CODE_FENCE = /```[\s\S]*?```/g;
const CVE = /CVE-\d{4}-\d+/i;
const HAS_LINK = /\]\(https?:\/\//;

for (const post of [...listPosts("ko"), ...listPosts("en")]) {
  const { data, body } = parsePost(post.path);
  const label = `${post.lang}/${post.slug}`;
  if (data.draft === true) {
    console.log(`· ${label}: draft — quality gate skipped`);
    continue;
  }

  // §6: Decision/Why/Rejected table present
  if (!DECISION_TABLE.test(body)) {
    err(label, "Decision/Why/Rejected 표 없음 (§6, What만 있으면 탈락)");
  }
  // §6: section 3 & 5 carry real code → require >= 2 code blocks
  const blocks = body.match(CODE_FENCE) ?? [];
  if (blocks.length < 2) {
    err(label, `코드 블록 ${blocks.length}개 — 취약 코드(3) + 방어 코드(5) 최소 2개 필요`);
  }
  // §6: CVE/external fact cited → must have a source link in body
  if (CVE.test(body) && !HAS_LINK.test(body)) {
    err(label, "CVE 인용 but 출처 링크 없음");
  }
  // collected-data file (detailed sources) must exist alongside (cross-validation evidence)
  if (!existsSync(dataPath(post.slug))) {
    err(label, `content/data/${post.slug}.sources.json 없음 (교차검증 데이터 누락)`);
  }
  // judgment: "공부 일기" tone — flag confessional first-person phrasing for human review
  if (/(공부 ?일기|초심자|배우는 중|아직 ?잘 ?모르|i'?m (just )?learning|as a beginner)/i.test(body)) {
    warn(label, "‘공부 일기’ 톤 의심 표현 — 사람 검수 필요 (§1-1)");
  }
}

console.log(`\nquality-gate: ${errors} error(s), ${warns} warning(s).`);
if (errors > 0) process.exit(1);
