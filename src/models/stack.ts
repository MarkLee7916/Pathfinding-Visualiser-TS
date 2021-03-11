import { Collection } from "./collection";

// A wrapper around the default list to implement the collection interface
export class Stack<T> implements Collection<T> {
    private readonly stack: T[];

    constructor() {
        this.stack = [];
    }

    add(item: T) {
        this.stack.push(item);
    }

    find(predicate: (elem: T) => boolean) {
        return this.stack.find(predicate);
    }

    remove() {
        return this.stack.pop();
    }

    isEmpty() {
        return this.stack.length === 0;
    }
}