---
trigger: manual
---

## 코딩 규칙 및 지침 (React, Typescript, Node.js 환경)

다음은 React, Typescript, Node.js 기술 스택을 사용하는 환경에 맞춰 수정된 코딩 규칙 및 지침입니다.

**테스트**

- **테스트 주도 개발 (TDD):**
    - 기능 구현 전에 항상 실패하는 테스트를 먼저 작성하세요.
    - 테스트 작성, 실행, 검증 단계 (Red-Green-Refactor)를 철저히 따릅니다.
    - React 컴포넌트 테스트에는 **React Testing Library**를 사용하세요.
    - 단위 테스트 및 통합 테스트에는 **Jest** 또는 **Mocha**와 같은 테스팅 프레임워크를 사용하세요.
    - 테스트 설정 및 유틸리티 함수 관리를 위해 **Jest setupFilesAfterEnv** 또는 **Mocha hooks**를 활용하세요.
    - 필요에 따라 컴포넌트 격리 및 목킹을 위해 **msw (Mock Service Worker)**를 고려하세요.

**기본 원칙**

- **KISS (Keep It Simple, Stupid):** 요구 사항을 충족하는 가장 간단하고 명확한 솔루션을 선호합니다. 불필요한 복잡성을 피하세요.
- **DRY (Don't Repeat Yourself):** 코드 중복을 최소화하고 재사용 가능한 컴포넌트, 함수, 훅(Hooks)을 적극적으로 활용하세요.

**표준 라이브러리 및 도구**

- **날짜/시간:** 내장된 `Date` 객체 또는 `date-fns`, `moment.js`와 같이 잘 알려진 라이브러리를 사용하여 날짜 및 시간 관련 작업을 처리하세요.
- **HTTP 요청:** `fetch` API 또는 `axios`와 같은 널리 사용되는 HTTP 클라이언트 라이브러리를 사용하세요.
- **상태 관리:** 애플리케이션 규모와 복잡성에 따라 **React Context API, Redux, Zustand, Recoil** 등 적절한 상태 관리 라이브러리를 선택하여 일관성 있고 예측 가능한 상태 관리를 구현하세요.
- **유틸리티 라이브러리:** Lodash 또는 Ramda와 같은 유틸리티 라이브러리를 활용하여 일반적인 데이터 처리 작업을 간결하게 처리하세요.

**추가 원칙**

- **YAGNI (You Ain't Gonna Need It):** 현재 요구 사항에 필요하지 않은 기능이나 코드를 미리 작성하지 마세요.
- **SOLID 원칙:** 객체 지향 설계 원칙인 SOLID (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)를 준수하여 코드의 유지보수성, 테스트 용이성, 확장성을 높이세요. 특히 React 컴포넌트 설계 시 단일 책임 원칙을 유념하세요.
- **관심사의 분리:** UI 로직, 비즈니스 로직, 데이터 접근 로직 등을 명확하게 분리하여 각 부분이 독립적으로 관리되고 테스트될 수 있도록 설계하세요.

**스타일 가이드**

- **ESLint 및 Prettier:** **ESLint**와 **Prettier**를 설정하여 JavaScript 및 Typescript 코드 스타일을 일관되게 유지하고 잠재적인 오류를 사전에 방지하세요. Airbnb, Standard 등의 널리 사용되는 스타일 가이드를 따르거나 팀의 컨벤션에 맞는 규칙을 정의하세요.
- **Typescript 스타일:** Typescript 코딩 규칙을 준수하고, 명확하고 정확한 타입 정의를 사용하여 코드의 안정성과 가독성을 높이세요. `no-explicit-any`와 같은 규칙을 신중하게 관리하세요.

**코드 품질**

- **명시적인 타입 힌트:** Typescript의 강력한 타입 시스템을 최대한 활용하여 모든 변수, 함수 매개변수, 반환 값에 명시적인 타입 힌트를 제공하세요.
- **Doc 주석 (JSDoc):** 모든 컴포넌트, 함수, 클래스, 메서드에 명확하고 간결한 JSDoc 주석을 작성하여 목적, 매개변수, 반환 값, 예외 등을 설명하세요.
- **작은 단위:** 컴포넌트와 함수를 작고 집중된 책임 단위로 유지하여 재사용성과 테스트 용이성을 높이세요. 단일 책임 원칙을 따르세요.
- **모듈화:** 코드를 재사용 가능하고 테스트하기 쉬운 독립적인 모듈로 구성하세요. 기능별, 관심사별로 파일을 분리하고 `import/export` 구문을 사용하여 모듈 간의 의존성을 관리하세요.
- **의미 있는 이름:** 변수, 함수, 컴포넌트 등의 이름은 명확하고 의미 있게 지어 코드의 의도를 쉽게 파악할 수 있도록 하세요.

**데이터 처리**

- **데이터 유효성 검사:** 사용자 입력 및 API 응답 등 외부에서 유입되는 데이터에 대한 유효성 검사를 철저히 수행하세요. **Yup, Zod** 등의 라이브러리를 활용하여 스키마 기반 유효성 검사를 구현할 수 있습니다.
- **불변성 유지:** 상태 업데이트 시 불변성을 유지하여 React의 성능 최적화 및 예측 가능한 상태 변화를 보장하세요. 스프레드 연산자나 `immer`와 같은 라이브러리를 활용하세요.

**API 설계 (Node.js)**

- **RESTful API 설계:** RESTful 원칙 (HTTP 메서드, 리소스 URL, 상태 코드, JSON)을 준수하여 API를 설계하세요.
- **API 버전 관리:** API 변경 사항에 대비하여 명확한 버전 관리 전략 (예: `/api/v1/`)을 구현하세요.
- **속도 제한:** API 남용을 방지하기 위해 필요에 따라 속도 제한을 구현하세요.
- **인증 및 권한 부여:** 안전한 API를 위해 적절한 인증 (Authentication) 및 권한 부여 (Authorization) 메커니즘을 적용하세요 (예: JWT, OAuth 2.0).
- **강력한 오류 처리:** API 요청 처리 중 발생하는 예외를 적절히 처리하고, 클라이언트에게 유익한 오류 메시지와 적절한 HTTP 상태 코드를 반환하세요. 오류 로깅을 통해 서버 측에서 오류를 추적하고 디버깅할 수 있도록 하세요.

**백엔드 (Node.js)**

- **ORM/ODM:** 데이터베이스 상호 작용을 위해 **Sequelize (관계형 데이터베이스), Mongoose (MongoDB)** 등의 ORM/ODM 라이브러리를 활용하여 데이터베이스 모델링 및 쿼리를 추상화하세요.
- **매개변수화된 쿼리:** 데이터베이스 쿼리 시 SQL/NoSQL 주입 공격을 방지하기 위해 항상 매개변수화된 쿼리 또는 ORM/ODM이 제공하는 안전한 쿼리 방식을 사용하세요.
- **데이터베이스 오류 처리:** 데이터베이스 연결 오류, 쿼리 오류 등 잠재적인 데이터베이스 관련 오류를 적절히 처리하고, 사용자에게 유익한 오류 메시지를 제공하며 애플리케이션의 안정성을 유지하세요.

**로깅 및 지표**

- **중앙 집중식 로깅:** `winston`, `morgan`과 같은 로깅 라이브러리를 사용하여 애플리케이션의 동작을 기록하고, 로그 수준 (DEBUG, INFO, WARNING, ERROR, CRITICAL)을 적절히 활용하여 로그 메시지를 분류하세요.
- **중앙화된 지표:** 필요에 따라 애플리케이션의 성능 및 상태를 모니터링하기 위한 지표를 수집하고 시각화하는 시스템을 구축하세요.

**구성 및 환경**

- **환경 변수:** 중요한 설정 값 (API 키, 데이터베이스 URL 등)은 코드에 직접 하드코딩하지 않고 환경 변수를 통해 관리하세요. `.env` 파일과 `dotenv` 라이브러리를 활용하여 개발 환경 설정을 관리하고, 배포 환경에서는 적절한 환경 변수 설정 방법을 사용하세요.
- **구성 파일:** 애플리케이션의 다양한 설정을 관리하기 위해 `config` 디렉토리 또는 별도의 설정 파일을 활용하세요.

**유틸리티**

- **`utils` 디렉토리:** 특정 컴포넌트나 모듈에 종속되지 않는 재사용 가능한 유틸리티 함수들을 `utils` 디렉토리에 모아 관리하세요.

**테스트 데이터**

- **`__tests__/fixtures`:** 테스트에 필요한 샘플 데이터 및 Mock 데이터를 `__tests__/fixtures` 디렉토리에서 관리하세요. Jest의 `mock` 기능 등을 활용하여 외부 의존성을 격리하세요.

**성능**

- **효율적인 코드:** 불필요한 계산, 반복, DOM 조작을 최소화하고 효율적인 알고리즘과 자료 구조를 사용하여 성능을 최적화하세요.
- **코드 분할 (Code Splitting):** React Router의 `React.lazy`와 `Suspense` 등을 활용하여 초기 로딩 시간을 줄이고 사용자 경험을 개선하세요.
- **메모이제이션:** `React.memo`, `useMemo`, `useCallback` 훅을 사용하여 불필요한 리렌더링을 방지하고 성능을 최적화하세요.

**반환 값**

- **의미 있는 반환 값:** 함수 및 비동기 작업의 결과는 명확하고 예측 가능한 값을 반환하도록 설계하고, 오류 발생 시 적절한 오류 객체 또는 상태 코드를 포함하세요.

**최신 기술 활용**

- **최신 Node.js 및 React 버전:** 프로젝트 요구 사항을 고려하여 가능한 범위 내에서 최신 안정화된 Node.js 및 React 버전을 사용하세요.

**자동화**

- **`package.json` 스크립트:** 애플리케이션 빌드 (`build`), 개발 서버 실행 (`start`, `dev`), 테스트 (`test`), 린팅 (`lint`), 포맷팅 (`format`) 등의 작업을 자동화하는 스크립트를 `package.json`에 정의하여 개발 프로세스를 효율화하세요.

**보안**

- **보안 취약점 방지:** 웹 애플리케이션의 일반적인 보안 취약점 (XSS, CSRF 등)을 인지하고 이를 방지하기 위한 노력을 기울이세요.
- **비밀 관리:** API 키, 비밀번호 등 중요한 비밀 정보는 코드에 직접 저장하지 않고 환경 변수 또는 안전한 비밀 관리 시스템을 사용하세요.

**협업**

- **명확한 지침 준수:** 제공된 지침과 스펙을 정확하게 준수하고, 모호한 부분은 질문하여 명확히 하세요.
- **포괄적인 문서:** 컴포넌트, 함수, API 엔드포인트 등에 대한 명확하고 최신 문서를 제공하여 다른 개발자들이 코드를 이해하고 유지보수하는 데 도움을 주세요. README 파일에 프로젝트의 목적, 설정, 실행 방법 등을 명시하세요.

**종속성 관리**

- **`package.json` 및 `package-lock.json`:** `npm` 또는 `yarn`을 사용하여 프로젝트의 종속성을 관리하고, `package-lock.json` 또는 `yarn.lock` 파일을 통해 종속성 버전을 일관되게 유지하세요.

**코드 포맷팅 및 린팅**

- **Prettier:** Prettier를 사용하여 코드 스타일을 자동으로 일관되게 포맷팅하세요.
- **ESLint:** ESLint를 설정하여 잠재적인 코드 오류 및 스타일 문제를 사전에 감지하고 코드 품질을 향상시키세요.

**리소스 관리**

- **컨텍스트 관리자 (Custom Hooks):** React에서 특정 리소스의 라이프사이클을 관리해야 하는 경우 (예: 이벤트 리스너 등록/해제) 커스텀 훅을 통해 컨텍스트 관리 패턴을 구현할 수 있습니다.

이 규칙들을 준수함으로써 React, Typescript, Node.js 기반 프로젝트의 코드 품질, 유지보수성, 확장성을 향상시킬 수 있습니다.