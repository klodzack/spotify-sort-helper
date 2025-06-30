import { createReadStream } from 'node:fs';
import stream from 'node:stream';
import { Song } from "./Song";
import csv from 'csv-parser';

export interface GenresResult {
    genres: Array<{
        genre: string;
        songs: Song[];
    }>;
    unknownSongs: Song[];
}

export class SongList {
    private constructor(public songs: Song[]) {}

    async getGenres(): Promise<GenresResult> {
        const genres = new Map<string, Song[]>();
        const unknownSongs: Song[] = [];

        const results = await Promise.all(this.songs.map(async song => ({
            song,
            genres: await song.getGenres()
        })));
        for (const { song, genres: songGenres } of results) {
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

    static async fromCsvFile(file: URL): Promise<SongList> {
        // Read the file
        const stream = createReadStream(file);
        try {
            return await this.fromCsvStream(stream);
        } finally {
            stream.close();
        }
    }
    static async fromCsvStream(stream: stream.Readable): Promise<SongList> {
        let songs: Song[] = [];
        let line = -1;
        await new Promise<void>((resolve, reject) => {
            stream.pipe(csv())
                .on('data', d => {
                    line++;
                    if (!d.Title) { console.log(`Line ${line} missing Title`); }
                    if (!d.Artist) { console.log(`Line ${line} missing Artist`); }
                    songs.push(new Song(d.Title, d.Album || null, d.Artist));
                })
                .on('error', reject)
                .on('end', resolve);
        });
        return this.fromSongs(songs);
    }

    static async fromSongs(songs: Song[]): Promise<SongList> {
        return new SongList(songs);
    }
}