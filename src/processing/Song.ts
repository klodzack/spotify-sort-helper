import { IOutputRecord } from "../interfaces/IOutputRecord";
import { WikiSearch } from "../wikipedia/WikiSearch";

export class Song {
    constructor(public title: string, public album: string | null, public artist: string, public extraRecords?: Record<string, string>) {}

    public async getGenres(): Promise<string[] | null> {
        const genred = await WikiSearch.search(this);
        if (genred) return genred.genres;
        return null;
    }

    public async process(): Promise<IOutputRecord> {
        return {
            title: this.title,
            album: this.album,
            artist: this.artist,
            extraRecords: this.extraRecords,
            genres: await this.getGenres(),
        };
    }
}