import { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Footer } from "./components/Footer";
import { DarkModeButton } from "./components/DarkModeButton";
import useSongs from "./hooks/useSongs";
import { useDarkMode } from "./context/DarkModeContext";
import { Song } from "./types/song";
import { setStoredSortMethod } from "./utils/sortStorage";
import { Line } from "./types/song";

// START EXTRACT
type SortMethod =
    | "title asc"
    | "title desc"
    | "year asc"
    | "year desc"
    | "page asc"
    | "page desc";

const sortSongs = (songs: Song[], method: SortMethod) => {
    switch (method) {
        case "title asc":
            return songs.sort((a, b) =>
                a.meta.title.localeCompare(b.meta.title, "nb")
            );
        case "title desc":
            return songs.sort((a, b) =>
                b.meta.title.localeCompare(a.meta.title, "nb")
            );
        case "year asc":
            return songs.sort((a, b) => a.meta.year - b.meta.year);
        case "year desc":
            return songs.sort((a, b) => b.meta.year - a.meta.year);
        case "page asc":
            return songs.sort((a, b) => a.meta.start_page - b.meta.start_page);
        case "page desc":
            return songs.sort((a, b) => b.meta.start_page - a.meta.start_page);
        default:
            return songs;
    }
};
// END EXTRACT

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [textSearch, setTextSearch] = useState(true);
    const [currentSort, setCurrentSort] = useState("title asc");
    const { darkMode } = useDarkMode();
    const { songs, loading } = useSongs();
    const [sortedSongs, setSortedSongs] = useState<Song[]>([]);

    // Load song objects from each song files. Path: ../public/songs/{songId}.json
    useEffect(() => {
        document.title = "HEXUS";

        const handleBeforeUnload = () => {
            localStorage.removeItem("songs");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        const savedSortMethod = localStorage.getItem("sortMethod");
        if (savedSortMethod) {
            setCurrentSort(savedSortMethod);
        } else {
            setCurrentSort("title asc");
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (songs.length > 0) {
            const sorted = sortSongs([...songs], currentSort as SortMethod);
            setSortedSongs(sorted);
        }
    }, [songs, currentSort]);

    const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTextSearchToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setTextSearch(e.target.checked);
    };
    /*
    const updateSort = (newSort: SortMethod) => {
        setCurrentSort(newSort);
        localStorage.setItem("sortMethod", newSort);
        const sortedSongs = sortSongs([...songs], newSort);
        setSongs(sortedSongs);
        setSortedSongs(() => sortedSongs);
        console.log(sortedSongs);
    };
*/
    const handleHeaderToggle = (headerText: string) => {
        let newSort: SortMethod;
        switch (headerText) {
            case "Tittel":
                if (currentSort === "title asc") {
                    newSort = "title desc";
                } else {
                    newSort = "title asc";
                }
                break;
            case "År":
                if (currentSort === "year asc") {
                    newSort = "year desc";
                } else {
                    newSort = "year asc";
                }
                break;
            case "Side":
                if (currentSort === "page asc") {
                    newSort = "page desc";
                } else {
                    newSort = "page asc";
                }
                break;
            default:
                newSort = "title asc"; // Default sort if no match
                break;
        }
        setCurrentSort(newSort);
        setStoredSortMethod(newSort);
    };
    /*
    const handleSortTitleToggle = () => {
        updateSort(currentSort === "title asc" ? "title desc" : "title asc");
    };
    const handleSortYearToggle = () => {
        updateSort(currentSort === "year asc" ? "year desc" : "year asc");
    };
    const handleSortPageToggle = () => {
        updateSort(currentSort === "page asc" ? "page desc" : "page asc");
    };
*/
    const flattenSongText = (song: Song): string => {
        // const verses = song.contents;
        // const flattenedLines = verses
        //     .flat(Infinity)
        //     .filter(
        //         (line): line is Line =>
        //             !Array.isArray(line) &&
        //             typeof line === "object" &&
        //             "text" in line
        //     )
        //     .map((line) => line.text)
        //     .filter(Boolean);
        // return flattenedLines.join(" ");
        return song.contents
            .flat()
            .map((line: Line) => line.text)
            .filter(Boolean)
            .join(" ");
    };

    const filteredSongs = sortedSongs.filter((song) => {
        const fullLyricsString = flattenSongText(song);
        const matchingTitles = song.meta.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchingLyrics = fullLyricsString
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchingTitles || (textSearch && matchingLyrics);
    });

    return (
        <div className="centered">
            <h1>HEXUS</h1>
            <DarkModeButton />
            <section>
                <label htmlFor="searchField">Søk: </label>
                <input type="text" id="searchField" onChange={handleUpdate} />
                <input
                    type="checkbox"
                    id="lyricsCheckbox"
                    checked={textSearch}
                    onChange={handleTextSearchToggle}
                />
                <label htmlFor="lyricsCheckbox">Tekstsøk</label>
            </section>
            {loading ? (
                <p>Loading...</p>
            ) : filteredSongs.length > 0 ? (
                <section className="content-area centered">
                    <table className={`${darkMode}`}>
                        <thead>
                            <tr>
                                <th
                                    onClick={() => {
                                        handleHeaderToggle("Tittel");
                                    }}
                                >
                                    Tittel
                                </th>
                                <th
                                    onClick={() => {
                                        handleHeaderToggle("År");
                                    }}
                                >
                                    År
                                </th>
                                <th
                                    onClick={() => {
                                        handleHeaderToggle("Side");
                                    }}
                                >
                                    Side
                                </th>
                                <th>Tekst</th>
                                <th>Melodi</th>
                                <th>Arrangement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSongs.map((song) => (
                                <tr key={song.meta.id}>
                                    <td>
                                        <Link
                                            to={`/songs/${song.meta.id}`}
                                            onClick={() =>
                                                window.scrollTo(0, 0)
                                            }
                                        >
                                            {song.meta.title}
                                        </Link>
                                    </td>
                                    <td>{song.meta.year}</td>
                                    <td>{song.meta.start_page}</td>
                                    <td>{song.meta.author}</td>
                                    <td>{song.meta.melody}</td>
                                    <td>{song.meta.event}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <p className="content-area no-matches">Ingen treff</p>
            )}
            <Footer />
        </div>
    );
};

export default App;
