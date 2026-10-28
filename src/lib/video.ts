export const VIDEO_ID = 'dqCGNrQ6N_o';
export const VIDEO_EVENT = 'mm:video';
export type VideoSignal = { name: 'video_load' | 'video_start' | 'video_progress' | 'video_complete' | 'video_error'; percent?: number; current?: number; duration?: number };

// Milestones describe playhead positions, not cumulative time watched.
export function videoReporter(emit: (signal: VideoSignal) => void) {
  let started = false, completed = false;
  const reached = new Set<number>();
  return (state: number, current: number, duration: number, visible: boolean) => {
    if (!visible || !Number.isFinite(current) || !Number.isFinite(duration) || duration <= 0) return;
    if (state === 1 && !started) { started = true; emit({ name: 'video_start', current, duration }); }
    if (state === 1 && started) for (const percent of [10, 25, 50, 75]) {
      if (current / duration * 100 >= percent && !reached.has(percent)) {
        reached.add(percent); emit({ name: 'video_progress', percent, current, duration });
      }
    }
    if (state === 0 && started && !completed) {
      completed = true; emit({ name: 'video_complete', percent: 100, current, duration });
    }
  };
}

type Player = { getPlayerState(): number; getCurrentTime(): number; getDuration(): number; playVideo(): void };
type PlayerEvent = { target: Player; data: number };
type YouTube = { Player: new (frame: HTMLIFrameElement, options: { events: { onReady(event: PlayerEvent): void; onStateChange(event: PlayerEvent): void; onError(): void } }) => Player };
type VideoWindow = Window & { YT?: YouTube; onYouTubeIframeAPIReady?: () => void };
let api: Promise<YouTube> | undefined;
function loadApi(win: VideoWindow, doc: Document): Promise<YouTube> {
  if (win.YT?.Player) return Promise.resolve(win.YT);
  return api ||= new Promise((resolve, reject) => {
    const previous = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => { previous?.(); if (win.YT?.Player) resolve(win.YT); };
    const script = doc.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
    script.onerror = () => { api = undefined; reject(new Error('YouTube API unavailable')); };
    doc.head.appendChild(script);
  });
}

export function initVideo(player: HTMLElement, win: VideoWindow = window, doc: Document = document) {
  const emit = (signal: VideoSignal) => doc.dispatchEvent(new CustomEvent(VIDEO_EVENT, { detail: signal }));
  player.querySelector('button')?.addEventListener('click', () => {
    const frame = doc.createElement('iframe');
    const params = new URLSearchParams({ autoplay: '1', playsinline: '1', enablejsapi: '1', origin: win.location.origin, hl: doc.documentElement.lang });
    frame.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params}`;
    frame.title = 'She Gave Birth to a Dragon | The Mothers Monster — MYTHRA';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(frame); frame.focus(); emit({ name: 'video_load' });
    const report = videoReporter(emit);
    let timer: number | undefined;
    const sample = (p: Player) => report(p.getPlayerState(), p.getCurrentTime(), p.getDuration(), doc.visibilityState === 'visible');
    const stop = () => { if (timer !== undefined) win.clearInterval(timer); timer = undefined; };
    // The frame still works if the optional API script is blocked.
    void loadApi(win, doc).then(YT => {
      new YT.Player(frame, { events: {
        onReady: event => {
          sample(event.target);
          if (event.target.getPlayerState() === 1) timer = win.setInterval(() => sample(event.target), 1000);
          else event.target.playVideo();
        },
        onStateChange: event => {
          stop(); sample(event.target);
          if (event.data === 1) timer = win.setInterval(() => sample(event.target), 1000);
        },
        onError: () => { stop(); emit({ name: 'video_error' }); },
      } });
      win.addEventListener('pagehide', stop, { once: true });
    }).catch(() => emit({ name: 'video_error' }));
  }, { once: true });
}
