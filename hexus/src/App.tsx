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
import { SortMethod, sortSongs } from "./utils/songSort";
// import InstallPrompt from "./components/InstallPrompt";
// import InstallPWA from "./components/InstallPWA";

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

    const flattenSongText = (song: Song): string => {
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
            {/* <InstallPrompt /> */}
            {/* <InstallPWA /> */}
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
