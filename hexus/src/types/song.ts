interface Song {
  id: string;
  title: string;
  author: string;
  melody: string;
  event: string;
  year: number;
  lyrics: string[];
  comments: string[];
  start_page: number;
  end_page: number;
  mp3: string;
}

export default Song;