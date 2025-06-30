import { createReadStream } from "node:fs";
import { ISongInput } from "./ISongInput";
import csv from 'csv-parser';
import { Song } from "../processing/Song";

export class CsvInput implements ISongInput {
    constructor(private file: URL) {}

    async *read() {
        const readSteam = createReadStream(this.file);
        try {
            let line = 0;
            for await (const row of readSteam.pipe(csv())) {
                line++; // This will make the first row line 1 - that's ok, line 0 is the header
                // Lowercase all the keys
                const lowerLine = Object.fromEntries(
                    Array.from(Object.entries(row))
                        .map(([ key, value ]) => [key.toLocaleLowerCase(), value as string] as [string, string]));
                if (!lowerLine.title) throw new Error('Missing Title column!');
                if (!lowerLine.artist) throw new Error('Missing Artist column!');
                yield new Song(lowerLine.title, lowerLine.album ?? null, lowerLine.artist);
            }
        } finally {
            readSteam.close();
        }
    }
}