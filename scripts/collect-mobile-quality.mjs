import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const config = JSON.parse(fs.readFileSync('lighthouserc.json', 'utf8'));
const root = path.resolve(config.ci.collect.staticDistDir);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer((request, response) => {
  try {
    let file = path.resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400).end();
  }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
fs.mkdirSync('.lighthouseci', { recursive: true });
const cli = path.resolve('tools/lighthouse-ci/node_modules/lighthouse/cli/index.js');
try {
  for (const [index, url] of config.ci.collect.url.entries()) {
    const route = new URL(url).pathname;
    for (let run = 1; run <= config.ci.collect.numberOfRuns; run++) {
      const output = `.lighthouseci/lhr-${index}-${run}`;
      console.log(`Mobile run ${run}/${config.ci.collect.numberOfRuns}: ${route}`);
      const child = spawn(process.execPath, [cli,
        `http://127.0.0.1:${server.address().port}${route}`,
        '--chrome-flags=--headless',
        '--form-factor=mobile', '--throttling-method=simulate',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--output=json', '--output=html', `--output-path=${output}`, '--quiet',
      ], { stdio: 'inherit' });
      const [code] = await once(child, 'exit');
      if (code !== 0) throw new Error(`Lighthouse failed for ${route} run ${run}: ${code}`);
    }
  }
} finally {
  server.close();
}
