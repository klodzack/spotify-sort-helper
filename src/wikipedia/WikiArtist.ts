import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';
import { getInfoboxGenres } from './WikiHelpers';
import { IGenred } from '../interfaces/IGenred';
import { WikiBottleneck } from '../bottlenecks/WikiBottleneck';

const wikiArtistCache = new Map<string | number, WikiArtist | null>();

export class WikiArtist implements IGenred {
    private constructor(
        public readonly wikiId: string | number,
        public readonly name: string,
        public readonly description: string,
        public readonly genres: string[],
    ) {
        wikiArtistCache.set(wikiId, this);
    }

    static async fromWiki(id: string | number) {
        const cached = wikiArtistCache.get(id);
        if (cached) return cached;

        const doc = await WikiBottleneck.schedule(() => wikipedia.fetch(id));
        if (!doc) return null;

        const description = doc.description();
        if (!description) return null;

        const [ infobox ] = doc.infoboxes();
        if (!infobox) return null;

        const name = (infobox.get('name') as Sentence | null)?.text() ?? doc.title();

        const genresList = getInfoboxGenres(infobox);
        if (!genresList) return null;

        return new WikiArtist(
            id,
            name,
            description,
            genresList,
        );
    }
}