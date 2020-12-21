import { HEIGHT, WIDTH } from "../controllers/constants";

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

// Generate a random integer between lower (inclusive) and upper (not inclusive)
export function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * ( upper - lower)) + lower;
}
