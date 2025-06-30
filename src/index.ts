import { CsvInput } from './inputs/CsvInput';
import { CsvOutput } from './outputs/CsvOutput';
import { Processor } from './processing/Processor';

(async () => {
    const processor = new Processor({
        input: new CsvInput(new URL('examples/example.csv', 'file:' + __dirname)),
        output: new CsvOutput(new URL('out.csv', 'file:' + __dirname)),
    });
    await processor.process();
})().catch(e => {
    console.error(e);
    process.exit(1);
});
