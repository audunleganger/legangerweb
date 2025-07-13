import { useState } from "react";
import useSongs from "../hooks/useSongs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DarkModeButton } from "./DarkModeButton";
import "./Sidebar.css";
import { useDarkMode } from "../context/DarkModeContext";

type SidebarProps = {
    currentSongTitle?: string;
};

const Sidebar = ({ currentSongTitle }: SidebarProps) => {
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
            ></button>
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
                    {filteredSongs.map((song) => {
                        const isCurrentSong =
                            song.meta.title === currentSongTitle;
                        return (
                            <li key={song.meta.id}>
                                <Link
                                    to={
                                        isCurrentSong
                                            ? "#"
                                            : `/songs/${song.meta.id}`
                                    }
                                    onClick={() => {
                                        if (!isCurrentSong) {
                                            setOpen(false);
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    className={
                                        isCurrentSong ? "selected-song" : ""
                                    }
                                >
                                    {song.meta.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
