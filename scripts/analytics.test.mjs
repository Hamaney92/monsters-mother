import test from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_KEY, CONSENT_SECONDS, parseConsent, cleanReferrer, amazonDestination, initAnalytics } from '../src/lib/analytics.ts';

const stored = (value, offset = CONSENT_SECONDS * 1000) => JSON.stringify({ version: 1, value, expires: Date.now() + offset });
function fixture({ saved = null, origin = 'https://mothersmonster.com', blocked = false } = {}) {
  class Node {
    hidden = true; textContent = ''; dataset = {}; listeners = {}; attrs = {};
    addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
    emit(name, extra = {}) { for (const fn of this.listeners[name] || []) fn(extra); }
    setAttribute(name, value) { this.attrs[name] = value; }
    focus() { this.focused = true; }
  }
  const selectors = ['#privacy-panel', '[data-privacy-open]', '[data-privacy-status]', '[data-privacy-accept]', '[data-privacy-reject]', '[data-privacy-close]', '#privacy-title'];
  const elements = Object.fromEntries(selectors.map(s => [s, new Node()]));
  const root = new Node();
  root.dataset = { measurementId: 'G-EX3NWTTVFR', origin: 'https://mothersmonster.com', granted: 'Accepted', denied: 'Refused' };
  root.querySelector = s => elements[s];
  const state = { saved, scripts: [], cookies: [], reloads: 0, intervals: [] };
  const doc = new Node();
  doc.referrer = 'https://example.org/private?email=private@example.org#hidden';
  doc.documentElement = { lang: 'fr' };
  doc.visibilityState = 'visible';
  doc.createElement = () => new Node();
  doc.head = { appendChild: s => state.scripts.push(s) };
  Object.defineProperty(doc, 'cookie', { get: () => '_ga=abc; _ga_EX3NWTTVFR=def; important_cookie=keep', set: v => state.cookies.push(v) });
  const win = new Node();
  win.location = { origin, hostname: new URL(origin).hostname, pathname: '/fr/read/', reload: () => state.reloads++ };
  win.localStorage = {
    getItem: key => { assert.equal(key, CONSENT_KEY); if (blocked) throw new Error('blocked'); return state.saved; },
    setItem: (key, val) => { assert.equal(key, CONSENT_KEY); if (blocked) throw new Error('blocked'); state.saved = val; },
  };
  win.setInterval = fn => state.intervals.push(fn);
  const click = selector => elements[selector].emit('click');
  const commands = () => (win.dataLayer || []).map(args => Array.from(args));
  initAnalytics(root, win, doc);
  return { root, win, doc, state, elements, click, commands };
}

test('consent accepts valid choices and rejects corrupt, expired, unknown, excessive or future-version data', () => {
  assert.equal(parseConsent(stored('granted'))?.value, 'granted');
  assert.equal(parseConsent(stored('denied'))?.value, 'denied');
  for (const input of [null, 'bad json', '{}', stored('maybe'), stored('granted', -1), stored('granted', 1000 * CONSENT_SECONDS + 60000), '{"version":2,"value":"granted","expires":9999999999999}']) assert.equal(parseConsent(input), null);
});
test('referrers lose paths, credentials, query strings and fragments', () => {
  assert.equal(cleanReferrer('https://u:p@example.org/private?x=secret#frag'), 'https://example.org/');
  assert.equal(cleanReferrer('javascript:alert(1)'), '');
  assert.equal(cleanReferrer(''), '');
});
test('Amazon event only accepts canonical product links and strips tracking parameters', () => {
  assert.equal(amazonDestination('https://www.amazon.com/dp/B0HKYDF7BY?ref=anything#reviews'), 'https://www.amazon.com/dp/B0HKYDF7BY');
  assert.equal(amazonDestination('https://amazon.com.evil.test/dp/B0HKYDF7BY'), null);
  assert.equal(amazonDestination('https://www.amazon.com/s?k=private'), null);
  assert.equal(amazonDestination('mailto:person@example.com'), null);
});
test('first visit makes zero GA requests and shows the optional banner', () => {
  const f = fixture();
  assert.equal(f.state.scripts.length, 0);
  assert.equal(f.commands().length, 0);
  assert.equal(f.elements['#privacy-panel'].hidden, false);
  assert.equal(f.win['ga-disable-G-EX3NWTTVFR'], true);
});
test('refusal persists, closes the banner and never loads the SDK', () => {
  const f = fixture(); f.click('[data-privacy-reject]');
  assert.equal(parseConsent(f.state.saved).value, 'denied');
  assert.equal(f.state.scripts.length, 0);
  assert.equal(f.elements['#privacy-panel'].hidden, true);
  assert.equal(f.state.reloads, 0);
  assert.ok(f.state.cookies.length > 0);
  assert.ok(f.state.cookies.every(v => v.startsWith('_ga')));
});
test('saved refusal remains off on subsequent pages', () => {
  const f = fixture({ saved: stored('denied') });
  assert.equal(f.state.scripts.length, 0);
  assert.equal(f.elements['#privacy-panel'].hidden, true);
});
test('acceptance loads exactly one tag, consent before config and ads always denied', () => {
  const f = fixture(); f.click('[data-privacy-accept]'); f.click('[data-privacy-accept]');
  assert.equal(f.state.scripts.length, 1);
  assert.equal(f.state.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-EX3NWTTVFR');
  const c = f.commands();
  assert.deepEqual(c.map(x => x[0]), ['consent', 'consent', 'js', 'config']);
  assert.equal(c[0][2].analytics_storage, 'denied');
  assert.equal(c[1][2].analytics_storage, 'granted');
  assert.equal(c[1][2].ad_storage, 'denied');
  assert.equal(c[1][2].ad_user_data, 'denied');
  assert.equal(c[1][2].ad_personalization, 'denied');
  assert.equal(c[3][2].page_location, 'https://mothersmonster.com/fr/read/');
  assert.equal(c[3][2].page_referrer, 'https://example.org/');
  assert.equal(c[3][2].allow_google_signals, false);
  assert.equal(c[3][2].cookie_update, false);
  assert.equal(c[3][2].cookie_expires, CONSENT_SECONDS);
});
test('stored acceptance starts automatically only on the production origin', () => {
  assert.equal(fixture({ saved: stored('granted') }).state.scripts.length, 1);
  for (const origin of ['http://127.0.0.1:4321', 'https://hamaney92.github.io', 'https://example.com']) {
    const f = fixture({ origin }); f.click('[data-privacy-accept]'); assert.equal(f.state.scripts.length, 0);
  }
});
test('withdrawal disables collection, removes only GA cookies and reloads without SDK', () => {
  const f = fixture({ saved: stored('granted') });
  f.click('[data-privacy-open]'); f.click('[data-privacy-reject]');
  assert.equal(f.win['ga-disable-G-EX3NWTTVFR'], true);
  assert.equal(f.commands().at(-1)[2].analytics_storage, 'denied');
  assert.equal(f.state.reloads, 1);
  assert.equal(fixture({ saved: f.state.saved }).state.scripts.length, 0);
  assert.ok(f.state.cookies.every(v => !v.startsWith('important_cookie')));
});
test('expired consent reopens banner without a tag', () => {
  const f = fixture({ saved: stored('granted', -1000) });
  assert.equal(f.state.scripts.length, 0);
  assert.equal(f.elements['#privacy-panel'].hidden, false);
});
test('another tab withdrawing consent disables this page too', () => {
  const f = fixture({ saved: stored('granted') });
  f.state.saved = stored('denied'); f.win.emit('storage', { key: CONSENT_KEY });
  assert.equal(f.win['ga-disable-G-EX3NWTTVFR'], true);
  assert.equal(f.state.reloads, 1);
});
test('background expiry stops a restored page', () => {
  const f = fixture({ saved: stored('granted') });
  f.state.saved = stored('granted', -1000); f.doc.emit('visibilitychange');
  assert.equal(f.win['ga-disable-G-EX3NWTTVFR'], true);
  assert.equal(f.state.reloads, 1);
});
test('blocked browser storage remains fail-closed on load, allows this-page consent', () => {
  const f = fixture({ blocked: true });
  assert.equal(f.state.scripts.length, 0);
  f.click('[data-privacy-accept]'); assert.equal(f.state.scripts.length, 1);
});
test('closing without choosing never grants consent; settings can reopen', () => {
  const f = fixture(); f.click('[data-privacy-close]');
  assert.equal(f.state.scripts.length, 0); assert.equal(f.state.saved, null);
  f.click('[data-privacy-open]');
  assert.equal(f.elements['#privacy-panel'].hidden, false);
  assert.equal(f.elements['#privacy-title'].focused, true);
});
test('Amazon clicks are measured only after consent, with no purchase event or query data', () => {
  const originalElement = globalThis.Element;
  globalThis.Element = class {};
  try {
    const f = fixture();
    const target = new globalThis.Element();
    target.closest = () => ({ href: 'https://amazon.com/dp/B0HKYDF7BY?private=value' });
    f.doc.emit('click', { target });
    assert.equal(f.commands().length, 0);
    f.click('[data-privacy-accept]');
    f.doc.emit('click', { target });
    assert.deepEqual(f.commands().at(-1), ['event', 'amazon_click', {
      send_to: 'G-EX3NWTTVFR', link_url: 'https://amazon.com/dp/B0HKYDF7BY', language: 'fr', page_location: 'https://mothersmonster.com/fr/read/',
    }]);
    f.click('[data-privacy-reject]');
    const n = f.commands().length;
    f.doc.emit('click', { target });
    assert.equal(f.commands().length, n);
  } finally {
    if (originalElement === undefined) delete globalThis.Element;
    else globalThis.Element = originalElement;
  }
});
