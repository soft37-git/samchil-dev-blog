<!-- Tistory (KR) 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->
> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요.

## 제목
토큰·키·서명이란 무엇인가

## 본문
토큰만 검사하는 API는 "키를 가진 누군가가 보냈다"는 알아도 "요청 내용이 도중에 바뀌지 않았는가"는 모른다. 토큰을 주워 그대로 쓰거나, 유효한 요청의 본문만 바꾼 공격자가 통과한다.

API 토큰·키·서명의 차이를 접근통제 관점에서 정리한다. token vs key vs signature — 무엇을 증명하고 무엇을 막지 못하는가.

이 글에서 함께 점검하는 것:
- 접근통제(access): 토큰("누가") 외에 요청 본문을 서명으로 묶었는가
- bearer 토큰을 TLS 위에서만 보내고 URL·로그에 노출하지 않는가
- 토큰·서명 비교가 상수시간(timingSafeEqual)인가

자세한 코드와 공격 시나리오는 원문에서 확인하세요.

👉 전문 보기: https://samchil.dev/blog/ko/tokens-keys-signatures?utm_source=tistory&utm_medium=referral&utm_campaign=tokens-keys-signatures

## 태그 (4)
security, L1, ladder, access
