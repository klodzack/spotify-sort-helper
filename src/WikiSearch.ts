import wikipedia from "wikipedia";
import { fuzzy } from 'fast-fuzzy';
import { WikiSong } from "./WikiSong";
import { select, Separator } from '@inquirer/prompts';

export class WikiSearch {
    private constructor() {}

    static async search({ title, artist }: { title: string, artist: string }) {
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
}