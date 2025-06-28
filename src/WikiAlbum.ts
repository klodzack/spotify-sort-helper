import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';
import { getInfoboxGenres } from './WikiHelpers';
import { IGenred } from './IGenred';
import { WikiBottleneck } from './WikiBottleneck';

const wikiAlbumCache = new Map<string | number, WikiAlbum | null>();

export class WikiAlbum implements IGenred {
    private constructor(
        public readonly wikiId: string | number,
        public readonly name: string,
        public readonly description: string,
        public readonly artist: string,
        public readonly genres: string[],
    ) {
        wikiAlbumCache.set(wikiId, this);
    }

    static async fromWiki(id: string | number) {
        const cached = wikiAlbumCache.get(id);
        if (cached) return cached;

        const doc = await WikiBottleneck.schedule(() => wikipedia.fetch(id));
        if (!doc) return null;

        const description = doc.description();
        if (!description) return null;

        const [ infobox ] = doc.infoboxes();
        if (!infobox) return null;

        const name = (infobox.get('name') as Sentence | null)?.text() ?? doc.title();

        const artist = (infobox.get('artist') as Sentence | null)?.text();
        if (!artist) return null;

        const genresList = getInfoboxGenres(infobox);
        if (!genresList) return null;

        return new WikiAlbum(
            id,
            name,
            description,
            artist,
            genresList,
        );
    }
}