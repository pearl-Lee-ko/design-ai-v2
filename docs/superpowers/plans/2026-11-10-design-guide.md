# Design Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 제작 기능을 보존하면서 왼쪽 메뉴로 여는 정적 디자인 가이드 화면을 추가한다.

**Architecture:** `index.html`에 앱 셸, 사이드바, 제작/가이드 뷰를 추가하고 `guide-navigation.js`가 두 뷰의 표시 상태와 접근성 상태만 관리한다. 기존 `app.js`의 단계·생성 로직은 수정하지 않는다.

**Tech Stack:** HTML, CSS, 바닐라 JavaScript, Node.js 내장 테스트 러너

**Spec:** `docs/superpowers/specs/2026-11-10-design-guide-design.md`

## Global Constraints

- 외부 AI API와 신규 런타임 의존성을 사용하지 않는다.
- 기존 PPT·포스터·랜딩페이지 로직을 변경하지 않는다.
- 현재 색상·타입·간격 토큰을 재사용한다.
- push와 배포를 수행하지 않는다.

## Review Focus

- 사이드바 메뉴 클릭 시 정확히 하나의 뷰만 표시되고 활성 메뉴가 갱신되는지 테스트한다.
- 알 수 없는 뷰 이름은 제작 화면으로 안전하게 돌아오는지 테스트한다.
- 가이드 화면이 색상·타입·레이아웃 세 섹션을 모두 포함하는지 테스트한다.
- 기존 4개 제작 패널과 스크립트 로딩 순서가 유지되는지 테스트한다.
- 좁은 화면에서 메뉴가 가로형으로 바뀌는지 CSS 검증과 실제 화면으로 확인한다.

---

### Task 1: 뷰 전환 동작

**Files:**
- Create: `tests/design-guide.test.mjs`
- Create: `guide-navigation.js`

**Interfaces:**
- Produces: `window.DesignGuideNavigation.show(viewName)`

- [ ] **Step 1: Write the failing test**
  - 실제 스크립트를 가짜 DOM에서 실행해 메뉴 클릭, 활성 상태, `aria-current`, 알 수 없는 뷰 폴백을 검증한다.
- [ ] **Step 2: Run test to verify it fails**
  - Run: `node --test tests/design-guide.test.mjs`
  - Expected: FAIL because `guide-navigation.js` does not exist.
- [ ] **Step 3: Implement minimal navigation script**
  - `data-app-view`와 `data-app-view-panel`만 토글한다.
- [ ] **Step 4: Run test to verify it passes**
  - Run: `node --test tests/design-guide.test.mjs`
  - Expected: PASS.

### Task 2: 사이드바와 디자인 가이드 화면

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/design-guide.test.mjs`

**Interfaces:**
- Consumes: `guide-navigation.js`의 데이터 속성 계약.

- [ ] **Step 1: Extend the test first**
  - 메뉴, 두 뷰, 세 가이드 섹션, 기존 4개 패널, 모바일 CSS를 검증한다.
- [ ] **Step 2: Run test to verify it fails**
  - Expected: FAIL because markup and styles are missing.
- [ ] **Step 3: Add the minimal HTML and CSS**
  - 기존 제작 마크업을 `creatorView`로 감싸고 별도 `designGuideView`를 추가한다.
- [ ] **Step 4: Run the full test and syntax checks**
  - Run: `node --test tests/design-guide.test.mjs`
  - Run: `node --check app.js; node --check templates.js; node --check guide-navigation.js`

### Task 3: 브라우저 검증

**Files:** none

- [ ] **Step 1: Serve the static project locally.**
- [ ] **Step 2: Verify desktop and mobile layout, menu switching, and existing creation flow.**
- [ ] **Step 3: Confirm Git diff contains no unrelated changes and no push/deploy occurred.**
