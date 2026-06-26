# INDEX
> 마지막 업데이트: 2026-06-27 (export 라인 + /blog-next Phase 5 + 플랫폼별 차별 요약 + CTA UTM — 외부 배포 완료)

## 프로젝트
- [[PROJECT]] — 전체 상태 및 진행현황

## 스펙
- [[blog]] — 블로그 운영·작성 원칙서(Playbook): 7단계 템플릿·4축·한영 파이프라인·품질게이트
- [[schema/frontmatter]] — frontmatter 스키마 SSOT (필드명 고정)
- [[docs/specs/external-export]] — 외부 재게재 export 라인(붙여넣기 산출물+체크리스트, 게시는 수동)

## 자동화
- [[.claude/commands/blog-next]] — `/blog-next` 오케스트레이터(백로그보충→리서치→ko/en→게이트→요약→export)
- `scripts/` — validate-frontmatter · quality-gate · check-backlog · make-summary(요약 초안) · make-export(플랫폼별 붙여넣기 산출물)
- `backlog/topics.json` — 주제 백로그 SSOT(<5면 보충)
- `.github/workflows/` — quality-gate(검증·게이트) · publish(본 사이트 submodule 포인터 bump)

## 결정 로그
- [[docs/decisions/20260627-blog-factory-skeleton]] — 팩토리 뼈대(구동=Claude Code 커맨드·검증=TS·교차검증 데이터 분리)
- [[docs/decisions/20260626-publish-via-submodule-pointer]] — 발행 전파를 Deploy Hook→submodule 포인터 bump로 전환
- [[docs/decisions/20260627-blog-publish-live]] — 첫 글 라이브 게재(레포 public 전환 + 커밋 author 매칭)
- [[docs/decisions/20260627-external-publish-export-only]] — 외부 게시 API 폐기·export-only 수동 게시 채택

## 세션 아카이브
- (없음)
