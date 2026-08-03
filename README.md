<div align="center">

# KapaBle (케이퍼블)

### 청년을 위한 개인 맞춤형 주거금융 시뮬레이션

매물이 아닌 재정을 진단합니다 — 자산·부채·주거비의 확률적 미래를 계산하는 서비스

**2026 제8회 KB AI Challenge** · Team 라이언고슬링 (김가영 · 신지민 · 황규리)
### 배포 링크 : https://mellifluous-pixie-49f291.netlify.app/

</div>

---

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [문제 정의](#문제-정의)
3. [핵심 기능](#핵심-기능)
4. [시스템 아키텍처](#시스템-아키텍처)
5. [기술 스택](#기술-스택)
6. [모델 성능](#모델-성능)
7. [폴더 구조](#폴더-구조)
8. [시작하기](#시작하기)
9. [데이터 출처](#데이터-출처)

---

## 프로젝트 소개

**KapaBle**은 사회초년생이 전세·월세 등 주거를 선택할 때, 그 선택이 미래 자산에 어떤 영향을 미치는지 확률적으로 계산해주는 AI 기반 주거금융 진단 서비스입니다.

기존 서비스가 "어떤 매물을 살지"에 집중한다면, KapaBle은 "이 조건이 나에게 재정적으로 맞는지, 그리고 목표 자산에 도달할 확률이 얼마인지"를 계산합니다. 정형 재정 정보와 사용자가 자연어로 입력한 생애 계획(이직, 결혼, 소득 변화 등)을 함께 분석해, 주거 선택 이후의 자산·부채·주거비를 시뮬레이션하고 더 안전한 대안을 제시합니다.

## 문제 정의

사회초년생 60명 대상 설문조사(2026.07.28 ~ 2026.08.01) 결과입니다.

- 응답자의 96.2%가 주거 선택이 미래 자산에 미치는 영향을 계산해본 적이 없거나 감으로만 가늠한다고 답했습니다.
- 계산해보지 않은 이유는 **너무 복잡해서(39.3%)**, **계산 방법을 몰라서(32.1%)**, **필요한 정보를 찾기 어려워서(28.6%)** 순이었습니다.
- 청년 정책·지원금(65%), 나에게 적절한 목표 자산(50%) 등 재정 의사결정에 필요한 핵심 정보에 대한 이해도도 낮게 나타났습니다.

즉, '감'에 의존하는 근본 원인은 **필요한 재정·주거 정보에 대한 접근성과 이해도 부족**이며, KapaBle은 이 계산을 대신 수행해 확률로 명확하게 제시합니다.

## 핵심 기능

- **주거비 분포 예측**: 아파트 · 오피스텔 · 연립다세대 3개 주택유형, 전세·월세 6개 시장군에 대해 LightGBM 분위수 회귀로 향후 12개월 상승률을 q10 / q50 / q90 범위로 예측
- **자연어 기반 생애사건 인식**: KoBERT 파인튜닝 모델이 사용자가 입력한 문장에서 이직·소득 변화·결혼 등 금융 사건을 계층형 멀티라벨로 추출
- **몬테카를로 자산 시뮬레이션**: 시장 임대료 성장률(AR(1) + 부트스트랩), 소득 성장, 실직 발생, 긴급 지출 등을 확률분포로 샘플링해 수천 개 시나리오를 생성하고 미래 자산 분포를 계산
- **의사결정 리포트**: 목표 달성 확률 · DTI · 주거비 부담률을 종합한 Decision Score와, 사용자 조건 외 대안 조건 비교 제안을 리포트로 제공

## 시스템 아키텍처
<p align="center"><img width="822" height="370" alt="image" src="https://github.com/user-attachments/assets/e525d1fb-948e-4d73-8e54-96d6b2c7177f" />


**파이프라인 요약**

| 단계 | 설명 |
|---|---|
| 데이터 수집 | 국토교통부 실거래가 공개시스템에서 API로 월별 자동 수집 |
| 학습 데이터 구축 | 주택유형별 패널 데이터 구축 및 특성 엔지니어링 (전월세 전환율 통합, 헤도닉 보정 등) |
| 예측 모델 학습 | 주택유형(아파트/오피스텔/연립다세대) × 전세/월세, 총 6개 시장군에 대한 LightGBM 분위수 회귀 모델 학습 |
| 사용자 입력 | 나이·소득·자산·목표·희망 주거조건 등 정형 입력 + 자연어 입력 |
| 자연어 처리 | KoBERT 기반 계층형 멀티라벨 분류로 금융 사건 탐지 및 확인 질문 생성 |
| 시뮬레이션 | Monte Carlo 방식으로 시장 성장률·소득·실직·지출을 결합해 미래 자산 분포 생성 |
| 결과 출력 | Decision Score 산출 및 사용자 맞춤 리포트 생성 |

## 기술 스택

| 구분 | 기술 |
|---|---|
| AI / ML | Python, LightGBM(Quantile Regression), KoBERT(Fine-tuning), scikit-learn, pandas, numpy |
| 자연어 처리 | KoBERT, SentencePiece Tokenizer, Class-balanced BCE Loss |
| 시뮬레이션 | Monte Carlo Simulation, AR(1) 자기회귀, Bootstrap 리샘플링 |
| Backend | Django, Django REST Framework |
| Frontend | React |
| Database | Postgresql |
| API | FastAPI |
| Container | Docker |
| Infra / Deploy | Render, Netlify, Google Cloud Build |


## 모델 성능

### LightGBM 주거비 예측 (12개월 상승률 예측 오차, MAE)

| 주거유형 | Flat MAE | Persistence MAE | KapaBle 모델 MAE |
|---|---|---|---|
| 아파트 | 0.0297 | 0.0690 | **0.0267** |
| 오피스텔 | 0.0593 | 0.0377 | **0.0294** |
| 연립·다세대 | 0.0444 | 0.0535 | **0.0405** |

- Flat baseline: 12개월 후 가격 변화가 0%라고 예측
- Persistence baseline: 최근 12개월 상승률이 다음 12개월에도 유지된다고 예측

### KoBERT 자연어 처리 성능

| 모델 | 주요 특징 | Macro-F1 | Micro-F1 |
|---|---|---|---|
| KoBERT | 단일 출력층 | 0.6088 | 0.6126 |
| 계층형 KoBERT | OOD 문장 차단 + 계층형 구조 분류 | 0.6486 | 0.6591 |
| KapaBle 적용 혼합 KoBERT | 계층형 구조 + 규칙 기반 탐지 + 라벨별 신뢰도 보정 | **0.8807** | **0.8912** |
| **최종 개선율** | 기본 KoBERT 대비 | **+44.7%** | **+45.5%** |

## 폴더 구조

### Backend Directory Structure

```text
back
├── benchmarks/      # Benchmark data API
├── config/          # Django project configuration
├── data/            # Static benchmark datasets
├── profiles/        # User profile management
├── simulation/      # Simulation & decision engine
├── support/         # Housing support & policy matching
├── utils/           # Shared constants and utilities
├── manage.py
└── requirements.txt
```

### Backend Source Description

| Directory | Description |
|-----------|-------------|
| `config/` | Django 프로젝트 설정 및 URL, WSGI/ASGI 구성 |
| `profiles/` | 사용자 프로필 생성 및 조회 API |
| `benchmarks/` | 연령·소득·지역 기준 벤치마크 데이터 조회 API |
| `simulation/` | 사용자 정보를 기반으로 의사결정 점수 및 시뮬레이션 수행 |
| `support/` | 청년 주거 정책 및 지원 프로그램 추천 API |
| `data/` | 벤치마크 및 정책 데이터(CSV) |
| `utils/` | 공통 상수 및 유틸리티 함수 |

### Frontend Directory Structure

```text
front
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and static resources
│   ├── components/  # Reusable UI components
│   ├── lib/         # Shared utilities and API modules
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### AI Directory Structure

```text
AI
├── ai_server/
│   ├── app/         # AI inference server
│   ├── data/        # Resources for inference
│   ├── tests/       # API tests
│   └── Dockerfile
├── monte-carlo/     # Monte Carlo simulation engine
├── requirements.txt
└── cloudbuild.yaml
```

### AI Pipeline

- **Housing Forecasting**
  - Predicts future housing cost distributions using LightGBM.

- **Financial Event Extraction**
  - Extracts structured financial events from natural language using KoBERT.

- **Monte Carlo Simulation**
  - Simulates future asset trajectories based on predicted housing costs and user financial conditions.

- **Inference API**
  - Provides integrated prediction and simulation results through REST APIs.

## 시작하기

### Backend

```bash
# 가상환경 생성
python -m venv venv

# 활성화
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
python manage.py runserver
```

### Frontend

```bash
# 의존성 설치
npm install

# 서버 실행
npm run dev
```

### AI 

```bash
# 의존성 설치
pip install -r requirements.txt
cd ai_server
# 서버 실행
uvicorn app.main:app --reload
```

## 데이터 출처

- [국토교통부 실거래가 공개시스템](https://rt.molit.go.kr/) — 아파트·오피스텔·연립다세대 전월세 실거래 데이터 (2020.01 ~ 2025.12)
- 한국부동산원 — 전월세 전환율 공표 자료
- KOSIS(국가통계포털) — 희망 주거 조건 대비 시세 분포 비교용 통계

---

<div align="center">

2026 제8회 KB AI Challenge 제출작

</div>
