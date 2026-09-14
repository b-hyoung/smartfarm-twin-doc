// Cloudflare Workers 진입점.
// - /api/chat  → lib/chat.js (OPENAI_API_KEY 는 `wrangler secret put OPENAI_API_KEY` 로 등록)
// - 그 외      → out/ 정적 자산 (wrangler.jsonc 의 assets)
import { answerChat } from './lib/chat.js';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/chat' || url.pathname === '/api/chat/') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, message: 'POST 만 지원' }), { status: 405, headers: JSON_HEADERS });
      }
      let body = null;
      try {
        body = await request.json();
      } catch {
        return new Response(JSON.stringify({ ok: false, message: '잘못된 JSON' }), { status: 400, headers: JSON_HEADERS });
      }
      const { status, json } = await answerChat(body, env);
      return new Response(JSON.stringify(json), { status, headers: JSON_HEADERS });
    }
    return env.ASSETS.fetch(request);
  },
};
