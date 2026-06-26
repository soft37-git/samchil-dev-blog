# 첫 글 라이브 게재 — submodule public 전환 + 커밋 author 매칭
- 날짜: 2026-06-27
- 결정 1 (커밋 author): `publish.yml`의 포인터 bump 커밋 author 이메일을 GitHub 계정에 매칭되는 noreply(`293581528+soft37-git@users.noreply.github.com`)로 고정한다.
  - 이유: `bot@samchil.dev`는 어떤 GitHub 계정에도 매칭되지 않아(author_login=null) Vercel이 배포를 차단했다. Vercel은 배포를 커밋 author의 GitHub 계정에 귀속시킨다.
  - 폐기 옵션: Vercel에 `bot@samchil.dev` 추가 — 임의 이메일은 GitHub 계정이 아니라 귀속 대상이 없음. 부적합.
- 결정 2 (submodule 접근): blog 콘텐츠 레포를 **public**으로 전환한다.
  - 이유: 본 사이트 빌드가 private submodule을 못 받아(`Failed to fetch one or more git submodules`) `generateStaticParams`가 0개 → `dynamicParams=false`라 개별 글 전부 404. public이면 인증 없이 클론되어 해결. 발행 콘텐츠는 어차피 공개 대상.
  - 트레이드오프: 플레이북·전략 문서(blog.md·PROJECT.md·decisions)와 draft 스텁 소스도 공개됨. 전략 비공개가 필요하면 private 유지 + Vercel Install Command 토큰 주입(GH_PAT)으로 대체 가능.
  - 폐기 옵션: Vercel GitHub App에 레포 추가만 — submodule 클론엔 종종 불충분. / blog를 npm git 의존성화 — 렌더러 로더 개편 비용 큼.
- 검증: 빌드 로그에서 submodule 경고 소멸, `/blog/hash-vs-encryption-hmac`·`/blog/ko/hash-vs-encryption-hmac` prerender(정적 15→17). 라이브 200 확인.
