import { Song } from "../processing/Song";
import { ISongInput } from "./ISongInput";

export class MemoryInput implements ISongInput {
    constructor(private songs: Song[]) {}

    async *read() {
        yield* this.songs;
    }
}