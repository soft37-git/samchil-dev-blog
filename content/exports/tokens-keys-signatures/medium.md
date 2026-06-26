<!-- Medium (EN) 붙여넣기용. 각 칸(제목/본문/태그)에 옮기고, 게시는 사람이 확인 후. -->
> ⚠️ 요약이 검수 전(status:draft) 상태입니다. 톤 확인 후 게시하세요.

## 제목
What Tokens, Keys, and Signatures Actually Are

## 본문
> An API that only checks a token knows "someone holding the key sent this" — but not whether the request body was changed in transit. An attacker who picks up the token, or rewrites the body of an otherwise-valid request, sails through.

Three tools, three different jobs:
- Token = a bearer credential.
- Key = the secret itself.
- Signature = a seal stamped over the request contents with a key.

The full post walks through vulnerable code, how the attack works, the fix — with working code.

👉 Read the full breakdown: https://samchil.dev/blog/tokens-keys-signatures?utm_source=medium&utm_medium=referral&utm_campaign=tokens-keys-signatures

## 태그 (4)
security, L1, ladder, access
