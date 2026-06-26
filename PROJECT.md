# Samchil Blog — 콘텐츠 팩토리
> 버전: 0.1.0 | 마지막 업데이트: 2026-06-27

이 레포 = **콘텐츠(MDX ko/en) + 자동화**만. 렌더링은 본 사이트(samchil-dev)가 전담. URL은 `samchil.dev/blog` 단일 오리진. → [[blog]] §9 · [[docs/decisions/20260627-blog-factory-skeleton]]

## 🟢 뼈대
### 🟢 디렉터리·스키마·스크립트·CI
content/{posts/{ko,en},data} · backlog · schema · scripts · .github · .claude/commands 구성 완료.

## 🔵 자동화 라인
### 🟢 오케스트레이터 `/blog-next`
3대 규칙(백로그보충·교차검증리서치·ko→en) 프롬프트화. `.claude/commands/blog-next.md`.
### 🟢 검증 스크립트
validate-frontmatter · quality-gate(§6) · check-backlog(<5 신호). `npm run ci`.
### 🔵 첫 실제 글
W1 `tokens-keys-signatures`는 현재 **스텁(draft)**. 라이브 리서치로 교체 필요.
> 다음: `/blog-next` 실행해 W1을 실제 리서치 기반 EN/KR 완성글로 교체(draft 제거).

## 🔵 백로그
### 🔵 시드 8주(§8)
W1~W8 topics.json에 등록. W1 drafted(스텁), W2~W8 todo.

## ⚪ 본 사이트 연동
### ⚪ submodule `content/` 소비
본 사이트가 이 레포를 git submodule로 물고 `/blog` 렌더(별도 작업, samchil-dev 측).
### ⚪ Deploy Hook 시크릿
`VERCEL_DEPLOY_HOOK_URL` repo secret 등록 시 자동 발행 트리거 활성.

## ⚪ 외부 배포
### ⚪ Medium(EN)·Velog/Tistory(KR) 요약 재게재
canonical = 자기 언어 원본. 발행 후 수동.
