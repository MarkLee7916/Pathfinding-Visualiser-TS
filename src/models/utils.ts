import { HEIGHT, WIDTH } from "../controllers/controller";

export function generateGrid<T>(input: T): T[][] {
    const grid = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            grid[row].push(input);
        }
    }

    return grid;
}

export function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * ( upper - lower)) + lower;
}
