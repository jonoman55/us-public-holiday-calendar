export const getEvn = (name: string) => process.env[name] as string;
export const createWikiUrl = (name: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`;
