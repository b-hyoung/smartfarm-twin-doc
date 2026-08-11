# GPT-5 이미지 생성 프롬프트

각 섹션의 이미지 자리에 넣을 프롬프트. 앱 안에서도 각 이미지 블록의
"GPT-5 이미지 프롬프트 보기 → 복사" 버튼으로 바로 복사할 수 있다.

- 개념 씬(placeholder=false)은 GPT-5 이미지로 생성해 넣으면 된다.
- 툴 캡처(placeholder=true: Relux/OpenFOAM/언리얼)는 **실제 캡처**로 교체 권장.
  GPT 이미지는 "그럴듯한 가짜"라 제출 신뢰도가 떨어진다.
- 한글 라벨이 필요한 도식(파이프라인·CFD 입출력·경계)은 이미 SVG로 그려져 있어
  이미지 생성 불필요.

## 1. WHY — 개념 씬
A clean isometric 3D concept illustration of a smart vertical farm digital twin. Two-tier vertical grow racks with LED grow lights (magenta-pink glow), a cooling unit and a fan on the side. Semi-transparent overlays showing airflow streamlines and a temperature heatmap gradient across the space. On the right, a subtle holographic UI panel suggesting real-time data. Muted teal and warm amber accents, soft studio lighting, white background, no text, editorial tech illustration style.

## 2. R1 실측 — 센서 배치 도면
A technical isometric diagram of a two-tier vertical farm rack with sensor placement markers (temperature/humidity, PPFD light sensor, power meter) at 5-10 representative points. Small labeled sensor icons, a fan and a cooling unit. Blueprint-meets-3D style, teal line work on off-white background, clean and precise, no readable text.

## 3. R2 광환경 — (실제 Relux 캡처 권장)
A lighting simulation false-color illuminance heatmap on a horizontal grow-rack plane, smooth gradient from deep blue (low) to yellow-white (high) showing brighter center and dimmer corners, with faint iso-lux contour lines. Software-screenshot aesthetic, dark UI frame hint, no readable text.

## 4. R3 CFD — (실제 OpenFOAM/ParaView 캡처 권장)
A CFD post-processing visualization: a vertical cross-section of an indoor grow space showing a temperature field as a blue-to-red color map, overlaid with white airflow velocity vector arrows curving from a fan and a cooling outlet around two grow-rack tiers. ParaView-style scientific visualization, dark background, no readable text.

## 5. R4 에너지 — 대시보드 개념
A minimalist energy dashboard concept: three stacked horizontal bars for lighting, fan, and cooling power consumption, each with a simulated value and a measured value marker, plus a small line chart of power over time. Flat design, teal and amber, off-white background, no readable text.

## 6. R5 AI — 시스템 구조 개념
A clean systems diagram concept of an AI surrogate model hub: input operating conditions flowing into a central AI block that branches into "field prediction (operator)", "inverse/parameter estimation", "power forecast", and "optimization recommendation", outputting to a real-time API. Node-and-edge style, teal accents, off-white background, no readable text.

## 7. R6 UE — (실제 언리얼 캡처 권장)
A game-engine (Unreal-style) real-time 3D visualization of a smart farm interior: vertical grow racks under magenta LED lighting, a translucent temperature cross-section plane and airflow ribbons, with a clean floating control UI panel (sliders and gauges) on the side. Cinematic, high-fidelity render, no readable text.
