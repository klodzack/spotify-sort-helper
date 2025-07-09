import { lookaheadGenerator } from "../helpers/lookaheadGenerator";
import { transformGenerator } from "../helpers/transformGenerator";
import { ISongInput } from "../inputs/ISongInput";
import { ICategorizedOutput } from "../outputs/ICategorizedOutput";

export class Processor {
    private readonly input: ISongInput;
    private readonly output: ICategorizedOutput;

    constructor({ input, output }: { input: ISongInput, output: ICategorizedOutput }) {
        this.input = input;
        this.output = output;
    }

    async process() {
        const readStream = lookaheadGenerator(50, this.input.read());
        const outputStream = lookaheadGenerator(20, transformGenerator(readStream, async (song) => { return await song.process(); }));
        await this.output.write(outputStream);
    }
}