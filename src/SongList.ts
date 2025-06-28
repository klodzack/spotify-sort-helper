import { Song } from "./Song";

export interface GenresResult {
    genres: Array<{
        genre: string;
        songs: Song[];
    }>;
    unknownSongs: Song[];
}

export class SongList {
    constructor(public songs: Song[]) {}

    async getGenres(): Promise<GenresResult> {
        const genres = new Map<string, Song[]>();
        const unknownSongs: Song[] = [];

        for (const song of this.songs) {
            console.log(`Looking up ${song.title} by ${song.artist}...`);
            const songGenres = await song.getGenres();
            if (!songGenres) {
                unknownSongs.push(song);
                continue;
            }

            for (const genre of songGenres) {
                if (genres.has(genre)) {
                    genres.get(genre)!.push(song);
                } else {
                    genres.set(genre, [song]);
                }
            }
        }

        return {
            genres: Array.from(genres.entries()).map(([genre, songs]) => ({ genre, songs })),
            unknownSongs,
        };
    }
}