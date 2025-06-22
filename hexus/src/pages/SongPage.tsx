import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SongPage.css";

const SongPage = () => {
    const { songId } = useParams<{ songId: string }>();
    const [songTitle, setSongTitle] = useState<string>("");
    const [songAuthor, setSongAuthor] = useState<string>("");
    const [songMelody, setSongMelody] = useState<string>("");
    const [songEvent, setSongEvent] = useState<string>("");
    const [songMp3, setSongMp3] = useState<string>("");
    const [songLyrics, setSongLyrics] = useState<string[][]>([]);
    const [songComments, setSongComments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongObject = async () => {
            try {
                const response = await fetch(`/songs/${songId}.json`);
                const songObject = await response.json();
                setSongTitle(songObject.title);
                setSongLyrics(songObject.lyrics);
                setSongAuthor(songObject.author);
                setSongMelody(songObject.melody);
                setSongEvent(songObject.event);
                setSongComments(songObject.comments);
                setSongMp3(songObject.mp3);
                setLoading(false);
                document.title = songObject.title;
            }
            catch (error) {
                console.log("Error fetching song object:", error);
            }
        }
        fetchSongObject();
}, [songId]);


    return (
        <>
        {loading ? <p className="centered-on-page">Loading...</p> :
        <div className="song-page">
                <section className="song-metadata">
                <h1 className="song-title">{songTitle}</h1>
                    <h5>Tekst: {songAuthor}</h5>
                    <h5>Melodi: {songMelody}</h5>
                    <h5>Arrangement: {songEvent}</h5>
                </section>
                {songMp3 && (
                    <audio controls>
                        <source src={songMp3} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
                <section className="lyrics-wrapper">
                {songLyrics.map((verse, index) => (
                    <p key={index}>
                        {verse.map((line, lineIndex) => (
                            <span key={lineIndex}>
                                {line}
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
}
        </>
    );
}
export default SongPage;