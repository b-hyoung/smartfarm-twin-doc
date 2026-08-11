import { NextResponse } from 'next/server';

// 스마트팜 디지털 트윈 문서용 GPT 질의 프록시.
// API 키는 서버에서만 사용된다(브라우저 노출 금지).
// jchsanGi/app/api/gpt/objection/route.js 의 호출 패턴을 재사용.

const MODEL = process.env.LLM_MODEL || 'gpt-4.1-mini';

const SYSTEM = [
  '너는 "스마트팜 디지털 트윈 과제" 설명 문서에 붙은 도우미다.',
  '이 과제는 물리 시뮬레이션(Relux 광환경 / OpenFOAM CFD 열·유동 / EnergyPlus 에너지)으로 데이터를 만들고,',
  '소량 실측으로 보정한 뒤, AI 대리모델(FNO·PINO 예측 + PINN 역산·잔차보정 + XGBoost·TCN 전력예측 + 베이지안·다목적 최적화)을 학습시켜',
  '언리얼엔진(UE)에서 실시간으로 공간환경·에너지를 예측·시각화하는 디지털 트윈이다.',
  '',
  '규칙:',
  '1) 한국어로, 학생이 이해하기 쉽게 설명한다.',
  '2) 이 과제 맥락(위 파이프라인)에 붙여서 답한다.',
  '3) 확실하지 않은 사실은 추측하지 말고 "확실하지 않다"고 밝힌다.',
  '4) 3~6문장으로 간결하게. 필요하면 짧은 목록 사용.',
].join('\n');

function extractAnswerText(data) {
  const direct = String(data?.output_text || '').trim();
  if (direct) return direct;
  const output = Array.isArray(data?.output) ? data.output : [];
  const chunks = [];
  for (const item of output) {
    const contents = Array.isArray(item?.content) ? item.content : [];
    for (const c of contents) {
      if (typeof c?.text === 'string' && c.text.trim()) chunks.push(c.text.trim());
    }
  }
  return chunks.join('\n\n');
}

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, message: 'OPENAI_API_KEY 미설정' }, { status: 500 });
    }

    const body = await req.json();
    const question = String(body?.question || '').trim();
    const context = String(body?.context || '').trim();
    const history = Array.isArray(body?.history) ? body.history.slice(-6) : [];

    if (!question) {
      return NextResponse.json({ ok: false, message: '질문이 비어 있습니다.' }, { status: 400 });
    }

    const convo = history
      .map((m) => `${m.role === 'user' ? '사용자' : '도우미'}: ${String(m.content || '').trim()}`)
      .join('\n');

    const input = [
      SYSTEM,
      context ? `\n[지금 보고 있는 부분]\n${context}` : '',
      convo ? `\n[이전 대화]\n${convo}` : '',
      `\n[사용자 질문]\n${question}`,
    ].join('\n');

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: MODEL, input, max_output_tokens: 600 }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ ok: false, message: 'OpenAI 요청 실패', detail }, { status: 502 });
    }

    const data = await response.json();
    const answer = extractAnswerText(data) || '답변 생성에 실패했습니다. 질문을 더 구체적으로 적어주세요.';
    return NextResponse.json({ ok: true, answer });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: '처리 실패', detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
