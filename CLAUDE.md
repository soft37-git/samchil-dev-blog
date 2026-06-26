# CLAUDE.md

> 이 파일은 Claude의 행동 규칙 정의서다.
> 모든 세션은 이 파일을 먼저 읽고 시작한다.

---

## 1. 파일 구조 (변경 금지)

```
/
├── CLAUDE.md          ← 이 파일. 규칙 정의. 수정하지 않는다.
├── PROJECT.md         ← 전체 프로젝트 SSOT
└── INDEX.md           ← 모든 문서의 진입점
```

하위 문서가 필요할 경우:

```
/docs/
├── specs/[기능명].md
├── decisions/[YYYYMMDD]-[주제].md
└── archive/[YYYYMMDD]-session.md
```

**규칙: 위 구조 외 위치에 .md 파일을 생성하지 않는다.**

---

## 2. PROJECT.md 구조 규칙

### 2-1. 계층 구조

```
# [프로젝트명]              ← H1: 하나만 존재
## [파트/기능]              ← H2: 주요 영역
### [세부작업]              ← H3: 실행 단위
본문                        ← 결정사항, 메모, 링크
```

### 2-2. 상태 아이콘 (H2, H3 앞에 반드시 표시)

| 아이콘 | 상태 |
|--------|------|
| 🟢 | 완료 |
| 🔵 | 진행 중 |
| 🟡 | 보류 |
| ⚪ | 시작 안함 |
| 🔴 | 폐기 |

### 2-3. PROJECT.md 예시 형식

```markdown
# SendItWhenever
> 버전: 0.3.0 | 마지막 업데이트: 2025-06-XX

## 🟢 Auth
### 🟢 Magic Link 연동
Auth.js + Loops 사용. 완료.

## 🔵 Scheduler
### 🟢 BullMQ 구조 설계
Redis + BullMQ 결정. → [[decisions/20250614-bullmq]]
### 🔵 Upstash 연동
진행 중. connection limit 확인 필요.
### ⚪ 모니터링 UI

## 🟡 Billing
### 🟡 Lemon Squeezy 연동
플랜 구조 미확정으로 보류.

## ⚪ Marketing
### ⚪ Product Hunt 준비
### ⚪ Waitlist 페이지
```

### 2-4. PROJECT.md 크기 제한

- H2 섹션 하나당 본문 **5줄 이하**
- 상세 내용은 `/docs/specs/` 파일로 분리하고 `[[링크]]`만 남긴다
- 전체 파일 **100줄 초과 금지**. 초과 시 오래된 완료 항목을 archive로 이동

---

## 3. INDEX.md 구조 규칙

INDEX.md는 모든 문서의 지도다. 자동으로 최신 상태를 유지한다.

```markdown
# INDEX
> 마지막 업데이트: YYYY-MM-DD

## 프로젝트
- [[PROJECT]] — 전체 상태 및 진행현황

## 스펙
- [[docs/specs/webhook]] — Webhook 스케줄러 상세
- [[docs/specs/billing]] — 결제 플로우

## 결정 로그
- [[docs/decisions/20250614-bullmq]] — BullMQ 선택 이유
- [[docs/decisions/20250610-auth]] — Auth 방식 결정

## 세션 아카이브
- [[docs/archive/20250615-session]] — Upstash 연동 작업
```

---

## 4. 세션 규칙

### 세션 시작 시 (필수)

1. `CLAUDE.md` 읽기
2. `INDEX.md` 읽기
3. `PROJECT.md`에서 🔵 항목 확인
4. 아래 형식으로 세션 목표 확인 후 작업 시작:

```
[이해한 현재 상태 한 줄]
[이번 세션 목표 한 줄]
시작할까요?
```

### 세션 종료 시 (필수)

1. `PROJECT.md` 상태 아이콘 업데이트
2. 결정사항 있으면 `/docs/decisions/YYYYMMDD-[주제].md` 생성 후 INDEX.md에 추가
3. `INDEX.md` 링크 목록 업데이트
4. 다음 세션을 위해 PROJECT.md의 🔵 섹션 본문에 한 줄 메모 추가:

```
> 다음: [다음에 할 일 한 줄]
```

### 세션 중 금지사항

- 목표 범위 외 작업을 요청받으면 **먼저 알리고** 진행 여부를 묻는다
- 새 .md 파일 생성 전 반드시 기존 파일에 통합 가능한지 확인한다
- PROJECT.md를 100줄 이상으로 만들지 않는다

---

## 5. decisions 파일 규칙

결정 파일은 **append-only** — 수정하지 않고 추가만 한다.

```markdown
# [주제]
- 날짜: YYYY-MM-DD
- 결정: [선택한 것]
- 이유: [이유]
- 폐기 옵션: [고려했지만 버린 것과 이유]
```

---

## 6. Obsidian 연동 메모 (Claude가 지킬 규칙)

- 파일 간 참조는 반드시 `[[파일명]]` 형식 사용 (Obsidian 내부 링크)
- 외부 링크는 `[텍스트](URL)` 형식
- 태그는 `#tag` 형식으로 H1 바로 아래에 모아서 작성:

```markdown
# 기능명
#spec #진행중
```

---

## 7. Claude가 스스로 판단하는 기준

| 상황 | 행동 |
|------|------|
| 새 기능 논의 시작 | PROJECT.md에 ⚪ H3 추가 |
| 작업 시작 | 🔵로 변경 |
| 작업 완료 | 🟢로 변경, 본문에 완료 메모 |
| 방향 바뀜 | 🔴로 변경, decisions 파일에 기록 |
| 상세 스펙 필요 | /docs/specs/ 파일 생성 후 PROJECT.md에 [[링크]]만 |
| 세션 끝 | INDEX.md 갱신 후 세션 종료 |
