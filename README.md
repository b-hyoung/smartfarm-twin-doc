# 스마트팜 디지털 트윈 파이프라인 설명서

물리 시뮬레이션(광환경·CFD·에너지) + 소량 실측 + AI 대리모델 + 언리얼엔진으로 이어지는 스마트팜 디지털 트윈 파이프라인을 학생 눈높이로 설명하는 문서 사이트.

## 🌐 바로 보기 (설치 없음)

**https://smartfarm-twin-doc.youqlrqod.workers.dev**

Cloudflare Workers에 정적 자산으로 영구 배포되어 있어 `npm run dev` 없이 바로 열립니다.

## 구성

| 경로 | 내용 |
|---|---|
| `app/page.js`, `app/components/` | 문서 본문·다이어그램·용어 지도·설명 패널 |
| `app/data/` | 문서 내용·용어집·용어 매핑 데이터 |
| `app/api/chat/route.js` | GPT 질문 엔드포인트 (`next dev`/Node 서버용) |
| `lib/chat.js` | GPT 질문 로직 (위 라우트와 `worker.js`가 공유) |
| `worker.js`, `wrangler.jsonc` | Cloudflare Workers 진입점·배포 설정 |
| `public/gen/` | 생성 이미지 (프롬프트는 `IMAGE_PROMPTS.md`) |
| `VERIFICATION.md`, `PINN-REHEARSAL.md` | 용어 사실검증 기록, PINN 리허설 결과 |

## 로컬 실행

```bash
npm ci
npm run dev        # http://localhost:3000
```

GPT 질문(채팅) 기능만 OpenAI 키가 필요합니다. `.env.example`을 `.env.local`로 복사해 채우면 됩니다. 없어도 문서·용어 설명은 정상 동작합니다.

## 배포 (Cloudflare Workers)

```bash
npx wrangler login                        # 최초 1회 (OAuth)
npm run deploy                            # 정적 내보내기(out/) + wrangler deploy
npx wrangler secret put OPENAI_API_KEY    # 선택: 배포본에서도 GPT 질문 켜기
```

- `npm run build:cf`는 `STATIC_EXPORT=1`로 `next build`를 돌려 `out/`에 정적 HTML을 만듭니다.
- `/api/chat`은 정적 내보내기에 포함되지 않으므로 `worker.js`가 같은 로직(`lib/chat.js`)으로 대신 응답합니다. 키를 등록하지 않으면 "OPENAI_API_KEY 미설정"을 돌려줍니다.
- 그 외 경로는 전부 `out/` 정적 자산으로 서빙됩니다.
