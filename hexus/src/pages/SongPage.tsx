import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SongPage.css";
import { Song, Line } from "../types/song";

const SongPage = () => {
    const { songId } = useParams<{ songId: string }>();
    const [songTitle, setSongTitle] = useState<string>("");
    const [songAuthor, setSongAuthor] = useState<string>("");
    const [songMelody, setSongMelody] = useState<string>("");
    const [songEvent, setSongEvent] = useState<string>("");
    const [hasMp3, setHasMp3] = useState<boolean>(false);
    const [songContents, setSongContents] = useState<Line[][]>([]);
    const [songComments, setSongComments] = useState<string[]>([]);
    const [youtubeLink, setYoutubeLink] = useState<string>("");
    const [spotifyLink, setSpotifyLink] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongObject = async () => {
            try {
                const response = await fetch(`/songs/${songId}.json`);
                const songObject: Song = await response.json();
                setSongTitle(songObject.meta.title);
                setSongContents(songObject.contents);
                setSongAuthor(songObject.meta.author);
                setSongMelody(songObject.meta.melody);
                setSongEvent(songObject.meta.event);
                setSongComments(songObject.meta.comments);
                setYoutubeLink(songObject.meta.youtube_link);
                setSpotifyLink(songObject.meta.spotify_link);
                setLoading(false);
                document.title = songObject.meta.title;
            } catch (error) {
                console.log("Error fetching song object:", error);
            }
        };

        const checkMp3FileExists = async () => {
            try {
                const res = await fetch(`/public/mp3/${songId}.mp3`, {
                    method: "HEAD",
                });
                const contentType = res.headers.get("Content-Type");
                if (res.ok && contentType && contentType.startsWith("audio/")) {
                    setHasMp3(true);
                }
            } catch {
                setHasMp3(false);
            }
        };
        fetchSongObject();
        checkMp3FileExists();
    }, [songId]);

    const renderStreamingLinks = () => {
        if (youtubeLink && spotifyLink) {
            return (
                <span>
                    {"("}
                    <a
                        href={youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        YouTube
                    </a>
                    {" | "}
                    <a
                        href={spotifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Spotify
                    </a>
                    {")"}
                </span>
            );
        } else if (youtubeLink) {
            return (
                <span>
                    {"("}
                    <a
                        href={youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        YouTube
                    </a>
                    {")"}
                </span>
            );
        } else if (spotifyLink) {
            return (
                <span>
                    {"("}
                    <a
                        href={spotifyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Spotify
                    </a>
                    {")"}
                </span>
            );
        }
        return null;
    };

    return (
        <>
            {loading ? (
                <p className="centered-on-page">Loading...</p>
            ) : (
                <div className="song-page">
                    <section className="song-metadata">
                        <h1 className="song-title">{songTitle}</h1>
                        <h5>Tekst: {songAuthor}</h5>
                        <h5>Melodi: {songMelody}</h5>
                        <h5>Arrangement: {songEvent}</h5>
                        {renderStreamingLinks()}
                    </section>
                    {hasMp3 && (
                        <audio controls>
                            <source
                                src={`/public/mp3/${songId}.mp3`}
                                type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                    <section className="lyrics-wrapper">
                        {songContents.map((section, index) => (
                            <p key={index}>
                                {section.map((line, lineIndex) => (
                                    <span key={lineIndex} className={line.type}>
                                        {line.text}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        ))}
                    </section>
                    <section className="comments-wrapper">
                        {songComments.map((commentText) => (
                            <p>
                                {commentText}
                                <br />
                            </p>
                        ))}
                    </section>
                </div>
            )}
        </>
    );
};
export default SongPage;
