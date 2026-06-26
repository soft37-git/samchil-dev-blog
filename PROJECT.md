# Samchil Blog — 콘텐츠 팩토리
> 버전: 0.1.0 | 마지막 업데이트: 2026-06-27 (외부 배포 export 라인 완성 + 플랫폼별 차별 요약 + CTA UTM)

이 레포 = **콘텐츠(MDX ko/en) + 자동화**만. 렌더링은 본 사이트(samchil-dev)가 전담. URL은 `samchil.dev/blog` 단일 오리진. → [[blog]] §9 · [[docs/decisions/20260627-blog-factory-skeleton]]

## 🟢 뼈대
### 🟢 디렉터리·스키마·스크립트·CI
content/{posts/{ko,en},data} · backlog · schema · scripts · .github · .claude/commands 구성 완료.

## 🔵 자동화 라인
### 🟢 오케스트레이터 `/blog-next`
3대 규칙(백로그보충·교차검증리서치·ko→en) 프롬프트화. `.claude/commands/blog-next.md`.
### 🟢 검증 스크립트
validate-frontmatter · quality-gate(§6) · check-backlog(<5 신호). `npm run ci`.
### 🟢 첫 실제 글 (W1·W2)
W2 `hash-vs-encryption-hmac`(L1, access·trace) + W1 `tokens-keys-signatures`(L1, access) 모두 교차검증 리서치 기반 EN/KR 완성·게이트 통과(draft 아님). W1 스텁 → 정식 글 승격(token vs key vs signature, RFC 6750·SigV4 근거).
> 다음: `/blog-next` 실행해 W3 `hmac-signing-done-right`(L2) 작성.

## 🔵 백로그
### 🔵 시드 8주(§8)
W1~W8 topics.json에 등록. W1·W2 drafted(실글), W3~W8 todo.

## 🟢 본 사이트 연동
### 🟢 submodule `blog/` 소비 + Vercel 빌드
본 사이트(soft37-git/samchil-dev)가 이 레포를 submodule(`blog/`)로 물고 `/blog`·`/blog/ko` 렌더. **이 레포 public 전환**으로 Vercel 빌드의 submodule fetch 성공 → W2 라이브 게재 확인(`samchil.dev/blog/hash-vs-encryption-hmac`).
### 🟢 발행 전파 = submodule 포인터 bump
`publish.yml`이 content/posts 변경 시 본 사이트 포인터 bump → Vercel 빌드. `MAIN_REPO_PAT` 등록 완료, 커밋 author는 GitHub 매칭 noreply여야 Vercel 통과(이슈 해결). → [[docs/decisions/20260626-publish-via-submodule-pointer]] · [[docs/decisions/20260627-blog-publish-live]]

## 🟢 외부 배포
### 🟢 요약 초안 생성(반자동)
`scripts/make-summary.ts`(`npm run summary`) → `content/summaries/<slug>.summary.json`. en→Medium, ko→Velog/Tistory, canonical=자기 언어 원본, status:draft. **플랫폼별 톤·형식·끌어오는 섹션 차별화**(Medium 비유·Velog 한방·Tistory 점검리스트), 호기심형 티저. 본문 CTA 링크엔 플랫폼별 UTM(`utm_source=<플랫폼>`·`medium=referral`·`campaign=<slug>`); canonical은 깨끗하게 유지.
### 🔴 플랫폼 API 자동 게시 (폐기)
실측 결과 공식 게시 API 전멸: Tistory 종료·Medium 신규토큰 중단(미보유)·Velog 부재. REST 자동 게시 불가. → [[docs/decisions/20260627-external-publish-export-only]]
### 🟢 export-only 수동 게시 라인
`scripts/make-export.ts`(`npm run export [-- <slug>] [--copy <platform>]`) → `content/exports/<slug>/{medium,velog,tistory}.md` + `_post.md` 체크리스트. `/blog-next` Phase 5에 편입(요약→export 자동, 게시는 사람). W2로 검증 완료. → [[docs/specs/external-export]]
> 다음: 발행된 글마다 `/blog-next`가 export까지 생성 → `_post.md` 따라 수동 게시.
