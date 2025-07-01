import { CsvInput } from './inputs/CsvInput';
import { MemoryInput } from './inputs/MemoryInput';
import { CsvOutput } from './outputs/CsvOutput';
import { Processor } from './processing/Processor';
import { Song } from './processing/Song';

(async () => {
    const processor = new Processor({
        // input: new CsvInput(new URL('examples/example.csv', 'file:' + __dirname)),
        input: new MemoryInput([ new Song('Please Please Me', 'Please Please Me', 'The Beatles') ]),
        output: new CsvOutput(new URL('out.csv', 'file:' + __dirname)),
    });
    await processor.process();
})().catch(e => {
    console.error(e);
    process.exit(1);
});
