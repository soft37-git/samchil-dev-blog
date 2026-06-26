<!-- Velog (KR) 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->
> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요.

## 제목
해시 vs 암호화, 그리고 HMAC은 왜 다른가

## 본문
해시 vs 암호화, 그리고 HMAC은 왜 다른가 — 짧게 정리하고 갑니다.

요청에 해시를 붙였다고 안심하면, 공격자는 비밀을 모른 채 위변조된 메시지에 맞는 유효한 해시를 만들어 통과한다.

즉 해시는 "내용이 그대로인가", 암호화는 "남이 못 읽는가", HMAC은 "누가 보냈고 바뀌지 않았는가"를 답한다. 보안 설계에서 셋을 바꿔 쓰면 구멍이 난다.

원문에는 취약한 코드 → 공격 원리 → 방어 구현까지 코드로 정리돼 있어요.

👉 전문 보기: https://samchil.dev/blog/ko/hash-vs-encryption-hmac?utm_source=velog&utm_medium=referral&utm_campaign=hash-vs-encryption-hmac

## 태그 (5)
security, L1, ladder, access, trace
