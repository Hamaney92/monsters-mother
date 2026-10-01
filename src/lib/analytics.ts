export const CONSENT_KEY = 'mm.analytics-consent.v1';
export const CONSENT_SECONDS = 180 * 24 * 60 * 60;
type Choice = 'granted' | 'denied';
type Consent = { value: Choice; expires: number; version: 1 };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function parseConsent(raw: string | null, now = Date.now()): Consent | null {
  try {
    const v = JSON.parse(raw || 'null');
    return v?.version === 1 && ['granted', 'denied'].includes(v.value) &&
      Number.isFinite(v.expires) && v.expires > now && v.expires <= now + CONSENT_SECONDS * 1000
      ? v : null;
  } catch { return null; }
}

// Do not forward free-text query strings, fragments or external referrer paths.
export function cleanReferrer(value: string): string {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.origin + '/' : ''; }
  catch { return ''; }
}

export function amazonDestination(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !/^(www\.)?amazon\.(com|fr|co\.uk|ca|com\.au|de|co\.jp|in)$/.test(url.hostname)) return null;
    const asin = url.pathname.match(/\/dp\/([A-Z0-9]{10})(?:\/|$)/)?.[1];
    return asin ? `${url.origin}/dp/${asin}` : null;
  } catch { return null; }
}

export function initAnalytics(root: HTMLElement, win: AnalyticsWindow = window, doc: Document = document) {
  const id = root.dataset.measurementId || '';
  const origin = root.dataset.origin || '';
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const panel = root.querySelector<HTMLElement>('#privacy-panel')!;
  const opener = root.querySelector<HTMLButtonElement>('[data-privacy-open]')!;
  const status = root.querySelector<HTMLElement>('[data-privacy-status]')!;
  const disableKey = `ga-disable-${id}`;
  const flags = win as unknown as Record<string, unknown>;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  let choice: Consent | null = null;
  let loaded = false;
  const read = () => { try { return parseConsent(win.localStorage.getItem(CONSENT_KEY)); } catch { return null; } };
  const show = (open: boolean) => { panel.hidden = !open; opener.setAttribute('aria-expanded', String(open)); };
  const report = () => { status.textContent = choice ? root.dataset[choice.value] || '' : ''; };
  const current = () => choice?.value === 'granted' && choice.expires > Date.now();

  const clearCookies = () => {
    // Only our GA cookies, at the exact host/root domain and known path scopes.
    const names = doc.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => n === '_ga' || n === `_ga_${id.slice(2)}`);
    const host = win.location.hostname;
    const domains = ['', host, `.${host}`];
    if (host.startsWith('www.')) domains.push(host.slice(4), `.${host.slice(4)}`);
    const segments = win.location.pathname.split('/').filter(Boolean);
    const paths = new Set(['/']);
    for (let i = 1; i <= segments.length; i++) paths.add('/' + segments.slice(0, i).join('/'));
    for (const name of names) for (const domain of domains) for (const path of paths) {
      doc.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    }
  };

  const start = () => {
    // A production build previewed on localhost must never pollute live reports.
    if (loaded || !current() || win.location.origin !== origin) return;
    loaded = true;
    flags[disableKey] = false;
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () { win.dataLayer!.push(arguments); };
    win.gtag('consent', 'default', denied);
    win.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    win.gtag('js', new Date());
    win.gtag('config', id, {
      page_location: origin + win.location.pathname,
      page_referrer: cleanReferrer(doc.referrer),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: CONSENT_SECONDS,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    const script = doc.createElement('script');
    script.async = true;
    script.dataset.analyticsTag = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    doc.head.appendChild(script);
  };

  const stop = () => {
    flags[disableKey] = true;
    if (loaded) win.gtag?.('consent', 'update', denied);
    clearCookies();
    // Unload GA listeners as well as disabling collection; no SDK on the next load.
    if (loaded) win.location.reload();
  };

  const choose = (value: Choice) => {
    choice = { value, version: 1, expires: Date.now() + CONSENT_SECONDS * 1000 };
    try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice)); } catch { /* This page only. */ }
    report();
    if (value === 'granted') start(); else stop();
    show(false);
    opener.focus({ preventScroll: true });
  };

  root.querySelector('[data-privacy-accept]')!.addEventListener('click', () => choose('granted'));
  root.querySelector('[data-privacy-reject]')!.addEventListener('click', () => choose('denied'));
  root.querySelector('[data-privacy-close]')!.addEventListener('click', () => { show(false); opener.focus({ preventScroll: true }); });
  opener.addEventListener('click', () => { report(); show(true); root.querySelector<HTMLElement>('#privacy-title')!.focus({ preventScroll: true }); });
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { show(false); opener.focus({ preventScroll: true }); } });

  const sync = () => {
    choice = read();
    report();
    if (current()) start();
    else { stop(); show(!choice); }
  };
  win.addEventListener('storage', event => { if (event.key === CONSENT_KEY || event.key === null) sync(); });
  win.addEventListener('pageshow', event => { if (event.persisted) sync(); });
  // Recheck consent after backgrounding or a long-open page.
  doc.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'visible') sync(); });
  win.setInterval(() => { if (loaded && !current()) sync(); }, 60_000);
  doc.addEventListener('click', event => {
    if (!loaded || !current()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    const destination = anchor && amazonDestination(anchor.href);
    if (destination) win.gtag?.('event', 'amazon_click', {
      send_to: id, link_url: destination, language: doc.documentElement.lang,
      page_location: origin + win.location.pathname,
    });
  });
  flags[disableKey] = true;
  opener.hidden = false;
  sync();
}
