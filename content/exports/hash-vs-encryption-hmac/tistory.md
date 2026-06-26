<!-- Tistory (KR) 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->
> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요.

## 제목
해시 vs 암호화, 그리고 HMAC은 왜 다른가

## 본문
요청에 해시를 붙였다고 안심하면, 공격자는 비밀을 모른 채 위변조된 메시지에 맞는 유효한 해시를 만들어 통과한다.

해시 vs 암호화 vs HMAC 차이를 접근통제·추적 관점에서 정리한다. 셋은 각각 무엇을 보장하고, 무엇을 보장하지 못하는가.

이 글에서 함께 점검하는 것:
- 접근통제(access): 메시지 인증에 순수 해시가 아니라 HMAC(또는 서명) 을 쓰는가
- 비밀을 Hash(secret + body)로 이어 붙이지 않았는가(길이확장)
- 태그 비교가 상수시간(timingSafeEqual)인가

자세한 코드와 공격 시나리오는 원문에서 확인하세요.

👉 전문 보기: https://samchil.dev/blog/ko/hash-vs-encryption-hmac?utm_source=tistory&utm_medium=referral&utm_campaign=hash-vs-encryption-hmac

## 태그 (5)
security, L1, ladder, access, trace
