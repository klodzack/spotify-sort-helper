import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';
import { getInfoboxGenres } from './WikiHelpers';
import { IGenred } from './IGenred';

export class WikiAlbum implements IGenred {
    private constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly artist: string,
        public readonly genres: string[],
    ) {}

    static async fromWiki(id: string | number) {
        const doc = await wikipedia.fetch(id);
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
            name,
            description,
            artist,
            genresList,
        );
    }
}