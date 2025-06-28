import { Infobox, Sentence } from "wtf_wikipedia";

export function getInfoboxGenres(infobox: Infobox): string[] | null {
    const genresText = (infobox.get('genre') as Sentence | null)?.text();
    if (!genresText) return null;
    const genresList = genresText.split(/\s*[\n,·]\s*/).map(raw => {
        let line = raw.trim().toLocaleLowerCase();
        if (!line.length) return null; // skip empty lines
        if (line.startsWith('*')) line = line.slice(1).trim();
        return line.replace(/([ -_]|^)./g, c => c.toUpperCase()); // Capitalize first letter of each word
    }).filter(a => a !== null).slice(0,5);
    if (!genresList.length) return null;
    return genresList;
}