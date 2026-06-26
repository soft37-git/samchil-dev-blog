# Samchil Blog — 콘텐츠 팩토리
> 버전: 0.1.0 | 마지막 업데이트: 2026-06-27 (W2 실글 작성)

이 레포 = **콘텐츠(MDX ko/en) + 자동화**만. 렌더링은 본 사이트(samchil-dev)가 전담. URL은 `samchil.dev/blog` 단일 오리진. → [[blog]] §9 · [[docs/decisions/20260627-blog-factory-skeleton]]

## 🟢 뼈대
### 🟢 디렉터리·스키마·스크립트·CI
content/{posts/{ko,en},data} · backlog · schema · scripts · .github · .claude/commands 구성 완료.

## 🔵 자동화 라인
### 🟢 오케스트레이터 `/blog-next`
3대 규칙(백로그보충·교차검증리서치·ko→en) 프롬프트화. `.claude/commands/blog-next.md`.
### 🟢 검증 스크립트
validate-frontmatter · quality-gate(§6) · check-backlog(<5 신호). `npm run ci`.
### 🟢 첫 실제 글
W2 `hash-vs-encryption-hmac`(L1, access·trace) 교차검증 리서치 기반 EN/KR 완성·게이트 통과(draft 아님). W1은 여전히 스텁(draft).
> 다음: `/blog-next` 실행해 W3 `hmac-signing-done-right` 작성. 여유 시 W1 스텁도 실글로 교체.

## 🔵 백로그
### 🔵 시드 8주(§8)
W1~W8 topics.json에 등록. W1 drafted(스텁)·W2 drafted(실글), W3~W8 todo.

## 🔵 본 사이트 연동
### ⚪ submodule `blog/` 소비
본 사이트(soft37-git/samchil-dev)가 이 레포를 git submodule(`blog/`)로 물고 `/blog` 렌더(별도 작업, samchil-dev 측).
### 🔵 발행 전파 = submodule 포인터 bump
`publish.yml`이 content/posts 변경 시 본 사이트 포인터를 최신 SHA로 올려 Vercel 빌드 트리거. Deploy Hook 방식 폐기. → [[docs/decisions/20260626-publish-via-submodule-pointer]]
> 다음: 본 사이트 레포에 `MAIN_REPO_PAT`(fine-grained, Contents:RW) 시크릿 등록.

## 🔵 외부 배포
### 🟢 요약 초안 생성(반자동)
`scripts/make-summary.ts`(`npm run summary`) → `content/summaries/<slug>.summary.json`. en→Medium, ko→Velog/Tistory, canonical=자기 언어 원본. status:draft.
### ⚪ 외부 발행 자동화 (추후)
플랫폼 API 게시(Medium/Velog/Tistory)는 **아직 미구현 — 수동 게시**. 인증·외부 발행이라 신중히, 추후 별도 워크플로로 자동화 예정(초안 생성까지만 자동, 게시는 사람 확인 후).
> 다음: 요약 초안 톤 검수 후 수동 게시. 자동 게시는 별도 세션.
