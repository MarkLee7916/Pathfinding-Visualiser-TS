import { Collection } from "./collection";

// A wrapper around the default list to implement the collection interface
export class Queue<T> implements Collection<T> {
    private readonly queue: T[];

    constructor() {
        this.queue = [];
    }

    add(item: T) {
        this.queue.push(item);
    }

    find(predicate: (elem: T) => boolean) {
        return this.queue.find(predicate);
    }

    remove() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}