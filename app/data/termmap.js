// 용어가 우리 프로젝트에서 "어디에" 있는지 정리한 지도 데이터.
// group: R2~R6 역할 축 / phase: 실측·오프라인(선행)·온라인(실시간)·경계
// 사이드바 메타 표시와 "용어 지도" 시각화에 함께 쓰인다.

export const GROUPS = [
  { role: 'R2', label: '광환경', terms: ['IES', 'PPFD', 'lux', 'Relux', 'uniformity'] },
  { role: 'R3', label: '열·유동 (CFD)', terms: ['CFD', 'OpenFOAM', 'boundary', 'mesh'] },
  { role: 'R4', label: '에너지', terms: ['EnergyPlus', 'xgboost', 'tcn'] },
  { role: 'R5', label: 'AI 대리모델', terms: ['surrogate', 'FNO', 'PINO', 'PINN', 'inverse', 'residual', 'activeLearning', 'multiObj', 'bayesOpt'] },
  { role: 'R6', label: 'UE · 전체', terms: ['twin'] },
];

// 각 용어가 파이프라인의 어느 시점에서 동작하는지
export const PHASE = {
  CFD: '오프라인', OpenFOAM: '오프라인', boundary: '오프라인', mesh: '오프라인',
  IES: '실측', PPFD: '실측', lux: '오프라인', Relux: '오프라인', uniformity: '오프라인',
  EnergyPlus: '오프라인', xgboost: '오프라인', tcn: '오프라인',
  surrogate: '온라인', FNO: '오프라인→온라인', PINO: '오프라인→온라인', PINN: '오프라인',
  inverse: '오프라인', residual: '오프라인', activeLearning: '경계', multiObj: '오프라인', bayesOpt: '오프라인',
  twin: '온라인',
};

// 단계별 색 (globals.css 변수 기준)
export function phaseColor(phase) {
  if (phase === '온라인' || phase === '온라인 지향') return 'var(--warm)';
  if (phase === '오프라인→온라인') return 'var(--warm)';
  if (phase === '실측') return 'var(--muted)';
  if (phase === '경계') return 'var(--warm)';
  return 'var(--accent)'; // 오프라인
}

const ROLE_LABEL = Object.fromEntries(GROUPS.map((g) => [g.role, g.label]));
const TERM_ROLE = {};
for (const g of GROUPS) for (const t of g.terms) TERM_ROLE[t] = g.role;

// 사이드바용: 이 용어의 역할·단계 메타
export function metaOf(id) {
  const role = TERM_ROLE[id];
  if (!role) return null;
  return { role, label: ROLE_LABEL[role], phase: PHASE[id] || '오프라인' };
}
