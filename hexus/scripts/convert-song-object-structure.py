import shutil
import os
import json
from typing import Any, Dict


def make_empty_dir(directory_path: str) -> None:
    """Empty the specified directory."""
    # Create output_dir if it does not exist and ensure it is empty
    os.makedirs(output_dir, exist_ok=True)
    # Remove all files and subdirectories in output_dir
    for filename in os.listdir(output_dir):
        file_path = os.path.join(output_dir, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)


def parse_json_file(file_path: str) -> Dict[dict, Any]:
    """Read the contents of a JSON file and return the parsed data."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


def convert_song_to_new_structure(song: dict) -> dict:
    """Convert the song object to the new structure."""
    new_song = {}
    new_song_verses = []

    for verse in song.get("lyrics", []):
        isChorus = False
        new_verse = []

        for line in verse:
            line_type = "lyric"
            if line.strip().lower().translate(str.maketrans("", "", ".:")) in refr_keywords and len(line) < 10:
                isChorus = True
                line_type = "chorus-header"
                new_verse.append({
                    "type": line_type,
                    "text": "Ref."
                })
                continue

            elif isChorus:
                line_type = "chorus-lyric"

            new_verse.append({
                "type": line_type,
                "text": line
            })
        new_song_verses.append(new_verse)

    new_song_metadata = {
        "id": song.get("id"),
        "title": song.get("title"),
        "author": song.get("author"),
        "melody": song.get("melody"),
        "event": song.get("event"),
        "year": song.get("year"),
        "comments": song.get("comments"),
        "start_page": song.get("start_page"),
        "end_page": song.get("end_page"),
        "youtube_link": song.get("youtube_link", ""),
        "spotify_link": song.get("spotify_link", "")
    }

    new_song["meta"] = new_song_metadata
    new_song["contents"] = new_song_verses
    return new_song


def check_songs_containing_keyword(keywords, input_files):
    songs_containing_keyword = []
    for file_name in input_files:
        file = os.path.join(input_dir, file_name)
        with open(file, 'r', encoding='utf-8') as f:
            song = json.load(f)
        all_lyrics = [line.lower() for verse in song.get("lyrics", []) for line in verse]

        for line in all_lyrics:
            if any(keyword in line for keyword in keywords) and len(line) < 10:
                print(f"Found keyword in {file_name}: {line}")
                songs_containing_keyword.append(file_name)
                break  # Stop checking further lines in this song
    return songs_containing_keyword


def convert_songs():
    make_empty_dir(output_dir)
    for file_name in input_file_names:
        file = os.path.join(input_dir, file_name)
        with open(file, 'r', encoding='utf-8') as f:
            song = json.load(f)

        new_song = convert_song_to_new_structure(song)
        output_file_path = os.path.join(output_dir, file_name)
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(new_song, output_file, ensure_ascii=False, indent=4)


input_dir = "../public/songs_old"
input_file_names = os.listdir(input_dir)
output_dir = "./output"

refr_keywords = ["refreng", "refr", "ref", "ref.", "refr.", "chorus"]
melody_keywords = ["melodi", "melodien", "melodien", "melodiens", "melodier", "melodiene", "(Melodi:"]

# print(check_songs_containing_keyword(refr_keywords, input_file_names))
convert_songs()
