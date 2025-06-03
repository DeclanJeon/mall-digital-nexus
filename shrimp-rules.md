# 프로젝트 개발 표준 (AI 에이전트 전용)

## 1. 프로젝트 개요
- **기술 스택**: React 18, TypeScript 5, Vite 4
- **주요 기능**:
  - 커뮤니티 기능 (게시판, 댓글)
  - 개인 맞춤형 피어몰
  - 사용자 프로필 관리

## 2. 파일 구조
- `src/`
  - `components/`: 재사용 가능한 UI 컴포넌트 (Atomic Design)
  - `pages/`: 페이지 단위 컴포넌트 (Next.js 스타일)
  - `services/`: API 클라이언트 및 비즈니스 로직
  - `utils/`: 유틸리티 함수 (TypeScript)
  - `types/`: 전역 타입 정의

## 3. 코딩 규칙
### 3.1. 네이밍
- React 컴포넌트: `PascalCase` (예: `UserProfileCard.tsx`)
- 유틸 함수: `camelCase` (예: `formatDate.ts`)
- 타입: `PascalCase` (예: `UserProfileType.ts`)

### 3.2. 타입스크립트
- `any` 사용 금지
- 모든 함수는 명시적 반환 타입 지정
- API 응답 타입은 `types/`에 정의

## 4. 주요 상호작용
| 파일 | 연관 파일 | 주의사항 |
|------|-----------|----------|
| App.tsx | 모든 페이지 | 전역 상태 관리 |
| UserService.ts | UserProfile.tsx | API 호출 시 에러 처리 |

## 5. 금지 사항
- `document.getElementById` 직접 사용 금지 (useRef 사용)
- 컴포넌트 단 500줄 이상
- CSS-in-JSS 외 스타일시트 사용
- 테스트 없이 커밋
