/**
 * make-summary — 반자동 외부 재게재 요약 생성기 (blog.md §5-⑤ · §7).
 *
 * 무엇을 하나: 발행된(draft 아님) 글에서 frontmatter + "1. 한 줄 위협" 훅을 뽑아
 *   플랫폼별 ~300자 요약 *초안* 과 canonical 링크를 조립해
 *   content/summaries/<slug>.summary.json 으로 떨군다.
 *   - en → Medium,  ko → Velog · Tistory  (각 canonical = 자기 언어 원본, §5-1)
 *
 * 무엇을 안 하나: 플랫폼에 실제 게시(API 포스팅)는 하지 않는다 — 사람이 검수 후 게시.
 *   status: "draft" 로 표시한다. 외부 발행 자동화는 추후 작업(PROJECT.md 외부 배포 참고).
 *
 * 사용: npm run summary            (발행된 모든 글)
 *       npm run summary -- <slug>  (특정 슬러그만)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parsePost } from "./lib/frontmatter.ts";
import { ROOT, listPosts, type PostFile } from "./lib/posts.ts";

const SUMMARIES_DIR = join(ROOT, "content", "summaries");
const TEXT_LIMIT = 300; // 요약 본문 목표 길이(링크 줄 제외)

interface Parsed {
  fm: Record<string, unknown>;
  body: string;
  file: PostFile;
}

/** "## 1. …" 와 "## 2. …" 사이 본문(= 한 줄 위협 훅)을 뽑아 한 줄로 정리. */
function extractHook(body: string): string {
  const m = body.match(/##\s*1\.[^\n]*\n([\s\S]*?)\n##\s*2\./);
  if (!m) return "";
  return m[1]
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // MDX 주석 제거
    .replace(/[`*_>#]/g, "")              // 마크다운 장식 제거
    .replace(/\s+/g, " ")
    .trim();
}

/** 단어/문장 경계에서 부드럽게 자르고 … 을 붙인다(한국어 공백 적은 경우 하드컷). */
function clamp(s: string, n: number): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > n * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

function buildBody(p: Parsed): string {
  const hook = extractHook(p.body);
  const description = String(p.fm.description ?? "");
  const lang = String(p.fm.lang);
  const canonical = String(p.fm.canonical);
  const label = lang === "ko" ? "전문 보기" : "Read the full post";
  const joined = [hook, description].filter(Boolean).join(" — ");
  return `${clamp(joined, TEXT_LIMIT)}\n\n👉 ${label}: ${canonical}`;
}

function tagsOf(fm: Record<string, unknown>): string[] {
  const axis = Array.isArray(fm.axis) ? (fm.axis as string[]) : [];
  return ["security", String(fm.level), ...(fm.series ? [String(fm.series)] : []), ...axis];
}

function platformEntry(p: Parsed) {
  return {
    lang: String(p.fm.lang),
    canonical: String(p.fm.canonical), // 자기 언어 원본 (§5-1)
    title: String(p.fm.title),
    body: buildBody(p),
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
  const entry = bySlug.get(file.slug) ?? {};
  entry[file.lang] = { fm: data, body, file };
  bySlug.set(file.slug, entry);
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
  if (langs.en) platforms.medium = platformEntry(langs.en);
  if (langs.ko) {
    platforms.velog = platformEntry(langs.ko);
    platforms.tistory = platformEntry(langs.ko);
  }
  const out = {
    _doc: "외부 재게재 요약 초안(자동 생성). status:draft → 사람 검수 후 게시. 실제 플랫폼 게시는 미자동화(추후). canonical=자기 언어 원본.",
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
