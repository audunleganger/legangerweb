import { useState, useEffect } from "react";
import Song from "../types/song";
// Load song objects from each song files. Path: ../public/songs/{songId}.json
const useSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            // Try to fetch songs from localstorage first
            try {
                const cachedSongs = localStorage.getItem("songs");
                let songObjects: Song[];
                if (cachedSongs) {
                    songObjects = JSON.parse(cachedSongs);
                } else {
                    // Fetch song ids from songs-metadata.json
                    const response = await fetch("/songs-metadata.json");
                    const songIds = await response.json();

                    // Load song objects from each line in songIds
                    songObjects = await Promise.all(
                        songIds.map(async (songId: string) => {
                            const response = await fetch(
                                `/songs/${songId}.json`
                            );
                            const songObject = await response.json();
                            return songObject;
                        })
                    );
                }
                songObjects.sort((a, b) =>
                    a.meta.title.localeCompare(b.meta.title, "nb")
                );
                localStorage.setItem("songs", JSON.stringify(songObjects));
                songObjects.sort((a, b) =>
                    a.meta.title.localeCompare(b.meta.title, "nb")
                );
                setSongs(songObjects);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching song objects:", error);
            }
        };
        fetchSongs();
    }, []);
    return { songs, setSongs, loading };
};

export default useSongs;
