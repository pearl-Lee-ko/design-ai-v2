import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

class FakeClassList {
  constructor(initial = []) { this.values = new Set(initial); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  toggle(value, force) {
    const next = force ?? !this.values.has(value);
    next ? this.values.add(value) : this.values.delete(value);
    return next;
  }
  contains(value) { return this.values.has(value); }
}

class FakeElement {
  constructor(dataset, classes = []) {
    this.dataset = dataset;
    this.classList = new FakeClassList(classes);
    this.attributes = new Map();
    this.listeners = new Map();
  }
  addEventListener(type, handler) { this.listeners.set(type, handler); }
  click() { this.listeners.get('click')?.(); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
}

function loadNavigation() {
  const creatorButton = new FakeElement({ appView: 'creator' }, ['active']);
  creatorButton.setAttribute('aria-current', 'page');
  const guideButton = new FakeElement({ appView: 'guide' });
  const creatorPanel = new FakeElement({ appViewPanel: 'creator' });
  const guidePanel = new FakeElement({ appViewPanel: 'guide' }, ['hidden']);
  const buttons = [creatorButton, guideButton];
  const panels = [creatorPanel, guidePanel];
  const window = { scrollToCalls: [], scrollTo(...args) { this.scrollToCalls.push(args); } };
  const document = {
    querySelectorAll(selector) {
      if (selector === '[data-app-view]') return buttons;
      if (selector === '[data-app-view-panel]') return panels;
      return [];
    },
  };
  const source = fs.readFileSync(new URL('../guide-navigation.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, { document, window });
  return { creatorButton, guideButton, creatorPanel, guidePanel, window };
}

test('디자인 가이드 메뉴 클릭은 가이드 화면만 표시하고 현재 메뉴를 표시한다', () => {
  const ui = loadNavigation();

  ui.guideButton.click();

  assert.equal(ui.creatorPanel.classList.contains('hidden'), true);
  assert.equal(ui.guidePanel.classList.contains('hidden'), false);
  assert.equal(ui.creatorButton.classList.contains('active'), false);
  assert.equal(ui.guideButton.classList.contains('active'), true);
  assert.equal(ui.creatorButton.getAttribute('aria-current'), null);
  assert.equal(ui.guideButton.getAttribute('aria-current'), 'page');
  assert.deepEqual(ui.window.scrollToCalls.at(-1), [0, 0]);
});

test('알 수 없는 화면 이름은 제작하기 화면으로 안전하게 돌아온다', () => {
  const ui = loadNavigation();

  ui.window.DesignGuideNavigation.show('missing');

  assert.equal(ui.creatorPanel.classList.contains('hidden'), false);
  assert.equal(ui.guidePanel.classList.contains('hidden'), true);
  assert.equal(ui.creatorButton.classList.contains('active'), true);
  assert.equal(ui.guideButton.classList.contains('active'), false);
});
