import Bottleneck from 'bottleneck';

/** This bottleneck acts as a mutex, giving complete control of the console for a time */
export const ConsoleBottleneck = new Bottleneck({
    maxConcurrent: 1,
});

export function consoleBottleneckLog(...args: any[]) {
    ConsoleBottleneck.schedule(() => {
        console.log(...args);
        return Promise.resolve();
    });
}