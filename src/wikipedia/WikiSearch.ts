import wikipedia from "wikipedia";
import { fuzzy } from 'fast-fuzzy';
import { WikiSong } from "./WikiSong";
import { select, Separator } from '@inquirer/prompts';
import { Song } from "../processing/Song";
import { WikiArtist } from "./WikiArtist";
import { WikiAlbum } from "./WikiAlbum";
import { IGenred } from "../interfaces/IGenred";
import { WikiBottleneck } from "../bottlenecks/WikiBottleneck";
import { ConsoleBottleneck, consoleBottleneckLog } from "../bottlenecks/ConsoleBottleneck";
import { Console } from "console";

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
        const searchResult = await WikiBottleneck.schedule(async () => {
            consoleBottleneckLog(`Searching Wikipedia for ${JSON.stringify(query)}`);
            return await wikipedia.search(query, { limit: 30 });
        });
        let results: { genred: T, match: number }[] = [];

        // Do the first two sequentially, return immediately if we find a perfect match
        for (const doc of searchResult.results.slice(0, 2)) {
            const genred = await lookup(doc.pageid);
            if (!genred) continue;

            const match = matcher(genred);

            if (match > 0.92) return genred;
            if (match > 0.7)
                results.push({ genred, match });
        }

        // Not in first two? Request the rest in parallel
        await Promise.all(
            searchResult.results.slice(2).map(async doc => {
                const genred = await lookup(doc.pageid);
                if (!genred) return;

                const match = matcher(genred);
                if (match > 0.7)
                    results.push({ genred, match });
            })
        );

        if (!results.length) return null;

        // Sort by match
        results = results.sort((a, b) => b.match - a.match);
        // If the best is above 0.92, return it
        if (results[0].match > 0.92) return results[0].genred;

        // Prompt
        return await ConsoleBottleneck.schedule(() => select({
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
        }));
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