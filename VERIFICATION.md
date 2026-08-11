# 에이전트 사실검증 리포트

이 문서의 **핵심 기능**은 사이드바 용어 설명이 3개 도메인 검증 에이전트의
적대적 사실검증을 거쳤다는 점이다. 아래는 그 결과 요약.

## 검증 방식
- 초안(용어 22개 + 파이프라인 주장 6개)을 작성
- 도메인별 에이전트 3종을 병렬로 실행, 각자 웹 근거로 적대적 검증
  - 물리/시뮬 에이전트: CFD·OpenFOAM·Relux·EnergyPlus·경계조건·격자·CFD 입출력
  - AI/ML 에이전트: PINN·FNO·PINO·대리모델·능동학습·잔차보정·역문제·최적화·XGBoost·TCN
  - 조명/식물 에이전트: IES·PPFD·lux·균제도·디지털 트윈·lux↔PPFD
- 판정: CORRECT / IMPRECISE / WRONG

## 결과: 명백한 오류(WRONG) 0건, 정정(IMPRECISE) 4건

| 항목 | 판정 | 정정 내용 | 근거 |
|---|---|---|---|
| CFD 출력 "습도장" (P2) | IMPRECISE | 습도는 CFD 기본 출력 아님 → 별도 수증기 수송방정식·수분 소스·경계조건 필요. 압력장 추가 | OpenFOAM species/scalarTransport |
| PINN (C3) | IMPRECISE | "데이터 적어도 OK"는 학습 불안정성 은폐 → 톤 완화. "역문제에 강하다"→"자연스럽게 확장" | Raissi et al. 2019, JCP |
| 능동학습 (C12) | IMPRECISE | "오차가 큰"→ 라벨 전엔 오차 모름. 기준은 "불확실성/정보이득" | uncertainty sampling |
| 디지털 트윈 (C22) | IMPRECISE | "실시간·양방향" 과장. 실시간은 필수 아님, 가상→물리 제어 없으면 "디지털 섀도" | Kritzinger et al. 2018 |
| IES (C6) | 경미 | IESNA→IES(2013 개칭), ANSI/IES LM-63-19가 현행명 | ANSI/IES LM-63 |

## CORRECT 판정 (원논문·표준 대조 일치)
CFD, OpenFOAM(FVM), Relux, EnergyPlus(DOE/NREL), 경계조건, 격자,
FNO(Li 2020), PINO(Li 2021), 대리모델, 잔차보정, 역문제, 다목적/베이지안 최적화,
XGBoost(Chen&Guestrin 2016), TCN(Bai 2018), PPFD(400~700nm PAR), lux(V(λ)),
균제도(U0=Emin/Eavg), lux↔PPFD 스펙트럼 의존, 파이프라인 논리(P1), CFD 병목(P6), 예측/보정 분담(P4).

정정 4건은 모두 `app/data/glossary.js`와 `app/data/content.js`에 반영 완료.

---

## 2차 재검증 (정정본 대상, 독립 에이전트 2종)

1차 정정본을 새 에이전트 2종이 적대적으로 재검증. **1차 정정 4건은 과잉정정 없이 모두 정확** 재확인.
추가로 3건 정밀화:

| 항목 | 지적 | 반영 |
|---|---|---|
| OpenFOAM `full` | "Open Field…"에 **source 누락** → "Open-source Field Operation And Manipulation" | 수정 |
| 잔차보정 | "물리제약→PINN" 이분법이 *데이터 불일치 잔차*와 *PDE 잔차*를 혼동 + 표준도구 GP 누락 | 가우시안 프로세스(Kennedy–O’Hagan) 명시, 두 잔차 개념 구분 |
| 디지털 트윈 | "제어 없으면 섀도"에 "물리→가상 자동흐름 필요" 조건 누락(둘 다 수동이면 디지털 모델) | 섀도/모델 구분 보완 |

프로젝트 논리 주장 3건(FNO/PINN 역할분리, UE 실시간 추론, OOD→능동학습)도 재검증 결과 **모두 타당(CORRECT)**.
2차 통과 — 신규 사실오류 0건.

