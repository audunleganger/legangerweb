import { useState } from "react";
import useSongs from "../hooks/useSongs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DarkModeButton } from "./DarkModeButton";
import "./Sidebar.css";
import { useDarkMode } from "../context/DarkModeContext";
// import Song from "../types/song";

const Sidebar = () => {
    const { songs } = useSongs();
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const { darkMode } = useDarkMode();
    // const [sortedSongs, setSortedSongs] = useState<Song[]>([]);
    const navigate = useNavigate();
    const filteredSongs = songs.filter((song) =>
        song.meta.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleHeaderClick = () => {
        navigate("/");
        setOpen(false);
    };
    return (
        <>
            <button
                className={[
                    "sidebar-burger",
                    darkMode ? "dark" : "",
                    open ? "open" : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
            >
                {/* {open ? (
                    <span>&#10005;</span>
                ) : (
                    <span style={{ marginTop: "-1rem" }}>&#9776;</span>
                )} */}
            </button>
            <div
                className={`sidebar ${darkMode ? "dark" : ""} ${
                    open ? "open" : ""
                }`}
            >
                <div className="sidebar-top">
                    <h1 className="sidebar-header" onClick={handleHeaderClick}>
                        HEXUS
                    </h1>
                    <DarkModeButton />
                    <input
                        type="text"
                        placeholder="Søk etter sangtittel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul className="sidebar-list">
                    {filteredSongs.map((song) => (
                        <li key={song.meta.id}>
                            <Link
                                to={`/songs/${song.meta.id}`}
                                onClick={() => {
                                    setOpen(false);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                {song.meta.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
