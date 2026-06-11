export function transformFieldInArray<T extends object,
   V = unknown,
   R = unknown
>(array: T[], pathString: string , mapperFn: (value: V, rootRecord: T) => R): T[] {
    if (!Array.isArray(array)) return [];

    const keys = pathString.split(".");

    const transformDeep = (obj: Record<string, unknown> | unknown, keyIndex: number, rootItem: T): unknown => {
        if (!obj || typeof obj !== "object") return obj;
        const currentObj = obj as Record<string, unknown>;
        const currentkey = keys[keyIndex];

        if (keyIndex === keys.length - 1) {
            return { ...currentObj, [currentkey]: mapperFn(currentObj[currentkey] as V, rootItem)};
        }

        return {
            ...currentObj,
            [currentkey]: transformDeep(currentObj[currentkey], keyIndex + 1, rootItem)
        };
    };

    return array.map(item => transformDeep(item, 0, item)) as T[];
}