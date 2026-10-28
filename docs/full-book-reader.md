# Complete Book One reader

The complete 26-chapter English novel is available under `/read/book/`. Turkish, French and Arabic reading editions use `/tr/read/book/`, `/fr/read/book/` and `/ar/read/book/`. Existing `/read/` excerpt URLs remain accessible.

The English reading data preserves the production manuscript v04 paragraph order. Translations were prepared within Codex, with one assistant per language, without sending the manuscript to Google Translate or another translation provider. They are AI-assisted editions, not independently professionally proofread translations; the reader discloses this. The paid paperback remains English.

Ten corrected production illustrations accompany their narrative anchors in every edition. Paragraph correspondence is checked across all four editions. Translation JSON must have 26 consecutive chapters and the exact original paragraph counts; incomplete editions fail validation.

Reading requires no signup, email address, analytics consent or third-party scripts. The optional “remember my chapter” checkbox stores only a validated language, chapter number and expiry on that device, for at most 180 days. Turning it off removes the reading place. Stored values cannot supply a free-text destination URL.

The `chapter_scroll` event records actual viewport scroll milestones (25/50/75/100), only with current analytics consent and on the production origin. It does not prove that text was read, set engagement duration or fabricate activity. `chapter_click` measures navigation only. No advertising was activated by this change.

Validation: `node --experimental-strip-types --test scripts/analytics.test.mjs scripts/video.test.mjs scripts/reader.test.mjs`, Astro check/build, existing site verifiers and `node scripts/verify-full-reader.mjs`. Mobile and RTL browser checks supplement structural tests. Future improvements in reading time require actual post-release Analytics data, not a promised outcome.
