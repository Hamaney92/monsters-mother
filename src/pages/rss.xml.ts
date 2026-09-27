import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { path } from '../site';
import type { APIContext } from 'astro';
export async function GET(context: APIContext){const posts=(await getCollection('blog',({data})=>!data.draft)).sort((a,b)=>b.data.date.valueOf()-a.data.date.valueOf());return rss({title:'The Ember Journal',description:'On monsters, motherhood and dark fantasy.',site:context.site!,items:posts.map(p=>({title:p.data.title,description:p.data.description,pubDate:p.data.date,link:path(`blog/${p.id}/`)})),customData:'<language>en</language>'});}
