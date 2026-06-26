---
description: Produce the next blog post in EN + KR from researched, cross-validated sources, then generate external re-publish paste artifacts.
---

You are the content-factory orchestrator for `samchil.dev/blog`. This repo is **content + automation only** — never add rendering/theme code. Read `blog.md` (the playbook) and obey `CLAUDE.md`.

Run these phases in order. Stop and report if any quality gate fails.

## Phase 0 — Backlog health (사용자 규칙 1)
1. Run `npm run backlog:check`.
2. If it prints `REPLENISH NEEDED` (unwritten topics < 5):
   - `WebSearch` for candidate security topics that **do not overlap** any existing slug (list shown by the script) and fit the L1→L4 ladder + 4축(access/input/failsafe/trace).
   - Selection criteria (blog.md §1–§2): expert-curriculum framing (no "공부 일기"), one ladder level, a target long-tail keyword, alignment with a product-grade rung.
   - Append exactly **5** new topics to `backlog/topics.json` with `status: "todo"`. Do not duplicate slugs.

## Phase 1 — Pick next topic
Choose the lowest-`week` topic with `status: "todo"`. Set it to `"researching"` in `backlog/topics.json`.

## Phase 2 — Research with cross-validation (사용자 규칙 2)
- `WebSearch` + fetch **high-trust sources only** (primary first: RFC/spec/vendor docs/CVE records; reputable secondary: MDN/OWASP).
- **Every factual claim needs ≥2 independent sources.** Record each in `content/data/<slug>.sources.json`:
  - per-claim `statement`, `sources[]` (title, publisher, url, tier, accessed), `crossChecked` (true only when ≥2 independent), `note`.
  - `summarySources`: the short list the post is allowed to name (e.g. "MDN · OWASP · RFC 2104").
- A claim with `crossChecked: false` **may not be stated as fact** in the post.

## Phase 3 — Write KO draft → adapt EN (사용자 규칙 3 + blog.md §3, §5)
- Author `content/posts/ko/<slug>.mdx` following the **7-step template, order fixed**. The Decision/Why/Rejected table in step 5 is mandatory.
- The blog body shows **summarized sources only** (summarySources). Detailed citations stay in `content/data/` — never paste the full source list into the post.
- Adapt to `content/posts/en/<slug>.mdx`: **code identical** (comments translated), prose natural English. Set `hreflang`/`canonical` as a pair (§5-1).
- Fill frontmatter per `schema/frontmatter.ts`. Remove `draft` only when ready to publish.

## Phase 4 — Gate (blog.md §6)
1. `npm run validate` (frontmatter + ko/en pairing) — must pass.
2. `npm run gate` (Decision/Why/Rejected table, ≥2 code blocks, sources file present, tone) — must pass.
3. On success set the topic to `status: "drafted"`. Report what was written and any warnings for human review.

## Phase 5 — External re-publish artifacts (사용자 규칙: 게시는 사람 확인 후)
Only meaningful once the post is **published** (frontmatter `draft` removed). Official posting APIs are dead for all three platforms → we generate paste-ready files only, never auto-post. → `docs/decisions/20260627-external-publish-export-only.md` · `docs/specs/external-export.md`
1. `npm run summary -- <slug>` → `content/summaries/<slug>.summary.json` (en→Medium, ko→Velog/Tistory; canonical = own-language original, §5-1).
   - If it reports the post is still `draft`, that's expected for an unpublished post — note it and skip Phase 5's rest (no external artifacts until published).
2. `npm run export -- <slug>` → `content/exports/<slug>/{medium,velog,tistory}.md` + `_post.md` checklist.
3. Report the exports path and remind: **posting is manual** — follow `_post.md`. Do **not** log into platforms or auto-post.

Never publish a post that fails a gate. Verified, cross-checked, paired — or it does not ship. External re-publishing stops at paste-ready artifacts; a human posts.
