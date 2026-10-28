# Film access and measurement

The shared player loads YouTube only after the explicit Play button. It requests playback immediately; browser autoplay restrictions may still require the native YouTube Play control. Source links remain available if embedding fails. The privacy notice remains visible before loading YouTube.

GA4 events use the existing analytics consent gate and production-origin check. Declined or missing consent sends no video events. Withdrawal stops collection. No fabricated engagement-time or keep-alive events are sent.

| Event | Trigger |
| --- | --- |
| video_load | Explicit Play action inserts the iframe; not proof of playback |
| video_start | YouTube reports actual PLAYING state, once per loaded player |
| video_progress | Visible, playing video reaches 10, 25, 50, 75 percent of its playhead duration, once each |
| video_complete | YouTube reports ENDED after a playback start, once |
| video_error | Player/API error; does not prove the video itself is unavailable |
| youtube_click | Source link to the known YouTube video, not proof of external viewing |

Progress measures playhead position, including seeks, rather than cumulative viewing time. Starts/progress before analytics consent are discarded, not replayed after acceptance. These events do not measure non-consenting viewers, purchases or sales.

The custom implementation is the sole GA4 video sender. Keep enhanced-measurement Video engagement OFF to avoid double counting. The existing Pages and Scroll settings remain unchanged. Fixed title/provider/video URL, validated numeric duration/time/percent, language and canonical source page are the only video fields forwarded. No query strings or user-provided text are forwarded.

Checks: node --experimental-strip-types --test scripts/analytics.test.mjs scripts/video.test.mjs. Live acceptance requires an actual play and confirmation in GA4 Realtime/DebugView; a dataLayer entry alone proves dispatch, not receipt. Compare only equivalent post-release windows; historical missing video events cannot be reconstructed.
