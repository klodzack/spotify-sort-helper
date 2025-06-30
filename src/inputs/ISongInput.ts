import { Song } from "../processing/Song";

export interface ISongInput {
    /** Produce a stream of Song records */
    read(): AsyncGenerator<Song>;
}