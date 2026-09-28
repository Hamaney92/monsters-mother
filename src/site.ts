export const site = { title: "A Monster’s Mother", subtitle: 'A Cradle Made of Embers', author: 'YH', description: 'Enter the world of A Monster’s Mother: A Cradle Made of Embers by YH. Discover the book and explore The Ember Journal.' };
export function path(route = '') { return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${route.replace(/^\//, '')}`; }
export const nav = [['Story', 'story/'], ['World', 'world/'], ['Characters', 'characters/'], ['Lore', 'lore/'], ['Journal', 'blog/'], ['Watch', 'watch/']] as const;
