'use client';

import { GLOSSARY } from '../data/glossary';
import { GROUPS, PHASE, phaseColor } from '../data/termmap';

function Chip({ id, activeId, onTerm }) {
  const g = GLOSSARY[id];
  if (!g) return null;
  const phase = PHASE[id] || '오프라인';
  const active = activeId === id;
  return (
    <button
      onClick={() => onTerm(id)}
      title={`${g.term} · ${phase}`}
      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[14px] transition-colors"
      style={{
        borderColor: active ? 'var(--accent)' : 'var(--rule)',
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? 'var(--paper)' : 'var(--ink)',
      }}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: active ? 'var(--paper)' : phaseColor(phase) }} />
      {g.term}
    </button>
  );
}

export default function TermMap({ onTerm, activeId }) {
  return (
    <section className="pt-12">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[13.5px] tracking-wider" style={{ color: 'var(--accent)' }}>MAP</span>
        <h2 className="text-[1.65rem] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>용어 지도 — 우리 프로젝트에서의 위치</h2>
      </div>
      <p className="mt-2 max-w-[64ch] text-[15.5px]" style={{ color: 'var(--muted)' }}>
        클릭했을 때 뜨는 용어들이 어느 역할(R2~R6)에 속하고, 미리 계산하는지(오프라인)·조작 순간 도는지(온라인)를 한눈에.
        칩을 누르면 오른쪽에 검증된 설명이 뜹니다.
      </p>

      {/* 범례 */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px]" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />오프라인(미리 계산)</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: 'var(--warm)' }} />온라인(실시간)</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: 'var(--muted)' }} />실측(하드웨어)</span>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {GROUPS.map((grp) => (
          <div key={grp.role} className="rounded-lg border p-3" style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-[14.5px] font-semibold" style={{ color: 'var(--accent)' }}>{grp.role}</span>
              <span className="text-[14.5px] font-semibold" style={{ color: 'var(--ink)' }}>{grp.label}</span>
              <span className="text-[12.5px]" style={{ color: 'var(--muted)' }}>· {grp.terms.length}개</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {grp.terms.map((id) => (
                <Chip key={id} id={id} activeId={activeId} onTerm={onTerm} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
