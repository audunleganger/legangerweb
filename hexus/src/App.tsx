import { ChangeEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { Footer } from "./components/Footer";
import { DarkModeButton } from "./components/DarkModeButton";
import useSongs from "./hooks/useSongs";
import { useDarkMode } from "./context/DarkModeContext";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [titleSearch, setTitleSearch] = useState(true);
    const [textSearch, setTextSearch] = useState(false);
    const [currentSort, setCurrentSort] = useState("title asc");
    const { darkMode } = useDarkMode();
    const { songs, setSongs, loading } = useSongs();

    // Load song objects from each song files. Path: ../public/songs/{songId}.json
    useEffect(() => {
        document.title = "Hexus";

        const handleBeforeUnload = () => {
            localStorage.removeItem("songs");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTitleSearchToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleSearch(e.target.checked);
    };

    const handleTextSearchToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setTextSearch(e.target.checked);
    };

    const handleSortTitleToggle = () => {
        if (currentSort === "title asc") {
            const sortedSongs = songs.sort((a, b) =>
                b.title.localeCompare(a.title, "nb")
            );
            setSongs(sortedSongs);
            setCurrentSort("title desc");
        } else {
            const sortedSongs = songs.sort((a, b) =>
                a.title.localeCompare(b.title, "nb")
            );
            setSongs(sortedSongs);
            setCurrentSort("title asc");
        }
    };
    const handleSortYearToggle = () => {
        if (currentSort === "year asc") {
            const sortedSongs = songs.sort((a, b) => b.year - a.year);
            setSongs(sortedSongs);
            setCurrentSort("year desc");
        } else {
            const sortedSongs = songs.sort((a, b) => a.year - b.year);
            setSongs(sortedSongs);
            setCurrentSort("year asc");
        }
    };
    const handleSortPageToggle = () => {
        if (currentSort === "page asc") {
            const sortedSongs = songs.sort(
                (a, b) => b.start_page - a.start_page
            );
            setSongs(sortedSongs);
            setCurrentSort("page desc");
        } else {
            const sortedSongs = songs.sort(
                (a, b) => a.start_page - b.start_page
            );
            setSongs(sortedSongs);
            setCurrentSort("page asc");
        }
    };

    const filteredSongs = songs.filter((song) => {
        const fullLyricsString = textSearch
            ? song.lyrics.flat(Infinity).join(" ")
            : "";
        const matchingTitles = song.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchingLyrics = fullLyricsString
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return (
            (titleSearch && matchingTitles) || (textSearch && matchingLyrics)
        );
    });

    return (
        <div className="centered">
            <h1>Hexus</h1>
            <DarkModeButton />
            <section>
                <label htmlFor="searchField">Søk: </label>
                <input type="text" id="searchField" onChange={handleUpdate} />
                <input
                    type="checkbox"
                    id="titleCheckbox"
                    checked={titleSearch}
                    onChange={handleTitleSearchToggle}
                />
                <label htmlFor="titleCheckbox">Tittelsøk</label>
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
                <section className="centered">
                    <table className={`${darkMode}`}>
                        <thead>
                            <tr>
                                <th onClick={handleSortTitleToggle}>Tittel</th>
                                <th onClick={handleSortYearToggle}>År</th>
                                <th onClick={handleSortPageToggle}>Side</th>
                                <th>Forfatter</th>
                                <th>Melodi</th>
                                <th>Arrangement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSongs.map((song) => (
                                <tr key={song.id}>
                                    <td>
                                        <Link to={`/songs/${song.id}`}>
                                            {song.title}
                                        </Link>
                                    </td>
                                    <td>{song.year}</td>
                                    <td>{song.start_page}</td>
                                    <td>{song.author}</td>
                                    <td>{song.melody}</td>
                                    <td>{song.event}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <p className="no-matches">Ingen treff</p>
            )}
            <Footer />
        </div>
    );
};

export default App;
