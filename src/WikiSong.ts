import wikipedia from 'wtf_wikipedia';
import type { Sentence } from 'wtf_wikipedia';

export class WikiSong {
    private constructor(
        public readonly title: string,
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

        const title = (infobox.get('name') as Sentence | null)?.text() ?? doc.title();

        const artist = (infobox.get('artist') as Sentence | null)?.text();
        if (!artist) return null;

        const genresText = (infobox.get('genre') as Sentence | null)?.text();
        if (!genresText) return null;
        const genresList = genresText.split(/\s*[\n,]\s*/).map(raw => {
            let line = raw.trim().toLocaleLowerCase();
            if (!line.length) return null; // skip empty lines
            if (line.startsWith('*')) line = line.slice(1).trim();
            return line.replace(/([ -_]|^)./g, c => c.toUpperCase()); // Capitalize first letter of each word
        }).filter(a => a !== null).slice(0,5);

        return new WikiSong(
            title,
            description,
            artist,
            genresList,
        );
    }
}