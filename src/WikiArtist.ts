import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';
import { getInfoboxGenres } from './WikiHelpers';

export class WikiArtist {
    private constructor(
        public readonly name: string,
        public readonly description: string,
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

        const genresList = getInfoboxGenres(infobox);
        if (!genresList) return null;

        return new WikiArtist(
            name,
            description,
            genresList,
        );
    }
}