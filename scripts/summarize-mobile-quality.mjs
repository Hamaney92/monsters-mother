import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

const config = JSON.parse(fs.readFileSync('lighthouserc.json', 'utf8'));
const folder = '.lighthouseci';
assert(fs.existsSync(folder), 'Lighthouse reports were not created.');
const files = fs.readdirSync(folder).filter(name => /^lhr-.*\.json$/.test(name));
const groups = new Map();
for (const file of files) {
  const report = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
  assert(!report.runtimeError, `${file}: Lighthouse runtime error`);
  assert.equal(report.configSettings.formFactor, 'mobile');
  const route = new URL(report.finalUrl).pathname;
  const rows = groups.get(route) ?? [];
  rows.push(report);
  groups.set(route, rows);
}
const routes = config.ci.collect.url.map(url => new URL(url).pathname);
assert.equal(groups.size, routes.length, 'Missing or unexpected tested routes');
const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
const lines = [
  '## Mobile laboratory checks',
  '',
  'Production build served locally on an isolated runner, three simulated mobile runs per page. These are not field Core Web Vitals, Google indexing results, visitor counts or sales.',
  '',
  '| Page | Performance | Accessibility | Best practices | SEO | LCP (ms) | CLS | TBT (ms) |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
];
const failures = [];
for (const route of routes) {
  const reports = groups.get(route);
  assert.equal(reports?.length, config.ci.collect.numberOfRuns, `${route}: incomplete runs`);
  const scores = ['performance', 'accessibility', 'best-practices', 'seo'].map(category =>
    Math.round(median(reports.map(report => report.categories[category].score)) * 100));
  const metrics = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time'].map(metric =>
    median(reports.map(report => report.audits[metric].numericValue)));
  lines.push(`| ${route} | ${scores.join(' | ')} | ${Math.round(metrics[0])} | ${metrics[1].toFixed(3)} | ${Math.round(metrics[2])} |`);
  for (const [id, [level, budget]] of Object.entries(config.ci.assert.assertions)) {
    assert.equal(budget.aggregationMethod, 'median');
    assert.equal(level, 'error');
    const category = id.startsWith('categories:') ? id.slice('categories:'.length) : null;
    const actual = median(reports.map(report => category ? report.categories[category].score : report.audits[id].numericValue));
    if ((budget.minScore !== undefined && actual < budget.minScore) ||
        (budget.maxNumericValue !== undefined && actual > budget.maxNumericValue)) failures.push(`${route} ${id}: ${actual}`);
  }
}
const summary = `${lines.join('\n')}\n`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
assert.equal(failures.length, 0, `Mobile quality budget failures:\n${failures.join('\n')}`);
