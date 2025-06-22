import path from "path";
import fs from "fs";

// 1. Declare folder with songs (song1.json, song2.json etc.).
const songsDir = path.join(__dirname, "..", "public", "songs");

// 2. Declare songMetadata.json output file location
const songsIdsFile = path.join(__dirname, "..", "public", "songs-metadata.json");

// 3. Run throug every file, extract id, title to object
const songIds = fs.readdirSync(songsDir).map((fileName) => {
    const song = JSON.parse(fs.readFileSync(path.join(songsDir, fileName), "utf-8"));
    return song.id
});

// 5. Sort array according to "title attribute"

// 6. Write songMetadata array to songMetadata.json
fs.writeFileSync(songsIdsFile, JSON.stringify(songIds, null, 2));
console.log("Song metadata generated successfully!");