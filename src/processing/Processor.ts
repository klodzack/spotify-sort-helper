import { ISongInput } from "../inputs/ISongInput";
import { IOutputRecord } from "../interfaces/IOutputRecord";
import { ICategorizedOutput } from "../outputs/ICategorizedOutput";

export class Processor {
    private readonly input: ISongInput;
    private readonly output: ICategorizedOutput;

    constructor({ input, output }: { input: ISongInput, output: ICategorizedOutput }) {
        this.input = input;
        this.output = output;
    }

    async process() {
        await this.output.write(this.getOutputRecords());
    }

    private async *getOutputRecords() {
        for await (const song of this.input.read()) {
            yield {
                title: song.title,
                album: song.album,
                artist: song.artist,
                genres: await song.getGenres(),
            } as IOutputRecord;

        }
    }
}