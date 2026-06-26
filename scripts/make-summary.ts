/**
 * make-summary — 반자동 외부 재게재 요약 생성기 (blog.md §5-⑤ · §7).
 *
 * 무엇을 하나: 발행된(draft 아님) 글의 7단계 본문에서 섹션을 뽑아
 *   **플랫폼마다 톤·형식·끌어오는 부분을 다르게** 한 요약 *초안* 과 canonical 링크를 조립해
 *   content/summaries/<slug>.summary.json 으로 떨군다.
 *     - Medium(EN)  : 인용형 훅 + 개념 비유 3줄 + "코드까지 다룬다" — 전문적 톤
 *     - Velog(KR)   : 캐주얼 도입 + 훅 + 핵심 한 방 + 흐름 안내 — 동료 말투
 *     - Tistory(KR) : 훅 + description + "함께 점검하는 것" 리스트 — 검색 친화
 *   각 canonical = 자기 언어 원본(§5-1). "전문 보기" 링크로 호기심 유발 + 출처 신호.
 *
 * 무엇을 안 하나: 플랫폼에 실제 게시(API 포스팅)는 하지 않는다 — 사람이 검수 후 게시.
 *   status: "draft" 로 표시한다. 게시 산출물은 make-export.ts 가 만든다.
 *
 * 사용: npm run summary            (발행된 모든 글)
 *       npm run summary -- <slug>  (특정 슬러그만)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parsePost } from "./lib/frontmatter.ts";
import { ROOT, listPosts, type PostFile } from "./lib/posts.ts";

const SUMMARIES_DIR = join(ROOT, "content", "summaries");

interface Parsed {
  fm: Record<string, unknown>;
  body: string;
  file: PostFile;
}

// ── 본문 추출 헬퍼 (7단계 템플릿: `## 1.`~`## 6.`) ───────────────────────────
/** 마크다운 장식·MDX주석·링크를 걷어 한 줄 평문으로. */
function clean(s: string): string {
  return s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** `## N. heading` 과 다음 `##`(또는 끝) 사이를 {heading, content}로. */
function section(body: string, n: number): { heading: string; content: string } | null {
  const m = body.match(new RegExp(`##\\s*${n}\\.\\s*([^\\n]*)\\n([\\s\\S]*?)(?=\\n##\\s|$)`));
  return m ? { heading: clean(m[1]), content: m[2].trim() } : null;
}

/** 섹션 본문의 불릿(`- ` / `- [ ] `)들을 평문 배열로. */
function bullets(content: string): string[] {
  return content
    .split(/\r?\n/)
    .filter((l) => /^\s*-\s/.test(l))
    .map((l) => clean(l.replace(/^\s*-\s*(\[.\]\s*)?/, "")))
    .filter(Boolean);
}

/** 첫 문장만(마침표/물음표/느낌표·종결 경계). */
function firstSentence(s: string): string {
  const m = s.match(/^.*?[.。!?](\s|$)/);
  return (m ? m[0] : s).trim();
}

/** 길면 단어 경계에서 부드럽게 자르고 … 붙인다. */
function clampSoft(s: string, n: number): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).trimEnd() + "…";
}

/** 개념 섹션의 "즉 …" / "So …" 정리 한 문장. */
function punchline(sec2: string): string {
  const line = sec2.split(/\r?\n/).map((l) => l.trim()).find((l) => /^(즉|So )/.test(l));
  return line ? clean(line) : "";
}

const hookOf = (p: Parsed) => clean(section(p.body, 1)?.content ?? "");
const canonOf = (p: Parsed) => String(p.fm.canonical);

/**
 * 본문 "전문 보기" CTA 링크에 UTM을 단다 — 어느 플랫폼에서 유입됐는지 추적.
 * canonical(출처 신호·rel=canonical)은 건드리지 않는다: 깨끗한 원본 URL 유지.
 *   utm_source=<플랫폼> · utm_medium=referral · utm_campaign=<slug>
 */
function ctaLink(p: Parsed, source: PlatformKey): string {
  const url = canonOf(p);
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}utm_source=${source}&utm_medium=referral&utm_campaign=${p.file.slug}`;
}
type PlatformKey = "medium" | "velog" | "tistory";

// ── 플랫폼별 본문 (톤·형식·끌어오는 부분 모두 다름) ──────────────────────────
/** Medium(EN): 인용형 훅 → 개념 비유 3줄 → "코드까지" → CTA. */
function mediumBody(p: Parsed): string {
  const analogies = bullets(section(p.body, 2)?.content ?? "").map(firstSentence).slice(0, 3);
  const covered = [3, 4, 5].map((n) => section(p.body, n)?.heading.toLowerCase()).filter(Boolean).join(", ");
  const out = [`> ${hookOf(p)}`, ""];
  if (analogies.length) {
    out.push("Three tools, three different jobs:");
    analogies.forEach((a) => out.push(`- ${a}`));
    out.push("");
  }
  if (covered) out.push(`The full post walks through ${covered} — with working code.`, "");
  out.push(`👉 Read the full breakdown: ${ctaLink(p, "medium")}`);
  return out.join("\n");
}

/** Velog(KR): 캐주얼 도입 → 훅 → 핵심 한 방 → 흐름 안내 → CTA. */
function velogBody(p: Parsed): string {
  const punch = punchline(section(p.body, 2)?.content ?? "");
  const flow = [3, 4, 5].map((n) => section(p.body, n)?.heading).filter(Boolean).join(" → ");
  const out = [`${String(p.fm.title)} — 짧게 정리하고 갑니다.`, "", hookOf(p)];
  if (punch) out.push("", punch);
  if (flow) out.push("", `원문에는 ${flow}까지 코드로 정리돼 있어요.`);
  out.push("", `👉 전문 보기: ${ctaLink(p, "velog")}`);
  return out.join("\n");
}

/** Tistory(KR): 훅 + description → "함께 점검하는 것" 리스트 → CTA. */
function tistoryBody(p: Parsed): string {
  const desc = clean(String(p.fm.description ?? ""));
  const checks = bullets(section(p.body, 6)?.content ?? "").map((c) => clampSoft(c, 90)).slice(0, 3);
  const out = [hookOf(p)];
  if (desc) out.push("", desc);
  if (checks.length) {
    out.push("", "이 글에서 함께 점검하는 것:");
    checks.forEach((c) => out.push(`- ${c}`));
  }
  out.push("", "자세한 코드와 공격 시나리오는 원문에서 확인하세요.", "", `👉 전문 보기: ${ctaLink(p, "tistory")}`);
  return out.join("\n");
}

function tagsOf(fm: Record<string, unknown>): string[] {
  const axis = Array.isArray(fm.axis) ? (fm.axis as string[]) : [];
  return ["security", String(fm.level), ...(fm.series ? [String(fm.series)] : []), ...axis];
}

function entry(p: Parsed, body: string) {
  return {
    lang: String(p.fm.lang),
    canonical: canonOf(p), // 자기 언어 원본 (§5-1)
    title: String(p.fm.title),
    body,
    tags: tagsOf(p.fm),
  };
}

// ── 글 수집: slug → { ko?, en? }, draft 제외 ────────────────────────────────
const argSlug = process.argv[2]?.replace(/\.mdx$/, ""); // .mdx 붙여도 허용
let argExists = false; // 해당 슬러그 파일이 존재하긴 했는가(draft 포함)
const bySlug = new Map<string, { ko?: Parsed; en?: Parsed }>();
for (const file of [...listPosts("ko"), ...listPosts("en")]) {
  if (argSlug && file.slug !== argSlug) continue;
  argExists = true;
  const { data, body } = parsePost(file.path);
  if (data.draft === true) continue; // 발행된 글만 요약
  const e = bySlug.get(file.slug) ?? {};
  e[file.lang] = { fm: data, body, file };
  bySlug.set(file.slug, e);
}

if (bySlug.size === 0) {
  if (!argSlug) console.log("발행된 글 없음 — 생성할 요약 없음.");
  else if (argExists) console.log(`건너뜀: ${argSlug} 는 draft 상태. 발행(frontmatter의 draft 제거) 후 다시 실행하세요.`);
  else console.log(`대상 없음: ${argSlug} — content/posts/{ko,en}/${argSlug}.mdx 가 없습니다.`);
  process.exit(0);
}

mkdirSync(SUMMARIES_DIR, { recursive: true });
let written = 0;
for (const [slug, langs] of bySlug) {
  const platforms: Record<string, unknown> = {};
  if (langs.en) platforms.medium = entry(langs.en, mediumBody(langs.en));
  if (langs.ko) {
    platforms.velog = entry(langs.ko, velogBody(langs.ko));
    platforms.tistory = entry(langs.ko, tistoryBody(langs.ko));
  }
  const out = {
    _doc: "외부 재게재 요약 초안(자동 생성). 플랫폼별 톤·형식 상이. status:draft → 사람 검수 후 게시. 게시 산출물은 make-export. canonical=자기 언어 원본.",
    slug,
    generated: String((langs.ko ?? langs.en)!.fm.date ?? ""),
    status: "draft",
    platforms,
  };
  const path = join(SUMMARIES_DIR, `${slug}.summary.json`);
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`✓ ${slug} → ${Object.keys(platforms).join(", ")}`);
  written++;
}
console.log(`\nmake-summary: ${written} summary draft(s) written to content/summaries/.`);
