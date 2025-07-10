import type { Song } from "../types/song";

export type SortMethod =
    | "title asc"
    | "title desc"
    | "year asc"
    | "year desc"
    | "page asc"
    | "page desc";

export const sortSongs = (songs: Song[], method: SortMethod) => {
    const sortedSongs = [...songs];
    switch (method) {
        case "title asc":
            return sortedSongs.sort((a, b) =>
                a.meta.title.localeCompare(b.meta.title, "nb")
            );
        case "title desc":
            return sortedSongs.sort((a, b) =>
                b.meta.title.localeCompare(a.meta.title, "nb")
            );
        case "year asc":
            return sortedSongs.sort((a, b) => a.meta.year - b.meta.year);
        case "year desc":
            return sortedSongs.sort((a, b) => b.meta.year - a.meta.year);
        case "page asc":
            return sortedSongs.sort(
                (a, b) => a.meta.start_page - b.meta.start_page
            );
        case "page desc":
            return sortedSongs.sort(
                (a, b) => b.meta.start_page - a.meta.start_page
            );
        default:
            return sortedSongs;
    }
};
