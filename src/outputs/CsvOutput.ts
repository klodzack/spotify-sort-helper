import fsP from 'node:fs/promises';
import fsI from 'node:fs';
import { tmpdir } from 'node:os';
import { ICategorizedOutput } from './ICategorizedOutput';
import { IOutputRecord } from '../interfaces/IOutputRecord';
import { randomUUID } from 'node:crypto';

const fs = Object.assign({}, fsI, fsP);

export class CsvOutput implements ICategorizedOutput {
    private tmpFilePath = new URL(`file:${tmpdir()}/${randomUUID()}/tmp.ndjson`);

    constructor(private readonly filePath: URL) {}

    async write(
        steam: AsyncIterable<IOutputRecord>,
        cancelToken?: AbortSignal
    ) {
        try {
            const genres = await this.streamIntoTmpFile(steam, cancelToken);
            await this.writeOutputFile(genres, this.streamOutOfTmpFile());
        } finally {
            await this.clearTmp();
        }
    }

    private async streamIntoTmpFile(
        steam: AsyncIterable<IOutputRecord>,
        cancelToken?: AbortSignal
    ): Promise<string[]> {
        // First pass: collect genre list and put records into a tmp file
        const genres = new Set<string>();
        await fs.mkdir(new URL('.', this.tmpFilePath));
        const tmpFileHandle = await fs.createWriteStream(this.tmpFilePath);
        try {
            for await (const record of steam) {
                if (cancelToken?.aborted) {
                    throw new Error('Operation cancelled');
                }
                // Collect genres
                if (record.genres) {
                    for (const genre of record.genres) {
                        genres.add(genre);
                    }
                }
                // Write record to tmp file
                await tmpFileHandle.write(JSON.stringify(record) + '\n');
            }
        } finally {
            await tmpFileHandle?.close();
        }

        return Array.from(genres).sort();
    }

    private async *streamOutOfTmpFile(): AsyncIterable<IOutputRecord> {
        const readStream = fs.createReadStream(this.tmpFilePath, { encoding: 'utf8' });
        let buff = '';
        for await (const chunk of readStream) {
            buff += chunk;
            let lines = buff.split('\n');
            buff = lines.pop() || ''; // Keep the last incomplete line
            for (const line of lines) {
                if (line.trim()) {
                    yield JSON.parse(line) as IOutputRecord;
                }
            }
        }
        if (buff.length) {
            for (const line of buff.split('\n')) {
                if (line.trim()) {
                    yield JSON.parse(line) as IOutputRecord;
                }
            }
        }
    }

    private async writeOutputFile(genres: string[], stream: AsyncIterable<IOutputRecord>) {
        const fileHandle = await fs.createWriteStream(this.filePath);
        try {
            // Write headers
            fileHandle.write('Title,Album,Artist,Err');
            for (const genre of genres) {
                fileHandle.write(',' + this.csvEncode(genre));
            }
            fileHandle.write('\n');
            for await (const record of stream) {
                const recordGenres = new Set<string>();
                for (const genre of record.genres ?? []) {
                    recordGenres.add(genre);
                }

                fileHandle.write(this.csvEncode(record.title));
                fileHandle.write(',');
                if (record.album) fileHandle.write(this.csvEncode(record.album));
                fileHandle.write(',');
                fileHandle.write(this.csvEncode(record.artist));
                fileHandle.write(',');
                if (recordGenres === null) fileHandle.write('"!"');

                for (const genre of genres) {
                    fileHandle.write(',');
                    if (recordGenres.has(genre)) fileHandle.write('1');
                }
                fileHandle.write('\n');
            }
        } finally {
            await fileHandle.close();
        }
    }

    private async clearTmp() {
        await fs.rm(new URL('.', this.tmpFilePath), { recursive: true });
    }

    private csvEncode(cell: string) {
        // If a cell doesn't need quoting, return unchanged
        if (/^[a-zA-Z0-9_\- ]*$/.test(cell)) return cell;
        return '"' + cell.replaceAll('"', '""') + '"';
    }

    /*
    async write(
        stream: AsyncIterable<IOutputRecord>,
        cancelToken?: AbortSignal
    ): Promise<void> {
        let fileHandle = await fs.open(this.filePath, "w");

        try {
            const genres = new Map<string, number>();

            for await (const record of stream) {
                let row = [
                    JSON.stringify(record.title),
                    record.album ? JSON.stringify(record.album) : '',
                    JSON.stringify(record.artist),
                ].join(',');
                const genreIndices: number[] = [];
                let needRewrite = false;
                for (const genre of record.genres ?? []) {
                    const genreIndex = genres.get(genre);
                    if (genreIndex === undefined) {
                        // New genre, add it to the map
                        const newIndex = genres.size;
                        genres.set(genre, newIndex);
                        genreIndices.push(newIndex);
                        needRewrite = true;
                    } else {
                        // Existing genre, just add its index
                        genreIndices.push(genreIndex);
                    }
                }
                let idx = 0;
                for (const genreIndex of genreIndices) {
                    while (idx < genreIndex) {
                        row += ',';
                        idx++;
                    }
                    row += ',1';
                }
                // Trim the last ,
                row = row.slice(0, -1);

                if (needRewrite) {
                    // We need to rewrite the file with the new headers
                    // First, copy the file to a tmp file
                    await fileHandle.close();
                    const tmpDir = new URL(randomUUID(), 'file:' + tmpdir() + '/');
                    await fs.mkdir(tmpDir);
                    const tmpFilePath = new URL('tmp.csv', tmpDir + '/');
                    await fs.rename(this.filePath, tmpFilePath);
                    fileHandle = await fs.open(this.filePath, "w");
                    // Write the new headers
                    const headers = [
                        'title',
                        'album',
                        'artist',
                        ...Array.from(genres.entries())
                            .map(([genre, index]) => ({ genre, index }))
                            .sort((a, b) => a.index - b.index)
                            .map(({ genre }) => JSON.stringify(genre)),
                    ].join(',');
                    fileHandle.write(headers + '\n');

                    const oldFileHandle = fs.createReadStream(tmpFilePath, { encoding: 'utf8' });
                    for await (const chunk of oldFileHandle) {
                        // TODO: skip the first line from the old file
                        await fileHandle.write(chunk.replace(/\n/g, ',\n'));
                    }
                }

                console.log(row);
                fileHandle.write(row + '\n');
            }

        } finally {
            await fileHandle.close();
        }
    }
        */
}