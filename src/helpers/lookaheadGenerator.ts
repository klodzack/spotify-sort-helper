/** Requests items from the input generator as quickly as possible, with `count` concurrency. Yields them in the same order that the input generator emitted them. */
export async function* lookaheadGenerator<T>(count: number, generator: AsyncGenerator<T>): AsyncGenerator<T> {
    if (count < 1) throw new Error('Concurrency count must be at least 1');

    // Buffer to hold results in order
    const buffer: Array<Promise<PromiseSettledResult<IteratorResult<T>>>> = [];
    let done = false;

    // Helper to fetch next item from generator
    async function fetchNext() {
        try {
            const result = await generator.next();
            if (result.done) done = true;
            return { status: 'fulfilled', value: result } as PromiseFulfilledResult<typeof result>;
        } catch (e) {
            return { status: 'rejected', reason: e } as PromiseRejectedResult;
        }
    }

    // Prime the buffer with up to `count` promises
    for (let i = 0; i < count; i++) {
        buffer.push(fetchNext());
    }

    while (buffer.length > 0) {
        const result = await buffer.shift()!;
        if (result.status === 'rejected') throw result.reason;
        if (!done) buffer.push(fetchNext());
        if (result.value.done) return result.value.value;
        yield result.value.value;
    }
}