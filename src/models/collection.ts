export interface Collection<T> {
    add: (input: T) => void,
    remove: () => T,
    isEmpty: () => boolean
}
