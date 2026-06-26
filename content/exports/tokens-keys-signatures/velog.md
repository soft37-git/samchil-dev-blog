<!-- Velog (KR) 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->
> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요.

## 제목
토큰·키·서명이란 무엇인가

## 본문
토큰·키·서명이란 무엇인가 — 짧게 정리하고 갑니다.

토큰만 검사하는 API는 "키를 가진 누군가가 보냈다"는 알아도 "요청 내용이 도중에 바뀌지 않았는가"는 모른다. 토큰을 주워 그대로 쓰거나, 유효한 요청의 본문만 바꾼 공격자가 통과한다.

즉 토큰은 "이걸 가진 사람"을, 서명은 "이 내용을 이 비밀을 가진 쪽이 보냈다"를 증명한다. 토큰을 서명 자리에 쓰면 무결성이 빈다.

원문에는 취약한 코드 → 공격 원리 → 방어 구현까지 코드로 정리돼 있어요.

👉 전문 보기: https://samchil.dev/blog/ko/tokens-keys-signatures?utm_source=velog&utm_medium=referral&utm_campaign=tokens-keys-signatures

## 태그 (4)
security, L1, ladder, access
