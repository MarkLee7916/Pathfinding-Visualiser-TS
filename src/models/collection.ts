// Generic interface that allows us to write pathfinding algos generically
export interface Collection<T> {
    add: (input: T) => void,
    remove: () => T,
    isEmpty: () => boolean
}
