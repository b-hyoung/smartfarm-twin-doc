import { NextResponse } from 'next/server';
import { answerChat } from '../../../lib/chat';

// next dev / Node 서버용 엔드포인트. 로직은 lib/chat.js (worker.js 와 공유).
export async function POST(req) {
  let body = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: '잘못된 JSON' }, { status: 400 });
  }
  const { status, json } = await answerChat(body, process.env);
  return NextResponse.json(json, { status });
}
