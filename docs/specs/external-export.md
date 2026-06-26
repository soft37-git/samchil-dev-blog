# 외부 재게재 export 라인
#spec #완료

> 요약 초안(`*.summary.json`)을 **플랫폼별 붙여넣기 산출물 + 수동 게시 체크리스트**로 변환하는 라인.
> 게시 자동화는 하지 않는다(게시는 사람). → [[decisions/20260627-external-publish-export-only]] · [[blog]] §5

## 1. 위치
- 라인: `① /blog-next 발행 → ② npm run summary(요약 초안) → ③ npm run export(붙여넣기 산출물) → ④ 사람이 수동 게시`
- ③이 이번에 추가할 구간. `scripts/make-export.ts`, `npm run export [-- <slug>]`.

## 2. 입출력
- 입력: `content/summaries/<slug>.summary.json` (make-summary 산출, `platforms.{medium,velog,tistory}`)
- 출력: `content/exports/<slug>/{medium,velog,tistory}.md` + `<slug>/_post.md`(게시 체크리스트)
- 멱등: 재실행 시 덮어쓰기. summary가 draft면 export도 "검수 전" 헤더 표기.

## 3. 플랫폼별 산출물 규칙
각 `.md`는 그대로 복사해 붙이면 되는 상태. 본문은 summary.body 재사용 — **make-summary가 플랫폼마다 톤·형식·끌어오는 섹션을 다르게** 생성한다(Medium=인용훅+개념비유, Velog=캐주얼+핵심한방, Tistory=훅+description+점검리스트). 전문 아닌 호기심 유발 티저(코드·공격 상세 없음, canonical 링크로 유도).
- **medium.md (EN)**: 제목 / 본문(Markdown 붙여넣기 가능) / 태그 **≤5**(초과 시 잘라내고 표시). canonical은 본문 링크 + 게시 시 `Story settings → Advanced → Canonical link`에 사이트 원본 입력(Medium은 canonical 수동 설정 가능 — 유일하게 메타 canonical 가능).
- **velog.md (KR)**: 제목 / 본문(Markdown 네이티브) / 태그. canonical 설정 UI 없음 → 본문 "전문 보기" 링크가 출처 신호.
- **tistory.md (KR)**: 제목 / 본문 / 태그 + **카테고리 지정 안내**(필수 수동). canonical 설정 없음 → 본문 링크.

## 4. _post.md 체크리스트(수동 단계)
플랫폼별 한 블록: ⬜ 붙여넣기 ⬜ 태그 입력 ⬜ (medium)canonical 설정 ⬜ (tistory)카테고리 ⬜ 발행. 원본 글 URL·생성일 표기.

## 5. 선택 기능(후순위)
- `--copy <platform>`: 해당 플랫폼 본문을 macOS `pbcopy`로 클립보드 복사.
- 본문 길이/태그 한도 위반 검증을 `npm run ci`에 편입.

## 6. 안 하는 것
- 플랫폼 자동 로그인·자동 게시·자동 클릭. (게시는 사람 확인 후 — 원칙)
