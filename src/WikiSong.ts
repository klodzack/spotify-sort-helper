import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';
import { getInfoboxGenres } from './WikiHelpers';
import { IGenred } from './IGenred';

const wikiSongCache = new Map<string | number, WikiSong | null>();

export class WikiSong implements IGenred {
    private constructor(
        public readonly wikiId: string | number,
        public readonly title: string,
        public readonly description: string,
        public readonly artist: string,
        public readonly genres: string[],
    ) {
        wikiSongCache.set(wikiId, this);
    }

    static async fromWiki(id: string | number) {
        const cached = wikiSongCache.get(id);
        if (cached) return cached;

        const doc = await wikipedia.fetch(id);
        if (!doc) return null;

        const description = doc.description();
        if (!description) return null;

        const [ infobox ] = doc.infoboxes();
        if (!infobox) return null;

        const title = (infobox.get('name') as Sentence | null)?.text() ?? doc.title();

        const artist = (infobox.get('artist') as Sentence | null)?.text();
        if (!artist) return null;

        const genresList = getInfoboxGenres(infobox);
        if (!genresList) return null;

        return new WikiSong(
            id,
            title,
            description,
            artist,
            genresList,
        );
    }
}