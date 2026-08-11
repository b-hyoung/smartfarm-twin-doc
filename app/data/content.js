// 본문 섹션 데이터. 문단 안의 [[termId|표시어]] 는 클릭 가능한 용어로 렌더된다.
// (표시어 생략 시 [[termId]] → 용어집 term 사용)
// image.prompt 은 GPT-5 이미지 생성용 프롬프트(사용자가 생성해 넣음). 지금은 placeholder.

export const SECTIONS = [
  {
    id: 'why', kicker: 'WHY', title: '왜 이 구조인가',
    lead: '실측은 정확하지만 비싸고 느리다. 시뮬레이션은 많이 뽑을 수 있지만 케이스당 수 시간이다. 이 둘을 AI로 잇는다.',
    paras: [
      '스마트팜에서 팬 위치나 냉방 설정을 바꿨을 때 공간의 온도·기류·전력이 어떻게 변하는지 알고 싶다. 매번 실제로 재배단을 뜯어 실측할 수도, 매번 [[CFD]]를 몇 시간씩 돌릴 수도 없다.',
      '그래서 소량의 [[boundary|실측]]으로 시뮬레이션 입력을 교정하고, 교정된 시뮬레이터 — [[Relux]](광환경), [[OpenFOAM]](열·유동 CFD), [[EnergyPlus]](에너지) 3종 — 로 운전조건을 바꿔가며 대량의 정답 데이터를 만든 뒤, [[surrogate|AI 대리모델]]이 그것을 배워 [[twin|언리얼]]에서 실시간으로 답하게 한다.',
      '즉 필요한 건 ① 소량이라도 신뢰할 수 있는 [[boundary|실측]], ② 그 실측으로 교정된 시뮬레이터 3종(Relux·OpenFOAM·EnergyPlus), ③ 그 결과를 초 단위로 대신 답하도록 학습한 [[surrogate|대리모델]]이다.',
    ],
    image: {
      alt: '스마트팜 수직 재배단 디지털 트윈 개념 씬',
      caption: '개념 씬 — 실측·시뮬·AI·언리얼이 하나의 루프로 연결된 스마트팜 디지털 트윈',
      prompt: 'A clean isometric 3D concept illustration of a smart vertical farm digital twin. Two-tier vertical grow racks with LED grow lights (magenta-pink glow), a cooling unit and a fan on the side. Semi-transparent overlays showing airflow streamlines and a temperature heatmap gradient across the space. On the right, a subtle holographic UI panel suggesting real-time data. Muted teal and warm amber accents, soft studio lighting, white background, no text, editorial tech illustration style.',
    },
    diagram: 'loop',
  },
  {
    id: 'pipeline', kicker: 'FLOW', title: '전체 파이프라인',
    lead: '실측 → 물성값 보정 → 시뮬레이션 대량 계산 → 대리모델 학습 → 실시간 추론·시각화.',
    paras: [
      '아래 흐름이 이 과제의 뼈대다. 각 단계는 앞 단계의 산출물을 입력으로 받는다. 카드의 산출물을 누르면 그 안에 어떤 값이 담기는지 볼 수 있다.',
      '물리 시뮬레이션 3종은 도구가 각각 다르다. 광환경은 [[Relux]]에 조명 [[IES]] 배광을 넣어 조도([[lux]]) 분포를 만들고, 열·유동은 [[OpenFOAM]]에 형상·[[mesh|격자]]·[[boundary|경계조건]]을 세팅해 온도·기류장을 만들고, 에너지는 [[EnergyPlus]]에 설비 모델을 넣어 전력·열부하를 만든다. 이 셋을 운전조건(냉방·팬·조명)을 바꿔가며 수백 케이스로 배치 실행해 정답 데이터를 대량 생산한다.',
      '이렇게 만든 세 데이터셋은 그 자체가 목적이 아니라 AI 학습용 교재다. 각 데이터는 「운전조건 → 물리 결과」 쌍(예: 냉방 26℃·팬 강 → 이 온도·기류장)으로 되어 있고, 이걸 전부 [[surrogate|대리모델]](R5) 학습에 넣는다. 대리모델은 이 쌍들을 보고 "조건을 넣으면 결과를 바로 뱉는" 함수가 된다 — 온도·기류는 [[FNO]]·[[PINO]], 전력은 [[xgboost|XGBoost]]·[[tcn|TCN]]이 맡는다. 학습이 끝나면 시뮬을 다시 돌릴 필요 없이, 언리얼에서 조건만 바꾸면 대리모델이 초 단위로 답한다.',
    ],
    diagram: 'pipeline',
  },
  {
    id: 'architecture', kicker: 'ARCH', title: '경계 설계 — 하드웨어/소프트웨어 · 오프라인/실시간',
    lead: '이 시스템은 두 가지만 구분하면 이해된다. 하드웨어와 소프트웨어가 어디서 갈리는가, 그리고 어떤 계산을 미리 해두고 어떤 계산을 조작하는 순간에 하는가.',
    paras: [
      '하드웨어는 실제 장비다. 재배단·조명·팬·냉방기, 그리고 [[boundary|센서]]. 소프트웨어는 그 장비를 흉내 낸 가상 쪽이다. 시뮬레이션 3종, [[surrogate|AI 대리모델]], [[twin|언리얼]] 화면. 이 둘이 만나는 곳은 딱 하나, 실측 데이터뿐이다. 센서가 잰 값으로 소프트웨어를 한 번 맞춰 놓으면, 그다음부터는 센서 없이도 소프트웨어가 예측한다. 이 구분이 무너지면 센서를 계속 켜 둬야만 돌아가는 시각화가 되고, 그러면 디지털 트윈이라 부를 이유가 없다.',
      '두 번째 구분이 더 중요하다. 사용자가 [[twin|언리얼]]에서 팬 위치나 냉방 온도를 바꾸면 화면의 예측값이 따라 바뀐다. 그런데 이때 [[CFD]]를 새로 돌리지는 않는다. 오래 걸리는 계산은 사용자가 화면을 열기 전에 이미 다 끝나 있다.',
      '미리 해두는 계산(오프라인)은 이런 것들이다. 수백 개 케이스의 시뮬레이션, [[surrogate|대리모델]] 학습, 모르는 물성값 [[inverse|역산]]과 보정, 최적 운전조건 사전 탐색. 시간이 오래 걸려도 괜찮은, 사용자가 보기 전에 끝내는 일이다.',
      '조작하는 순간 하는 계산(온라인)은 하나다. 바뀐 조건을 [[surrogate|대리모델]]에 넣어 몇 초 안에 예측하고 화면에 그린다. 미리 학습해 둔 범위 안이라면 곧바로 답이 나온다.',
      '문제는 사용자가 학습하지 않은 범위의 조건을 줄 때다. 그건 실시간으로 답할 수 없다. 이럴 땐 그럴듯한 값을 지어내지 말고 "학습 범위를 벗어났다"고 알려야 한다. 그리고 그 조건이 자주 쓰이면 오프라인에서 따로 계산해([[activeLearning|능동학습]]) 다음 버전에 넣는다. 결국 미리 할 수 있는 일과 실시간으로 해야 하는 일의 경계에 [[activeLearning|능동학습]]이 다리를 놓는 셈이다.',
    ],
    diagram: 'boundary',
    diagram2: 'timeline',
  },
  {
    id: 'measure', kicker: 'R1', title: '실측 · 계측 — 기준점',
    lead: '나머지 다섯 역할의 결과가 전부 이 데이터로 교정된다. 가장 먼저, 가장 정확해야 한다.',
    paras: [
      '2단 수직 재배단에 조명·팬·냉방기를 구성하고, [[PPFD]]·온습도·설비별 전력 센서를 공간 대표 지점 5~10곳에 배치한다. 냉방 약·중·강, 팬 유무, 조명 점등률을 조합해 운영 범위의 모서리를 포함하는 10~30 케이스를 실측한다.',
      '센서 [[inverse|영점 교정]]과 로깅 파이프라인이 핵심이다. 센서가 일관되게 치우쳐 있으면 물리 제약으로도 걸러지지 않고 그대로 학습되므로, 설치 전 기준기 대조를 기록으로 남긴다.',
    ],
    image: {
      alt: '재배단 센서 배치 실측 도면',
      caption: '실측 인프라 — 재배단·조명·팬·냉방기와 센서 배치',
      prompt: 'A technical isometric diagram of a two-tier vertical farm rack with sensor placement markers (temperature/humidity, PPFD light sensor, power meter) at 5-10 representative points. Small labeled sensor icons, a fan and a cooling unit. Blueprint-meets-3D style, teal line work on off-white background, clean and precise, no readable text.',
    },
  },
  {
    id: 'light', kicker: 'R2', title: '광환경 시뮬레이션',
    lead: '조명 IES로 lux 분포를 계산하고, PPFD 실측으로 식물 기준 단위로 환산한다.',
    paras: [
      '제조사 조명의 [[IES|IES 파일]]을 확보해 [[Relux]]로 재배단 높이별 [[lux]] 분포를 계산한다. 시뮬레이터와 언리얼이 모두 사람 눈 기준이라, [[PPFD]] 실측과 대조해 [[lux|lux↔PPFD 변환계수]]를 산출해야 식물 기준으로 환산된다.',
      '재배단 위 [[uniformity|균제도]]를 평가해 구석 자리 광량 부족을 확인한다. IES를 제공하지 않는 조명은 광환경 시뮬레이션 자체가 성립하지 않으므로, 장비 선정 시 IES 제공을 필수 조건으로 건다.',
    ],
    image: {
      alt: 'Relux 조도 분포 히트맵',
      caption: '툴 캡처 자리 — Relux 재배단 조도(lux) 분포 (실제 캡처로 교체)',
      prompt: 'A lighting simulation false-color illuminance heatmap on a horizontal grow-rack plane, smooth gradient from deep blue (low) to yellow-white (high) showing brighter center and dimmer corners, with faint iso-lux contour lines. Software-screenshot aesthetic, dark UI frame hint, no readable text.',
      placeholder: true,
    },
  },
  {
    id: 'cfd', kicker: 'R3', title: '열 · 유동 시뮬레이션 (CFD)',
    lead: '공간 전체의 온도·기류 분포를 계산해 정답 데이터를 대량 생산한다. 계산 시간이 이 과제의 최대 제약이다.',
    paras: [
      '[[OpenFOAM]]으로 재배단·팬·냉방기를 포함한 형상을 만들고 [[mesh|격자]]를 생성한 뒤, [[boundary|경계조건]](외기·벽체 열전달·조명 발열·팬/냉방 토출)을 설정한다. 입력조건 조합에 따라 수백 케이스를 배치 실행한다.',
      'CFD의 기본 출력은 공간 전체의 속도장·압력장·온도장이다. 습도장은 자동으로 나오지 않는다 — 수증기를 별도의 수송 스칼라로 추가하고 증발·증산 등 수분 소스·경계조건을 함께 모델링해야 얻는다. 결과는 csv 규격으로 저장하며, 필드 이름·좌표계·단위·시간 축을 R5·R6와 착수 전에 합의한다.',
      'CFD는 케이스당 수 시간이라 무작정 늘릴 수 없다. 거친 [[mesh|격자]] 다수 + 정밀 격자 소수를 섞고(다중충실도), [[activeLearning|능동학습]]으로 필요한 케이스만 골라 계산 예산을 아낀다.',
    ],
    image: {
      alt: 'OpenFOAM 단면 온도 분포',
      caption: '툴 캡처 자리 — OpenFOAM 단면 온도장·기류 벡터 (실제 캡처로 교체)',
      prompt: 'A CFD post-processing visualization: a vertical cross-section of an indoor grow space showing a temperature field as a blue-to-red color map, overlaid with white airflow velocity vector arrows curving from a fan and a cooling outlet around two grow-rack tiers. ParaView-style scientific visualization, dark background, no readable text.',
      placeholder: true,
    },
    diagram: 'cfd-io',
  },
  {
    id: 'energy', kicker: 'R4', title: '에너지 시뮬레이션',
    lead: '설비별 전력 소비를 계산하고 전력 센서 실측과 맞춘다.',
    paras: [
      '[[EnergyPlus]]로 공간·설비를 모델링해 조명·팬·냉방기의 소비 전력을 시뮬레이션하고, 설비별 전력 센서 실측과 대조해 보정한다.',
      '조명 발열이 냉방 부하로 이어지는 연동까지 담아야 의미가 있다. R3(CFD)의 열부하를 참조해 조명 발열 → 냉방 부하 흐름을 반영한다.',
    ],
    image: {
      alt: '설비별 전력 소비 대시보드',
      caption: '개념 — 설비별(조명·팬·냉방) 전력 소비와 실측 보정',
      prompt: 'A minimalist energy dashboard concept: three stacked horizontal bars for lighting, fan, and cooling power consumption, each with a simulated value and a measured value marker, plus a small line chart of power over time. Flat design, teal and amber, off-white background, no readable text.',
    },
  },
  {
    id: 'ai', kicker: 'R5', title: 'AI 대리모델 · 최적화',
    lead: '수 시간 걸리는 시뮬레이터를 초 단위로 답하는 모델로 바꾸고, 목표에 맞는 운전조건을 추천한다.',
    paras: [
      'R5가 하는 일은 크게 네 가지다. ① 공간의 온도·기류를 예측하고, ② 모르는 값을 실측에서 거꾸로 알아내고, ③ 설비 전력을 예측하고, ④ 좋은 운전조건을 추천한다. 아래 밑줄 친 모델 이름을 누르면 각각 언제·어떻게 쓰는지 나온다.',
      '① 예측 — 먼저 어떤 케이스를 시뮬레이션할지 [[activeLearning|능동학습]]으로 고른다. 고른 케이스는 [[OpenFOAM]]이 계산하고, 그 결과를 [[FNO]]·[[PINO]]가 배워서 언리얼에서 조건이 바뀔 때마다 온도·기류를 몇 초 만에 예측한다. 무거운 시뮬을 다시 돌리지 않고 대신 답하는 역할이다.',
      '② 역산 — 카탈로그로는 알 수 없는 값(벽이 열을 얼마나 흘리는지, 팬이 실제로 바람을 얼마나 내는지, 냉방이 얼마나 식히는지)은 [[PINN]]이 실측에서 거꾸로 [[inverse|역산]]해 채운다. 예측은 [[FNO]], 역산은 [[PINN]]으로 나눈 건 둘이 잘하는 일이 다르기 때문이다.',
      '③ 전력 · ④ 추천 — 설비 전력은 표 데이터에 강한 [[xgboost|XGBoost]]와 시계열에 맞는 [[tcn|TCN]]으로 예측한다. 그리고 광량은 높이고 전력은 낮추는 식의 절충안을 [[multiObj|다목적 최적화]]·[[bayesOpt|베이지안 최적화]]로 찾아 운전조건을 추천한다. 이 모든 예측은 "얼마나 믿을 만한지(불확실성)"와 "학습한 범위 안인지"를 함께 알려준다.',
    ],
    diagram: 'ai4',
    image: {
      alt: 'AI 대리모델 구조도',
      caption: '개념 — 예측(FNO/PINO) · 역산·보정(PINN) · 전력(XGBoost/TCN) · 최적화',
      prompt: 'A clean systems diagram concept of an AI surrogate model hub: input operating conditions flowing into a central AI block that branches into "field prediction (operator)", "inverse/parameter estimation", "power forecast", and "optimization recommendation", outputting to a real-time API. Node-and-edge style, teal accents, off-white background, no readable text.',
    },
  },
  {
    id: 'ue', kicker: 'R6', title: '언리얼 통합 · 시각화',
    lead: '사용자가 실제로 만지는 창구. 화면 조작을 조건 값으로 바꿔 추론에 넘기고, 돌아온 결과를 공간 위에 그린다.',
    paras: [
      'UE는 [[OpenFOAM]]을 매번 직접 실행하지 않는다. 대신 운전조건 입력 → [[surrogate|AI 대리모델]] 추론 → 온도·습도·기류·PPFD·전력 출력으로 구성한다. 조건을 바꾸면 즉시 재예측된다.',
      '[[IES]] 임포트로 조명을 재현하고, CFD 필드를 단면 온도·등온면·기류로 시각화한다. 팬 위치·속도, 냉방 설정, 조명 출력을 조작하는 UI와 전력 대시보드, 목표 대비 PPFD 표시를 붙인다.',
    ],
    image: {
      alt: '언리얼 디지털 트윈 화면',
      caption: '툴 캡처 자리 — 언리얼 디지털 트윈 시각화 (실제 캡처로 교체)',
      prompt: 'A game-engine (Unreal-style) real-time 3D visualization of a smart farm interior: vertical grow racks under magenta LED lighting, a translucent temperature cross-section plane and airflow ribbons, with a clean floating control UI panel (sliders and gauges) on the side. Cinematic, high-fidelity render, no readable text.',
      placeholder: true,
    },
  },
];

// 역할 분담 (원본 역할분담 HTML 기준)
export const ROLES = [
  { code: 'R1', tag: '계측', title: '실험 인프라 · 계측', hand: '출발점 → R2·R3·R4·R5' },
  { code: 'R2', tag: '광환경', title: '광환경 시뮬레이션', hand: 'R1(PPFD) → R5·R6(IES)' },
  { code: 'R3', tag: '열·유동', title: '열·유동 CFD', hand: 'R1·R5 → R5·R6' },
  { code: 'R4', tag: '에너지', title: '에너지 시뮬레이션', hand: 'R1·R3 → R5·R6' },
  { code: 'R5', tag: 'AI', title: 'AI 대리모델·최적화', hand: 'R1·R2·R3·R4 → R6' },
  { code: 'R6', tag: 'UE', title: '언리얼 통합·시각화', hand: 'R2·R3·R5 → 최종 사용자' },
];

// 인원 수별 병합안
export const TEAM_PLANS = [
  { n: '2인', rows: [['A / 계측·물리', 'R1+R2+R3+R4'], ['B / AI·시각화', 'R5+R6']] },
  { n: '3인', rows: [['A / 계측·광', 'R1+R2'], ['B / 유동·에너지', 'R3+R4'], ['C / AI·시각화', 'R5+R6']] },
  { n: '4인', rows: [['A / 계측', 'R1'], ['B / 물리 시뮬', 'R2+R3+R4'], ['C / AI', 'R5'], ['D / 언리얼', 'R6']] },
  { n: '6인', rows: [['전 역할 전담', 'R1~R6 각 1인 + 정기 회의']] },
];

// 일정 리스크
export const RISKS = [
  { tag: 'R1 지연', head: '전 공정 정지', body: '실측이 없으면 시뮬 입력 보정도, 학습 데이터도 현실과 어긋난다. 장비 발주·센서 확보를 착수 즉시.' },
  { tag: 'R3 계산 시간', head: '데이터 부족으로 학습 실패', body: '케이스당 수 시간. 입력 범위를 운영 구간으로 좁히고, PINO로 적은 데이터에서 버티게, 능동학습으로 필요한 케이스만.' },
  { tag: '포맷 미합의', head: 'R3·R5·R6 동시 재작업', body: 'CFD 출력 필드 이름·좌표계·단위·시간 축을 착수 전 문서로 고정. 가장 흔하고 비싼 재작업 원인.' },
  { tag: 'IES 미확보', head: 'R2 진행 불가', body: '제조사가 IES를 안 주면 광환경 시뮬 자체가 성립 안 함. 조명 선정 단계에서 필수 조건으로.' },
];
