import { WikiSearch } from "./WikiSearch";

export class Song {
    constructor(public title: string, public artist: string) {}

    public async getGenres(): Promise<string[] | null> {
        const wikiSong = await WikiSearch.search({ title: this.title, artist: this.artist });
        if (wikiSong) return wikiSong.genres;
        return null;
    }
}