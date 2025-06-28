import wikipedia from "wikipedia";
import { fuzzy } from 'fast-fuzzy';
import { WikiSong } from "./WikiSong";
import { select, Separator } from '@inquirer/prompts';
import { Song } from "./Song";
import { WikiArtist } from "./WikiArtist";

export class WikiSearch {
    private constructor() {}

    static async search(song: Song): Promise<WikiSong | WikiArtist | null> {
        return await WikiSearch.searchSong(song) ??
            await WikiSearch.searchArtist(song.artist);
    }

    static async searchSong({ title, artist }: Song) {
        const searchResult = await wikipedia.search(`${title} (${artist} song)`, { limit: 30 });
        let songs: { song: WikiSong, match: number }[] = [];
        for (const doc of searchResult.results) {
            const song = await WikiSong.fromWiki(doc.pageid);
            if (!song) continue;

            const match = (WikiSearch.checkMatch(song.title, title) +
                       WikiSearch.checkMatch(song.artist, artist))/2;

            if (match > 0.92) return song;
            if (match > 0.7)
                songs.push({ song, match });
        }

        if (!songs.length) return null;
        return WikiSearch.promptSongList(songs.map(s => s.song));
    }

    static async searchArtist(artist: string) {
        const searchResult = await wikipedia.search(`${artist}`, { limit: 30 });
        let artists: { artist: WikiArtist, match: number }[] = [];
        for (const doc of searchResult.results) {
            const wikiArtist = await WikiArtist.fromWiki(doc.pageid);
            if (!wikiArtist) continue;

            const match = WikiSearch.checkMatch(wikiArtist.name, artist);

            if (match > 0.92) return wikiArtist;
            if (match > 0.7)
                artists.push({ artist: wikiArtist, match });
        }
        if (!artists.length) return null;
        return WikiSearch.promptArtistList(artists.map(s => s.artist));
    }

    private static checkMatch(a: string, b: string): number {
        return Math.max(
            fuzzy(a, b),
            fuzzy(b, a),
        );
    }

    private static async promptSongList(songs: WikiSong[]) {
        return await select({
            message: 'Which of these songs do you mean?',
            choices: [
                ...songs.map(song => ({
                    name: `${song.title} - ${song.artist}`,
                    description: song.description,
                    value: song,
                })),
                new Separator(),
                {
                    name: 'None of these',
                    value: null,
                }   
            ]
        });
    }

    private static async promptArtistList(artists: WikiArtist[]) {
        return await select({
            message: 'Which of these songs do you mean?',
            choices: [
                ...artists.map(artist => ({
                    name: artist.name,
                    description: artist.description,
                    value: artist,
                })),
                new Separator(),
                {
                    name: 'None of these',
                    value: null,
                }   
            ]
        });
    }
}