'use client';

import { useState } from 'react';

// 파이프라인 단계별 산출물과 그 안에 담기는 값.
const STAGES = [
  {
    idx: '01', name: '실측 확보', who: 'R1',
    input: '받는 입력 없음 (출발점)',
    artifact: '실측 데이터셋',
    values: ['PPFD (μmol/m²/s)', '온도 · 습도', '설비별 소비전력', '센서 영점 교정기록', '공간 실측 도면'],
  },
  {
    idx: '02', name: '물성값 보정', who: 'R5·R1',
    input: '실측 데이터셋',
    artifact: '보정된 물성값',
    values: ['벽체 열전달계수', '팬 실질 풍량', '냉방 실제 냉각성능', 'lux↔PPFD 변환계수'],
  },
  {
    idx: '03', name: '케이스 대량 계산', who: 'R2·R3·R4',
    input: '보정된 물성값 + 운전조건 조합',
    artifact: '시뮬 결과 데이터셋',
    values: ['Relux 조도(lux) · 균제도', 'OpenFOAM 온도장 · 기류장 · 압력장 (csv)', 'EnergyPlus 설비별 전력 · 열부하'],
  },
  {
    idx: '04', name: '대리모델 학습', who: 'R5',
    input: '시뮬 결과 데이터셋 + 실측',
    artifact: '학습된 대리모델 + 추론 API',
    values: ['예측 필드 (온도 · 습도 · 기류 · PPFD)', '설비 전력 예측', '예측 불확실성', '학습 범위 경계'],
  },
  {
    idx: '05', name: '실시간 추론 · 시각화', who: 'R6',
    input: '추론 API + 사용자 조작',
    artifact: 'UE 디지털 트윈',
    values: ['단면 온도 · 등온면 · 기류', '전력 대시보드', '목표 대비 PPFD', '조작 UI (팬 · 냉방 · 조명)'],
  },
];

export default function PipelineFlow() {
  const [sel, setSel] = useState(0);
  const s = STAGES[sel];

  return (
    <div className="my-3">
      <div className="overflow-x-auto thin-scroll pb-1">
        <div className="flex items-stretch gap-1.5" style={{ minWidth: 720 }}>
          {STAGES.map((st, i) => (
            <div key={st.idx} className="flex items-stretch gap-1.5">
              <button
                onClick={() => setSel(i)}
                className="flex-1 rounded-lg border p-2.5 text-left transition-colors"
                style={{
                  minWidth: 130,
                  borderColor: sel === i ? 'var(--accent)' : 'var(--rule)',
                  borderTop: `3px solid ${sel === i ? 'var(--accent)' : 'var(--rule)'}`,
                  background: sel === i ? 'var(--accent-soft)' : 'var(--surface)',
                }}
              >
                <div className="font-mono text-[12px]" style={{ color: 'var(--muted)' }}>{st.idx}</div>
                <div className="mt-0.5 text-[14.5px] font-bold leading-tight" style={{ color: 'var(--ink)' }}>{st.name}</div>
                <div className="mt-1 font-mono text-[12px]" style={{ color: 'var(--accent)' }}>{st.who}</div>
                <div className="mt-1 text-[12px]" style={{ color: 'var(--muted)' }}>산출물 보기 ▸</div>
              </button>
              {i < STAGES.length - 1 && (
                <span className="self-center text-[18px]" style={{ color: 'var(--rule)' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 단계의 산출물 상세 */}
      <div className="mt-2 rounded-lg border p-4" style={{ borderColor: 'var(--accent)', background: 'var(--paper)' }}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-[13px]" style={{ color: 'var(--accent)' }}>{s.idx} · {s.who}</span>
          <span className="text-[16px] font-bold" style={{ color: 'var(--ink)' }}>{s.name}</span>
        </div>
        <p className="mt-1.5 text-[13.5px]" style={{ color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>받는 입력</b> · {s.input}
        </p>
        <div className="mt-2.5 text-[13.5px]" style={{ color: 'var(--ink)' }}>
          <b>산출물 — {s.artifact}</b> 안에 담기는 값:
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {s.values.map((v, i) => (
            <span key={i} className="rounded-md border px-2 py-1 text-[13px]"
              style={{ borderColor: 'var(--rule)', background: 'var(--surface)', color: 'var(--ink)' }}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
