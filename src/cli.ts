import { select, input as promptInput } from '@inquirer/prompts';
import { CsvInput } from './inputs/CsvInput';
import { MemoryInput } from './inputs/MemoryInput';
import { ConsoleOutput } from './outputs/ConsoleOutput';
import { CsvOutput } from './outputs/CsvOutput';
import { Processor } from './processing/Processor';
import { Song } from './processing/Song';
import { ISongInput } from './inputs/ISongInput';
import { ICategorizedOutput } from './outputs/ICategorizedOutput';

export async function runCli() {


    const inputType = await select({
        message: 'Select input type:',
        choices: [
            { name: 'Manual', value: 'memory' },
            { name: 'CSV File', value: 'csv' },
        ],
    });

    let input: ISongInput;
    switch (inputType) {
        case 'csv': {
            const csvPath = await promptInput({
                message: 'Enter CSV file path:',
                default: 'examples/large-example.csv',
            });
            input = new CsvInput(new URL(csvPath, 'file:' + process.cwd() + '/'));
            break;
        }
        case 'memory': {
            const title = await promptInput({ message: 'Song title:', default: 'Here Comes The Sun' });
            const album = await promptInput({ message: 'Album:', default: 'Abbey Road' });
            const artist = await promptInput({ message: 'Artist:', default: 'The Beatles' });
            input = new MemoryInput([ new Song(title, album, artist) ]);
            break;
        }
        // Add more input types here as needed
        default:
            throw new Error(`Unknown input type: ${inputType}`);
    }

    const outputType = await select({
        message: 'Select output type:',
        choices: [
            { name: 'Console Output', value: 'console' },
            { name: 'CSV Output (choose output file)', value: 'csv' },
        ],
    });

    let output: ICategorizedOutput;
    switch (outputType) {
        case 'csv': {
            const outPath = await promptInput({
                message: 'Enter output CSV file path:',
                default: 'out.csv',
            });
            output = new CsvOutput(new URL(outPath, 'file:' + process.cwd() + '/'));
            break;
        }
        case 'console': {
            output = new ConsoleOutput();
            break;
        }
        // Add more output types here as needed
        default:
            throw new Error(`Unknown output type: ${outputType}`);
    }

    const processor = new Processor({ input, output });
    await processor.process();
}
