import type { SortMethod } from "./songSort";

const SORT_KEY = "sortMethod";

export function getStoredSortMethod(): SortMethod | null {
    const value = localStorage.getItem(SORT_KEY);
    return value as SortMethod | null;
}

export function setStoredSortMethod(method: SortMethod) {
    localStorage.setItem(SORT_KEY, method);
}
