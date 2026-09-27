import type { APIContext } from 'astro';
import { path } from '../site';
export function GET({site}: APIContext){return new Response(site?.hostname==='example.com' ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${new URL(path('sitemap-index.xml'),site).href}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
