// 정확한 라벨이 필요한 도식은 SVG로 직접 그린다(GPT 이미지는 한글 라벨이 깨짐).
// 색은 CSS 변수(var(--accent) 등)를 따라 라이트/다크 자동 대응.

const A = 'var(--accent)';
const INK = 'var(--ink)';
const MUT = 'var(--muted)';
const RULE = 'var(--rule)';
const SURF = 'var(--surface)';

function Box({ x, y, w, h, title, sub, top = A }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={SURF} stroke={RULE} />
      <rect x={x} y={y} width={w} height="3" fill={top} />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize="10.5" fill={MUT}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />;
}

function Defs() {
  return (
    <defs>
      <marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
        <path d="M0,0 L7,3 L0,6 Z" fill={RULE} />
      </marker>
    </defs>
  );
}

function Pipeline() {
  const steps = [
    ['실측 확보', 'R1'], ['물성값 보정', 'R5·R1'], ['케이스 대량 계산', 'R2·R3·R4'],
    ['대리모델 학습', 'R5'], ['실시간 추론·시각화', 'R6'],
  ];
  const w = 176, gap = 34, h = 62, y = 20;
  return (
    <svg viewBox={`0 0 ${steps.length * (w + gap)} 110`} width="100%" style={{ minWidth: 720 }}>
      <Defs />
      {steps.map(([t, s], i) => {
        const x = i * (w + gap);
        return (
          <g key={i}>
            <Box x={x} y={y} w={w} h={h} title={t} sub={s} />
            {i < steps.length - 1 && <Arrow x1={x + w + 4} y1={y + h / 2} x2={x + w + gap - 4} y2={y + h / 2} />}
          </g>
        );
      })}
    </svg>
  );
}

function Loop() {
  const nodes = [
    ['실측', '물리 세계', 250, 30],
    ['시뮬레이션', 'CFD·광·에너지', 440, 130],
    ['AI 대리모델', '학습·추론', 250, 230],
    ['언리얼', '시각화·조작', 60, 130],
  ];
  return (
    <svg viewBox="0 0 560 270" width="100%" style={{ minWidth: 480 }}>
      <Defs />
      <path d="M330,55 A150,110 0 0 1 470,150" fill="none" stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
      <path d="M455,180 A150,110 0 0 1 330,240" fill="none" stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
      <path d="M180,240 A150,110 0 0 1 95,175" fill="none" stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
      <path d="M100,120 A150,110 0 0 1 220,52" fill="none" stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
      {nodes.map(([t, s, cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="42" fill={SURF} stroke={A} strokeWidth="1.5" />
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>{t}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9.5" fill={MUT}>{s}</text>
        </g>
      ))}
    </svg>
  );
}

function CfdIO() {
  const inputs = ['형상 · 격자', '경계조건 (외기·벽·발열·토출)', '운전조건 (냉방·팬·조명)'];
  const outputs = ['속도장 (기류)', '압력장', '온도장', '※ 습도장 = 별도 수증기 수송 필요'];
  return (
    <svg viewBox="0 0 640 230" width="100%" style={{ minWidth: 560 }}>
      <Defs />
      <text x="110" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill={A}>입력</text>
      {inputs.map((t, i) => (
        <g key={i}>
          <rect x="10" y={28 + i * 44} width="200" height="34" rx="5" fill={SURF} stroke={RULE} />
          <text x="110" y={28 + i * 44 + 21} textAnchor="middle" fontSize="10.5" fill={INK}>{t}</text>
          <Arrow x1={214} y1={28 + i * 44 + 17} x2={252} y2={115} />
        </g>
      ))}
      <Box x={256} y={88} w={128} h={54} title="OpenFOAM" sub="유한체적법 · 배치" />
      <text x="320" y="162" textAnchor="middle" fontSize="9.5" fill={MUT}>케이스당 수 시간</text>
      <text x="530" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill={A}>출력 (csv)</text>
      {outputs.map((t, i) => {
        const warn = t.startsWith('※');
        return (
          <g key={i}>
            <rect x="430" y={28 + i * 44} width="200" height="34" rx="5" fill={warn ? 'var(--warm-soft)' : SURF} stroke={warn ? 'var(--warm)' : RULE} />
            <text x="530" y={28 + i * 44 + 21} textAnchor="middle" fontSize={warn ? 9 : 10.5} fill={warn ? 'var(--warm)' : INK}>{t}</text>
            {!warn && <Arrow x1={388} y1={115} x2={426} y2={28 + i * 44 + 17} />}
          </g>
        );
      })}
    </svg>
  );
}

function Boundary() {
  return (
    <svg viewBox="0 0 640 340" width="100%" style={{ minWidth: 560 }}>
      <Defs />
      {/* HW / SW 경계 */}
      <text x="120" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>하드웨어 (물리)</text>
      <rect x="10" y="28" width="220" height="120" rx="8" fill={SURF} stroke={RULE} strokeDasharray="4 3" />
      {['재배단 · 조명', '팬 · 냉방기', '센서 (온습도·PPFD·전력)'].map((t, i) => (
        <text key={i} x="120" y={56 + i * 30} textAnchor="middle" fontSize="11" fill={MUT}>{t}</text>
      ))}
      <text x="520" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>소프트웨어 (가상)</text>
      <rect x="410" y="28" width="220" height="120" rx="8" fill={SURF} stroke={A} />
      {['시뮬레이션 3종', 'AI 대리모델', '언리얼 시각화'].map((t, i) => (
        <text key={i} x="520" y={56 + i * 30} textAnchor="middle" fontSize="11" fill={MUT}>{t}</text>
      ))}
      <line x1="232" y1="88" x2="408" y2="88" stroke={A} strokeWidth="2" markerEnd="url(#ah)" />
      <text x="320" y="80" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={A}>실측 (유일한 접점)</text>
      <text x="320" y="104" textAnchor="middle" fontSize="9" fill={MUT}>교정·검증 후 SW는 HW 없이 예측</text>

      {/* 오프라인 / 실시간 */}
      <rect x="10" y="182" width="300" height="140" rx="8" fill="var(--accent-soft)" stroke={A} />
      <text x="160" y="204" textAnchor="middle" fontSize="12" fontWeight="700" fill={A}>미리 (오프라인)</text>
      {['수백 케이스 시뮬레이션', '대리모델 학습', '물성값 역산·보정', '최적화 사전 탐색'].map((t, i) => (
        <text key={i} x="160" y={228 + i * 22} textAnchor="middle" fontSize="10.5" fill={INK}>{t}</text>
      ))}
      <rect x="330" y="182" width="300" height="140" rx="8" fill="var(--warm-soft)" stroke="var(--warm)" />
      <text x="480" y="204" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--warm)">실시간 (온라인)</text>
      {['언리얼 조건 변경', '→ 대리모델 초 단위 추론', '→ 필드 렌더', '범위 밖이면 "학습 범위 밖" 표시'].map((t, i) => (
        <text key={i} x="480" y={228 + i * 22} textAnchor="middle" fontSize="10.5" fill={INK}>{t}</text>
      ))}
      <line x1="312" y1="252" x2="328" y2="252" stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
    </svg>
  );
}

function AiFour() {
  const outs = [
    ['① 예측', 'FNO·PINO', '온도·기류를 초 단위로', A],
    ['② 역산', 'PINN', '모르는 물성값을 실측에서', A],
    ['③ 전력 예측', 'XGBoost·TCN', '설비별 전력', 'var(--warm)'],
    ['④ 추천', '다목적·베이지안', '좋은 운전조건', 'var(--warm)'],
  ];
  return (
    <svg viewBox="0 0 640 300" width="100%" style={{ minWidth: 560 }}>
      <Defs />
      {/* 입력 */}
      <rect x="10" y="120" width="150" height="60" rx="6" fill={SURF} stroke={RULE} />
      <text x="85" y="146" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>시뮬 결과 + 실측</text>
      <text x="85" y="164" textAnchor="middle" fontSize="10" fill={MUT}>학습 데이터</text>
      <Arrow x1={162} y1={150} x2={198} y2={150} />
      {/* 중앙 AI */}
      <rect x="202" y="115" width="120" height="70" rx="8" fill="var(--accent-soft)" stroke={A} strokeWidth="1.5" />
      <text x="262" y="145" textAnchor="middle" fontSize="13" fontWeight="700" fill={A}>AI 대리모델</text>
      <text x="262" y="163" textAnchor="middle" fontSize="10" fill={MUT}>R5</text>
      {/* 4가지 출력 */}
      {outs.map(([t, m, s, col], i) => {
        const y = 20 + i * 70;
        return (
          <g key={i}>
            <line x1={324} y1={150} x2={396} y2={y + 27} stroke={RULE} strokeWidth="2" markerEnd="url(#ah)" />
            <rect x="400" y={y} width="230" height="54" rx="6" fill={SURF} stroke={RULE} />
            <rect x="400" y={y} width="3" height="54" fill={col} />
            <text x="414" y={y + 22} fontSize="12.5" fontWeight="700" fill={INK}>{t} · {m}</text>
            <text x="414" y={y + 40} fontSize="11" fill={MUT}>{s}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Timeline() {
  const off = ['실측', '물성값 보정', '시뮬 3종 실행', '대리모델 학습'];
  return (
    <svg viewBox="0 0 700 250" width="100%" style={{ minWidth: 620 }}>
      <Defs />
      {/* 오프라인 영역 */}
      <rect x="8" y="40" width="430" height="150" rx="8" fill="var(--accent-soft)" stroke={A} />
      <text x="20" y="30" fontSize="13" fontWeight="700" fill={A}>오프라인 — 한 번 (며칠~몇 주)</text>
      {off.map((t, i) => {
        const x = 24 + i * 102;
        const cfd = i === 2;
        return (
          <g key={i}>
            <rect x={x} y="88" width="86" height="52" rx="6" fill={SURF} stroke={cfd ? 'var(--warm)' : RULE} strokeWidth={cfd ? 1.6 : 1} />
            <text x={x + 43} y="112" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK}>{t.split(' ')[0]}</text>
            {t.split(' ')[1] && <text x={x + 43} y="128" textAnchor="middle" fontSize="10.5" fill={MUT}>{t.split(' ').slice(1).join(' ')}</text>}
            {i < off.length - 1 && <Arrow x1={x + 88} y1={114} x2={x + 100} y2={114} />}
          </g>
        );
      })}
      <text x="228" y="164" textAnchor="middle" fontSize="10.5" fill="var(--warm)">↑ CFD는 여기서만 실행 (케이스당 수 시간)</text>

      {/* 배포 구분선 */}
      <line x1="446" y1="40" x2="446" y2="190" stroke={RULE} strokeWidth="2" strokeDasharray="4 3" />
      <text x="446" y="205" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={MUT}>API 배포</text>
      <Arrow x1={438} y1={114} x2={468} y2={114} />

      {/* 온라인 영역 */}
      <rect x="470" y="40" width="222" height="150" rx="8" fill="var(--warm-soft)" stroke="var(--warm)" />
      <text x="482" y="30" fontSize="13" fontWeight="700" fill="var(--warm)">온라인 — 매번 (초 단위)</text>
      {['UE 조작', '대리모델 추론', '렌더'].map((t, i) => {
        const y = 60 + i * 40;
        return (
          <g key={i}>
            <rect x="500" y={y} width="150" height="30" rx="5" fill={SURF} stroke={RULE} />
            <text x="575" y={y + 20} textAnchor="middle" fontSize="11.5" fill={INK}>{t}</text>
            {i < 2 && <Arrow x1={575} y1={y + 31} x2={575} y2={y + 39} />}
          </g>
        );
      })}
      <path d="M655,75 a26,60 0 0 1 0,120" fill="none" stroke="var(--warm)" strokeWidth="1.5" markerEnd="url(#ah)" />
      <text x="688" y="140" textAnchor="middle" fontSize="10" fill="var(--warm)" transform="rotate(90 688 140)">반복 · CFD 안 돌림</text>

      {/* 경계 되돌림 */}
      <path d="M575,192 C575,225 228,225 228,192" fill="none" stroke={MUT} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#ah)" />
      <text x="400" y="240" textAnchor="middle" fontSize="10.5" fill={MUT}>학습 범위 밖 → 오프라인으로 되돌아가 CFD 추가(능동학습)</text>
    </svg>
  );
}

const MAP = { pipeline: Pipeline, loop: Loop, 'cfd-io': CfdIO, boundary: Boundary, 'ai4': AiFour, timeline: Timeline };

export default function Diagram({ name }) {
  const C = MAP[name];
  if (!C) return null;
  return (
    <div className="my-2 overflow-x-auto thin-scroll rounded-lg border p-3" style={{ borderColor: 'var(--rule)', background: 'var(--paper)' }}>
      <C />
    </div>
  );
}
