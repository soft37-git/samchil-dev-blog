# 발행 전파 — Vercel Deploy Hook → submodule 포인터 bump
- 날짜: 2026-06-26
- 결정: 본 사이트(`soft37-git/samchil-dev`)가 blog 레포를 git submodule(`blog/`)로 소비하므로, 발행 전파를 **본 사이트의 submodule 포인터를 최신 main SHA로 bump**하는 방식으로 한다(`.github/workflows/publish.yml`). 포인터 커밋이 Vercel의 일반 git 빌드를 트리거한다.
- 이유: 핀(pin)된 submodule은 부모 레포에 박힌 SHA로 체크아웃된다. Deploy Hook은 리빌드를 일으키지만 **같은 SHA**를 다시 클론하므로 새 글이 반영되지 않는다. 포인터를 움직여야만 새 글이 게재된다. 전파 경로는 하나(`publish.yml`)로 단일화한다.
- 폐기 옵션: **Vercel Deploy Hook**(`deploy-hook.yml`, `VERCEL_DEPLOY_HOOK_URL`) — 핀된 submodule에서는 stale SHA로 빌드해 새 글을 못 올린다. quality-gate 완료 시 포인터 bump 이전에 먼저 발화해 중복/낭비 빌드를 만든다. 파일 삭제, 시크릿 불필요.
- 후속: 본 사이트 레포에 fine-grained PAT `MAIN_REPO_PAT`(Contents: Read and write) 시크릿 등록 필요. 검증·품질게이트·draft 판정은 blog 레포 CI(`quality-gate.yml`)와 사이트 로더(draft 게이트)가 담당 — `publish.yml`은 전파만.
