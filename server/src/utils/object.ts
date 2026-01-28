export function normalizeNullable<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): T {
  keys.forEach(key => {
    if (obj[key] === undefined) obj[key] = null as any;
  });
  return obj;
};
