import wikipedia from "wikipedia";
import { fuzzy } from 'fast-fuzzy';
import { WikiSong } from "./WikiSong";
import { select, Separator } from '@inquirer/prompts';
import { Song } from "./Song";
import { WikiArtist } from "./WikiArtist";
import { WikiAlbum } from "./WikiAlbum";
import { IGenred } from "./IGenred";

export class WikiSearch {
    private constructor() {}

    static async search(song: Song): Promise<IGenred | null> {
        return await WikiSearch.searchSong(song) ??
            (song.album ? await WikiSearch.searchAlbum(song as Song & { album: string }) : null) ??
            await WikiSearch.searchArtist(song.artist);
    }

    private static async doSearch<T extends IGenred>(
        { query, lookup, matcher, prompter }: {
            query: string,
            lookup: (id: number) => Promise<T | null>,
            matcher: (genred: T) => number,
            prompter: (genred: T) => { name: string, description: string },
        }
    ): Promise<T | null> {
        const searchResult = await wikipedia.search(query, { limit: 30 });
        let results: { genred: T, match: number }[] = [];
        for (const doc of searchResult.results) {
            const genred = await lookup(doc.pageid);
            if (!genred) continue;

            const match = matcher(genred);

            if (match > 0.92) return genred;
            if (match > 0.7)
                results.push({ genred, match });
        }

        if (!results.length) return null;

        // Prompt
        return await select({
            message: `Which of these is ${query}?`,
            choices: [
                ...results.map(result => ({
                    ...(prompter(result.genred)),
                    value: result.genred,
                })),
                new Separator(),
                {
                    name: 'None of these',
                    value: null,
                }   
            ]
        });
    }

    static async searchSong({ title, artist }: Song) {
        return await WikiSearch.doSearch({
            query: `${title} (${artist} song)`,
            async lookup(id) { return await WikiSong.fromWiki(id); },
            matcher: wikiSong => (
                WikiSearch.checkMatch(wikiSong.title, title) +
                // Ignore album
                WikiSearch.checkMatch(wikiSong.artist, artist)
            ) / 2,
            prompter: wikiSong => ({
                name: `${wikiSong.title} - ${wikiSong.artist}`,
                description: wikiSong.description,
            }),
        });
    }

    static async searchAlbum({ artist, album }: Song & { album: string }) {
        return await WikiSearch.doSearch({
            query: `${album} (${artist} album)`,
            async lookup(id) { return await WikiAlbum.fromWiki(id); },
            matcher: wikiAlbum => (
                WikiSearch.checkMatch(wikiAlbum.name, album) +
                WikiSearch.checkMatch(wikiAlbum.artist, artist)
            ) / 2,
            prompter: wikiAlbum => ({
                name: `${wikiAlbum.name} - ${wikiAlbum.artist}`,
                description: wikiAlbum.description,
            }),
        });
    }

    static async searchArtist(artist: string) {
        return await WikiSearch.doSearch({
            query: artist,
            async lookup(id) { return await WikiArtist.fromWiki(id); },
            matcher: wikiArtist => WikiSearch.checkMatch(wikiArtist.name, artist),
            prompter: wikiArtist => ({
                name: wikiArtist.name,
                description: wikiArtist.description,
            }),
        });
    }

    private static checkMatch(a: string, b: string): number {
        return Math.max(
            fuzzy(a, b),
            fuzzy(b, a),
        );
    }
}