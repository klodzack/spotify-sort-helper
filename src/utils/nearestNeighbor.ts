function subNearestNeighbor<T>(items: T[], comparator: (a: T, b: T) => number): { sorted: T[], sumDistance: number } {
    if (items.length < 3) return { sorted: items, sumDistance: 0 };

    const sorted = [items[0]];
    const rest = items.slice(1);
    let sumDistance = 0;

    let lastChoice = sorted[0];
    while (rest.length > 0) {
        let nextIndex = 0;
        let nextDistance = Infinity;
        for (let i=0; i<rest.length; i++) {
            const distance = comparator(lastChoice, rest[i]);
            if (distance < nextDistance) {
                nextIndex = i;
                nextDistance = distance;
            }
        }
        sorted.push(...rest.splice(nextIndex, 1));
        sumDistance += nextDistance;
    }

    return { sorted, sumDistance };
}

export function nearestNeighbor<T>(items: T[], comparator: (a: T, b: T) => number): T[] {
    if (items.length < 3) return items;

    let bestSorted = items;
    let bestSumDistance = Infinity;
    for (let i=0; i<items.length; i++) {
        const rest = [...items];
        const first = rest.splice(i, 1)[0];
        const { sorted, sumDistance } = subNearestNeighbor([first, ...rest], comparator);
        if (sumDistance < bestSumDistance) {
            bestSorted = sorted;
            bestSumDistance = sumDistance;
        }
    }

    return bestSorted;
}
