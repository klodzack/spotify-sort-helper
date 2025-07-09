import { consoleBottleneckLog } from "../bottlenecks/ConsoleBottleneck";
import { IOutputRecord } from "../interfaces/IOutputRecord";
import { ICategorizedOutput } from "./ICategorizedOutput";
import chalk from 'chalk';

export class ConsoleOutput implements ICategorizedOutput {
    async write(stream: AsyncIterable<IOutputRecord>) {
        for await (const outputRecord of stream) {
            consoleBottleneckLog([
                '',
                `${chalk.blueBright('Title: ')} ${outputRecord.title}`,
                ...(
                    outputRecord.album
                        ? [`${chalk.blueBright('Album: ')} ${outputRecord.album}`]
                        : []
                ),
                `${chalk.blueBright('Artist: ')} ${outputRecord.artist}`,
                ...(
                    outputRecord.extraRecords
                        ? [chalk.blueBright('Meta:'), ...Array.from(Object.entries(outputRecord.extraRecords)).map(([ key, value ]) => `  ${chalk.blue(key)}: ${value}`)]
                        : []
                ),
                ...(
                    outputRecord.genres === null
                        ? [`${chalk.blueBright('Genres: ')} ${chalk.redBright('UNKNOWN!')}`]
                        : [
                            chalk.blueBright('Genres:'),
                            ...outputRecord.genres.map(g => `  - ${g}`)
                        ]
                )
            ].join('\n'));
        }
    }
}