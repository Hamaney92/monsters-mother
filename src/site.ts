export const site = { title: "A Monster’s Mother", subtitle: 'A Cradle Made of Embers', author: 'YH', description: 'An illustrated dark fantasy novel by YH about Elara and her dragon child, Ember. Read Chapter One free in English and discover A Cradle Made of Embers.' };
export function path(route = '') { return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${route.replace(/^\//, '')}`; }
export const nav = [['Story', 'story/'], ['World', 'world/'], ['Characters', 'characters/'], ['Lore', 'lore/'], ['Journal', 'blog/'], ['Movie', 'movie/']] as const;
