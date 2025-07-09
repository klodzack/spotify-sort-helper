import { createReadStream } from "node:fs";
import { ISongInput } from "./ISongInput";
import csv from 'csv-parser';
import { Song } from "../processing/Song";

export class CsvInput implements ISongInput {
    constructor(private file: URL) {}

    async *read() {
        const readSteam = createReadStream(this.file);
        try {
            for await (const row of readSteam.pipe(csv())) {
                let title: string | undefined = undefined;
                let album: string | undefined = undefined;
                let artist: string | undefined = undefined;
                let extraRecords: Record<string, string> = {};
                for (const [key, value] of Object.entries(row)) {
                    switch(key.toLocaleLowerCase()) {
                        case 'title':
                            title = value as string;
                            break;
                        case 'album':
                            album = value as string;
                            break;
                        case 'artist':
                            artist = value as string;
                            break;
                        default:
                            extraRecords[key] = value as string;
                            break;
                    }
                }

                if (!title) throw new Error('Missing Title column!');
                if (!artist) throw new Error('Missing Artist column!');
                yield new Song(
                    title,
                    album ?? null,
                    artist,
                    extraRecords,
                );
            }
        } finally {
            readSteam.close();
        }
    }
}