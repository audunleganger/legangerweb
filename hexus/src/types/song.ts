export interface Line {
    type: string;
    text: string;
}

export interface Song {
    meta: {
        id: string;
        title: string;
        author: string;
        melody: string;
        event: string;
        year: number;
        mp3: string;
        comments: string[];
        start_page: number;
        end_page: number;
        youtube_link: string;
        spotify_link: string;
    };
    contents: Line[][];
}

export default Song;
