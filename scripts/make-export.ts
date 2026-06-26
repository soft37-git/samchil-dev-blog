/**
 * make-export — 외부 재게재 "붙여넣기 산출물" 생성기 (docs/specs/external-export.md).
 *
 * 무엇을 하나: content/summaries/<slug>.summary.json(make-summary 산출)을 읽어
 *   플랫폼별로 그대로 복사해 붙이면 되는 파일과 수동 게시 체크리스트를 떨군다.
 *     content/exports/<slug>/{medium,velog,tistory}.md   ← 제목·본문·태그
 *     content/exports/<slug>/_post.md                     ← 게시 체크리스트(수동 단계)
 *
 * 무엇을 안 하나: 플랫폼 로그인·자동 게시·자동 클릭을 하지 않는다 — 게시는 사람이 확인 후.
 *   (공식 게시 API 전멸 → export-only 채택. docs/decisions/20260627-external-publish-export-only.md)
 *
 * 사용: npm run export                         (요약이 있는 모든 글)
 *       npm run export -- <slug>               (특정 슬러그만)
 *       npm run export -- <slug> --copy velog  (해당 플랫폼 본문을 클립보드로, macOS)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/posts.ts";

const SUMMARIES_DIR = join(ROOT, "content", "summaries");
const EXPORTS_DIR = join(ROOT, "content", "exports");

// 플랫폼별 정책: 태그 한도 + 게시 시 사람이 확인할 항목(canonical/카테고리 차이).
const PLATFORM = {
  medium: {
    label: "Medium (EN)",
    tagMax: 5,
    canonicalNote: (url: string) =>
      `Story settings → Advanced → "Canonical link" 에 원본 입력: ${url}`,
  },
  velog: {
    label: "Velog (KR)",
    tagMax: 10,
    canonicalNote: () => "canonical 설정 UI 없음 — 본문 '전문 보기' 링크가 출처 신호",
  },
  tistory: {
    label: "Tistory (KR)",
    tagMax: 10,
    canonicalNote: () => "카테고리 선택 필수 · canonical 설정 없음 — 본문 출처 링크로 대체",
  },
} as const;
type PlatformKey = keyof typeof PLATFORM;
const ORDER: PlatformKey[] = ["medium", "velog", "tistory"];

interface Entry {
  lang: string;
  canonical: string;
  title: string;
  body: string;
  tags: string[];
}
interface Summary {
  slug: string;
  generated?: string;
  status?: string;
  platforms: Partial<Record<PlatformKey, Entry>>;
}

/** 태그를 한도 내로 자르고, 잘린 게 있으면 함께 알린다. */
function clampTags(tags: string[], max: number): { kept: string[]; dropped: string[] } {
  return { kept: tags.slice(0, max), dropped: tags.slice(max) };
}

/** 한 플랫폼의 붙여넣기 파일(제목·본문·태그). */
function platformFile(key: PlatformKey, e: Entry, draft: boolean): string {
  const cfg = PLATFORM[key];
  const { kept, dropped } = clampTags(e.tags, cfg.tagMax);
  const tagLine = kept.join(", ");
  const dropNote = dropped.length
    ? `\n> ⚠️ 태그 한도(${cfg.tagMax}) 초과로 제외: ${dropped.join(", ")}`
    : "";
  const draftNote = draft
    ? "\n> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요."
    : "";
  return [
    `<!-- ${cfg.label} 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->${draftNote}`,
    "",
    "## 제목",
    e.title,
    "",
    "## 본문",
    e.body,
    "",
    `## 태그 (${kept.length})${dropNote}`,
    tagLine,
    "",
  ].join("\n");
}

/** 슬러그 전체의 수동 게시 체크리스트. */
function checklist(s: Summary, present: PlatformKey[]): string {
  const lines = [
    `# 외부 게시 체크리스트 — ${s.slug}`,
    `> 생성일 ${s.generated ?? "?"} · 게시는 사람이 확인 후(자동 게시 없음).`,
    "",
  ];
  for (const key of present) {
    const cfg = PLATFORM[key];
    const e = s.platforms[key]!;
    lines.push(
      `## ${cfg.label}  →  ${key}.md`,
      `- ⬜ ${key}.md 의 제목·본문 붙여넣기`,
      `- ⬜ 태그 입력 (한도 ${cfg.tagMax})`,
      `- ⬜ ${cfg.canonicalNote(e.canonical)}`,
      `- ⬜ 발행`,
      "",
    );
  }
  return lines.join("\n");
}

// ── 대상 수집 ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const copyIdx = args.indexOf("--copy");
const copyPlatform = copyIdx !== -1 ? (args[copyIdx + 1] as PlatformKey | undefined) : undefined;
const argSlug = args.find((a) => !a.startsWith("--") && a !== copyPlatform)?.replace(/\.summary\.json$/, "");

let files: string[];
try {
  files = readdirSync(SUMMARIES_DIR).filter((f) => f.endsWith(".summary.json"));
} catch {
  console.log("content/summaries/ 가 없습니다. 먼저 `npm run summary` 를 실행하세요.");
  process.exit(0);
}
if (argSlug) files = files.filter((f) => f === `${argSlug}.summary.json`);

if (files.length === 0) {
  console.log(
    argSlug
      ? `대상 없음: ${argSlug} — content/summaries/${argSlug}.summary.json 가 없습니다. (먼저 npm run summary -- ${argSlug})`
      : "요약 없음 — 생성할 export 없음. 먼저 `npm run summary`.",
  );
  process.exit(0);
}

// ── 생성 ─────────────────────────────────────────────────────────────────────
let written = 0;
for (const file of files) {
  const s = JSON.parse(readFileSync(join(SUMMARIES_DIR, file), "utf8")) as Summary;
  const present = ORDER.filter((k) => s.platforms[k]);
  if (present.length === 0) continue;
  const draft = s.status === "draft";
  const dir = join(EXPORTS_DIR, s.slug);
  mkdirSync(dir, { recursive: true });
  for (const key of present) {
    writeFileSync(join(dir, `${key}.md`), platformFile(key, s.platforms[key]!, draft));
  }
  writeFileSync(join(dir, "_post.md"), checklist(s, present));
  console.log(`✓ ${s.slug} → ${present.join(", ")} (+ _post.md)`);
  written++;

  // --copy: 단일 슬러그·단일 플랫폼일 때만 본문을 클립보드로(macOS pbcopy).
  if (copyPlatform && argSlug && s.platforms[copyPlatform]) {
    try {
      execFileSync("pbcopy", { input: s.platforms[copyPlatform]!.body });
      console.log(`  ↳ ${copyPlatform} 본문을 클립보드에 복사했습니다.`);
    } catch {
      console.log(`  ↳ pbcopy 실패(비-macOS?) — ${copyPlatform}.md 에서 수동 복사하세요.`);
    }
  } else if (copyPlatform && !argSlug) {
    console.log("  ↳ --copy 는 슬러그 지정과 함께 쓰세요: npm run export -- <slug> --copy <platform>");
  }
}
console.log(`\nmake-export: ${written} 건 → content/exports/. 게시는 _post.md 체크리스트대로 수동 진행.`);
