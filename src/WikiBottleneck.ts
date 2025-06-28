import Bottleneck from 'bottleneck';

export const WikiBottleneck = new Bottleneck({
    maxConcurrent: 4,
    minTime: 100,
});
