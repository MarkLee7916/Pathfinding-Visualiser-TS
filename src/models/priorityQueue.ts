import { Collection } from "./collection";

export class PriorityQueue<T> implements Collection<T> {
    // Represents a binary heap tree data structure, where positions are calculated from indices
    private readonly heap: T[];

    // Comparator for whatever type user passes in
    private readonly compare: (a: T, b: T) => number;

    // Number of elements currently in the heap (not equal to this.heap.length)
    private size: number;

    constructor(cmp: (a: T, b: T) => number) {
        this.compare = cmp;
        this.size = 0;
        this.heap = [];
    }

    private leftChild(currNode: number) {
        return 2 * currNode + 1;
    }

    private rightChild(currNode: number) {
        return 2 * currNode + 2;
    }

    private parent(currNode: number) {
        return Math.floor((currNode + 1) / 2) - 1;
    }

    private isValidLeftChild(curr: number) {
        return this.leftChild(curr) < this.size && this.compare(this.heap[curr], this.heap[this.leftChild(curr)]) < 0;
    }

    private isValidRightChild(curr: number) {
        return this.rightChild(curr) < this.size && this.compare(this.heap[curr], this.heap[this.rightChild(curr)]) < 0;
    }

    private isValidParent(curr: number) {
        return curr > 0 && this.compare(this.heap[curr], this.heap[this.parent(curr)]) > 0;
    }

    // Move element downwards into its proper heap position
    private floatDown() {
        let curr = 0;
        let min: number;

        while (this.isValidLeftChild(curr) || this.isValidRightChild(curr)) {
            const left = this.leftChild(curr);
            const right = this.rightChild(curr);

            if (right >= this.size) {
                min = left;
            } else {
                if (this.compare(this.heap[left], this.heap[right]) > 0) {
                    min = left;
                }
                else {
                    min = right;
                }
            }

            this.swap(curr, min);
            curr = min;
        }
    }

    // Move element upwards into its proper heap position
    private floatUp() {
        let curr = this.size - 1;

        while (this.isValidParent(curr)) {
            const parentNode = this.parent(curr);

            this.swap(curr, parentNode);
            curr = parentNode;
        }
    }

    // Exchange positions of two elements in the heap array
    private swap(i: number, j: number) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    // Add new item to bottom of heap and move into its appropiate place 
    public add(elem: T) {
        this.size++;
        this.heap[this.size - 1] = elem;
        this.floatUp();
    }

    // Remove max item from heap and return it
    public remove() {
        if (this.size === 0) {
            throw "Can't poll from empty queue";
        }

        const max = this.heap[0];

        this.swap(0, this.size - 1);
        this.heap.length--;
        this.size--;
        this.floatDown();

        return max;
    }

    public isEmpty() {
        return this.size === 0;
    }
}
