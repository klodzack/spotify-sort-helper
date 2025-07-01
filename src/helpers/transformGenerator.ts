/** Runs an asynchronous transformation on values returned from the given generator. Supports concurrency with the transformations if next() is called multiple times - for convenient concurrency handling, use a lookaheadGenerator. */
export function transformGenerator<T, TReturn, R>(generator: AsyncGenerator<T>, transform: (value: T) => Promise<R>): AsyncGenerator<R> {
    const ret: AsyncGenerator<R> = {
        next: async () => {
            const nextIteratorResult: IteratorResult<T | R> = await generator.next();
            if (!nextIteratorResult.done) {
                nextIteratorResult.value = await transform(nextIteratorResult.value as T);
            }
            return nextIteratorResult as IteratorResult<R>;
        },
        return: async (val: TReturn) => {
            const nextIteratorResult: IteratorResult<T | R> = await generator.return(val);
            if (!nextIteratorResult.done) {
                nextIteratorResult.value = await transform(nextIteratorResult.value as T);
            }
            return nextIteratorResult as IteratorResult<R>;
        },
        throw: async (reason: any) => {
            const nextIteratorResult: IteratorResult<T | R> = await generator.throw(reason);
            if (!nextIteratorResult.done) {
                nextIteratorResult.value = await transform(nextIteratorResult.value as T);
            }
            return nextIteratorResult as IteratorResult<R>;
        },
        [Symbol.asyncIterator]: () => ret,
        [Symbol.asyncDispose]: () => generator[Symbol.asyncDispose](),
    };
    return ret;
}