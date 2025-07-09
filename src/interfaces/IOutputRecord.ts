export interface IOutputRecord {
    title: string;
    album: string | null;
    artist: string;
    extraRecords?: Record<string, string>;
    genres: string[] | null;
}
