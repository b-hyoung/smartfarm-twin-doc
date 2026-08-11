'use client';

import { useState, useCallback } from 'react';
import { GLOSSARY } from '../data/glossary';
import { SECTIONS, ROLES, TEAM_PLANS, RISKS } from '../data/content';
import Diagram from './Diagrams';
import TermMap from './TermMap';
import { metaOf, phaseColor } from '../data/termmap';
import { USAGE } from '../data/usage';
import PipelineFlow from './PipelineFlow';

/* [[id|label]] 파싱 → 클릭 가능한 용어 */
function renderText(str, onTerm, activeId) {
  const parts = String(str).split(/(\[\[[^\]]+\]\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
    if (!m) return <span key={i}>{p}</span>;
    const id = m[1];
    const label = m[2] || GLOSSARY[id]?.term || id;
    if (!GLOSSARY[id]) return <span key={i}>{label}</span>;
    return (
      <span
        key={i}
        role="button"
        tabIndex={0}
        className={`term${activeId === id ? ' active' : ''}`}
        onClick={() => onTerm(id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTerm(id)}
      >
        {label}
      </span>
    );
  });
}

function ImageBlock({ image, id }) {
  const [copied, setCopied] = useState(false);
  const [ok, setOk] = useState(true);
  const src = `/gen/${id}.png`;
  const copy = () => {
    navigator.clipboard?.writeText(image.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <figure className="my-4">
      {ok ? (
        <div className="relative overflow-hidden rounded-lg border" style={{ borderColor: 'var(--rule)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={image.alt} loading="lazy" className="block w-full" onError={() => setOk(false)} />
          <span className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[12px]"
            style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
            {image.placeholder ? 'AI 생성 · 실제 캡처로 교체 권장' : 'gpt-image-1 생성'}
          </span>
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed text-center"
          style={{ borderColor: 'var(--rule)', background: 'var(--surface)', color: 'var(--muted)' }}>
          <div className="px-4"><div className="text-[14.5px]">{image.alt}</div></div>
        </div>
      )}
      <figcaption className="mt-1.5 text-[14px]" style={{ color: 'var(--muted)' }}>{image.caption}</figcaption>
      {(
        <details className="mt-1.5 text-[14px]">
          <summary className="cursor-pointer" style={{ color: 'var(--accent)' }}>GPT-5 이미지 프롬프트 보기</summary>
          <div className="mt-1.5 rounded-md border p-2.5" style={{ borderColor: 'var(--rule)', background: 'var(--surface)' }}>
            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ink)' }}>{image.prompt}</p>
            <button
              onClick={copy}
              className="mt-2 rounded border px-2 py-0.5 text-[13.5px]"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              {copied ? '복사됨 ✓' : '프롬프트 복사'}
            </button>
          </div>
        </details>
      )}
    </figure>
  );
}

function SidebarContent({ termId, onClose }) {
  const g = termId ? GLOSSARY[termId] : null;
  const meta = termId ? metaOf(termId) : null;
  const usage = termId ? USAGE[termId] : null;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setLoading(true);
    try {
      const context = g ? `용어 "${g.term}": ${g.detail} (과제 쓰임: ${g.why})` : '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context, history: messages }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.ok ? data.answer : `오류: ${data.message || '실패'}` }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: `요청 실패: ${String(e.message || e)}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--rule)' }}>
        <span className="font-mono text-[12.5px] tracking-wider" style={{ color: 'var(--accent)' }}>설명 · 질문</span>
        {onClose && (
          <button onClick={onClose} className="text-[14.5px]" style={{ color: 'var(--muted)' }}>닫기 ✕</button>
        )}
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto py-3">
        {g ? (
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-[19px] font-bold" style={{ color: 'var(--ink)' }}>{g.term}</h3>
              {g.full && <span className="text-[12.5px]" style={{ color: 'var(--muted)' }}>{g.full}</span>}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12.5px]">
              {g.verified && (
                <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>✓ 에이전트 검증됨</span>
              )}
              {meta && (
                <>
                  <span className="rounded px-1.5 py-0.5" style={{ border: '1px solid var(--rule)', color: 'var(--ink)' }}>
                    {meta.role} {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5"
                    style={{ border: '1px solid var(--rule)', color: 'var(--ink)' }}>
                    <i className="inline-block h-2 w-2 rounded-full" style={{ background: phaseColor(meta.phase) }} />
                    {meta.phase}
                  </span>
                </>
              )}
            </div>
            <p className="mt-2.5 text-[15px] font-medium" style={{ color: 'var(--ink)' }}>{g.short}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>{g.detail}</p>
            <div className="mt-2.5 rounded-md border-l-2 py-1.5 pl-2.5 text-[14px] leading-relaxed"
              style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--ink)' }}>
              <b>이 과제에서</b> {g.why}
            </div>
            {usage && (
              <div className="mt-2.5 rounded-md border py-2 px-2.5 text-[14px] leading-relaxed"
                style={{ borderColor: 'var(--rule)', background: 'var(--surface)', color: 'var(--ink)' }}>
                <div className="mb-1.5 font-mono text-[12.5px] tracking-wider" style={{ color: 'var(--accent)' }}>언제 · 어떻게 쓰나</div>
                <p><b style={{ color: 'var(--warm)' }}>언제</b> {usage.when}</p>
                <p className="mt-1"><b style={{ color: 'var(--accent)' }}>어떻게</b> {usage.how}</p>
              </div>
            )}
            {g.source && (
              <p className="mt-2 text-[12.5px]" style={{ color: 'var(--muted)' }}>검증 근거: {g.source}</p>
            )}
          </div>
        ) : (
          <div className="text-[14.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            본문에서 <span className="term" style={{ cursor: 'default' }}>밑줄 친 용어</span>를 누르면 여기에 검증된 설명이 뜹니다.
            <br />아래 입력창으로 자유롭게 질문할 수도 있어요.
          </div>
        )}

        {messages.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t pt-3" style={{ borderColor: 'var(--rule)' }}>
            {messages.map((m, i) => (
              <div key={i} className="text-[14.5px] leading-relaxed">
                <span className="font-mono text-[12px]" style={{ color: m.role === 'user' ? 'var(--warm)' : 'var(--accent)' }}>
                  {m.role === 'user' ? '나' : 'GPT'}
                </span>
                <div style={{ color: 'var(--ink)' }} className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-[13.5px]" style={{ color: 'var(--muted)' }}>생각 중…</div>}
          </div>
        )}
      </div>

      <div className="border-t pt-2" style={{ borderColor: 'var(--rule)' }}>
        <div className="flex gap-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={g ? `"${g.term}"에 대해 더 물어보기…` : '무엇이든 물어보세요…'}
            className="min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-[14.5px] outline-none"
            style={{ borderColor: 'var(--rule)', background: 'var(--surface)', color: 'var(--ink)' }}
          />
          <button
            onClick={send}
            disabled={loading}
            className="rounded-md px-3 py-1.5 text-[14.5px] font-semibold disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--paper)' }}
          >
            질문
          </button>
        </div>
        <p className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>GPT 답변은 검증되지 않은 실시간 생성입니다. 밑줄 용어 설명만 에이전트 검증됨.</p>
      </div>
    </div>
  );
}

export default function Explainer() {
  const [termId, setTermId] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const onTerm = useCallback((id) => {
    setTermId(id);
    setDrawer(true);
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-24 lg:px-8">
      {/* Header */}
      <header className="border-b-2 py-14" style={{ borderColor: 'var(--ink)' }}>
        <p className="font-mono text-[13.5px] tracking-[0.14em]" style={{ color: 'var(--accent)' }}>SMART FARM · DIGITAL TWIN</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.4rem)] font-extrabold leading-tight tracking-tight" style={{ color: 'var(--ink)' }}>
          스마트팜 디지털 트윈<br />파이프라인 설명서
        </h1>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
        {/* Article */}
        <main className="min-w-0 pt-4">
          {SECTIONS.map((s) => (
            <div key={s.id}>
            <section className="pt-12">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13.5px] tracking-wider" style={{ color: 'var(--accent)' }}>{s.kicker}</span>
                <h2 className="text-[1.65rem] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>{s.title}</h2>
              </div>
              {s.lead && <p className="mt-2 max-w-[64ch] text-[15.5px]" style={{ color: 'var(--muted)' }}>{s.lead}</p>}
              <div className="mt-4 flex flex-col gap-3">
                {s.paras?.map((p, i) => (
                  <p key={i} className="text-[16.5px] leading-[1.8]" style={{ color: 'var(--ink)' }}>
                    {renderText(p, onTerm, termId)}
                  </p>
                ))}
              </div>
              {s.diagram && (s.diagram === 'pipeline' ? <PipelineFlow /> : <Diagram name={s.diagram} />)}
              {s.diagram2 && <Diagram name={s.diagram2} />}
              {s.image && <ImageBlock image={s.image} id={s.id} />}
            </section>
            {s.id === 'architecture' && <TermMap onTerm={onTerm} activeId={termId} />}
            </div>
          ))}

          {/* 역할 분담 */}
          <section className="pt-12">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[13.5px] tracking-wider" style={{ color: 'var(--accent)' }}>ROLES</span>
              <h2 className="text-[1.65rem] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>역할 분담과 인수인계</h2>
            </div>
            <div className="mt-4 overflow-x-auto thin-scroll">
              <table className="w-full min-w-[520px] border-collapse text-[15px]">
                <thead>
                  <tr>
                    {['', '역할', '인수인계'].map((h, i) => (
                      <th key={i} className="border-b py-2 text-left font-mono text-[13.5px]"
                        style={{ borderColor: 'var(--rule)', color: 'var(--accent)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((r) => (
                    <tr key={r.code}>
                      <td className="border-b py-2.5 font-mono font-semibold" style={{ borderColor: 'var(--rule-soft)', color: 'var(--accent)' }}>
                        {r.code}<span className="ml-1 text-[12.5px]" style={{ color: 'var(--muted)' }}>{r.tag}</span>
                      </td>
                      <td className="border-b py-2.5" style={{ borderColor: 'var(--rule-soft)', color: 'var(--ink)' }}>{r.title}</td>
                      <td className="border-b py-2.5 font-mono text-[13.5px]" style={{ borderColor: 'var(--rule-soft)', color: 'var(--muted)' }}>{r.hand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-8 text-[16.5px] font-bold" style={{ color: 'var(--ink)' }}>인원 수별 병합안</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM_PLANS.map((p) => (
                <div key={p.n} className="rounded-lg border p-3" style={{ borderColor: 'var(--rule)', background: 'var(--surface)' }}>
                  <div className="font-mono text-[13.5px] font-semibold" style={{ color: 'var(--accent)' }}>{p.n}</div>
                  <dl className="mt-2 flex flex-col gap-1.5">
                    {p.rows.map(([k, v], i) => (
                      <div key={i}>
                        <dt className="text-[12.5px]" style={{ color: 'var(--muted)' }}>{k}</dt>
                        <dd className="text-[14.5px]" style={{ color: 'var(--ink)' }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* 리스크 */}
          <section className="pt-12">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[13.5px] tracking-wider" style={{ color: 'var(--accent)' }}>RISK</span>
              <h2 className="text-[1.65rem] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>일정 리스크</h2>
            </div>
            <div className="mt-4 flex flex-col">
              {RISKS.map((r, i) => (
                <div key={i} className="grid grid-cols-[9rem_1fr] gap-4 border-t py-3.5" style={{ borderColor: 'var(--rule-soft)' }}>
                  <div className="font-mono text-[14px]" style={{ color: 'var(--warm)' }}>{r.tag}</div>
                  <div>
                    <p className="text-[15.5px] font-bold" style={{ color: 'var(--ink)' }}>{r.head}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-16 border-t pt-5 text-[14px]" style={{ borderColor: 'var(--rule)', color: 'var(--muted)' }}>
            원본: 스마트팜_역할분담.html + 과제활동정리_01.pdf. 용어 설명은 3개 도메인 검증 에이전트가 사실검증했고,
            정정 4건(PINN·능동학습·디지털 트윈·IES)을 반영했습니다.
          </footer>
        </main>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 h-[calc(100vh-3rem)] rounded-xl border p-4"
            style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}>
            <SidebarContent termId={termId} />
          </div>
        </aside>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t p-4"
            style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}>
            <div className="h-[62vh]">
              <SidebarContent termId={termId} onClose={() => setDrawer(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
