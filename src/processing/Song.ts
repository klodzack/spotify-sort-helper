import { WikiSearch } from "../wikipedia/WikiSearch";

export class Song {
    constructor(public title: string, public album: string | null, public artist: string) {}

    public async getGenres(): Promise<string[] | null> {
        const genred = await WikiSearch.search(this);
        if (genred) return genred.genres;
        return null;
    }
}