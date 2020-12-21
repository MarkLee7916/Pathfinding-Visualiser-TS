import { HEIGHT, WIDTH } from "../controllers/constants";
import { generateGrid } from "./utils";

export class Grid {
    private readonly grid: boolean[][];

    constructor() {
        this.grid = generateGrid(false);
    }

    public has([row, col]: [number, number]) {          
        if (this.isOutOfBounds([row, col])) {
            return false;
        } else {
            return this.grid[row][col];
        }
    }

    // Return true if the given grids have any tiles in common filled in
    public static hasIntersection(grid: Grid, matrix: Grid) {
        const [row, col] =  Grid.intersection(grid, matrix);

        return row !== -1 && col !== -1;
    }

    // Return the coordinates of the tiles that the given grids both have filled in
    public static intersection(grid: Grid, matrix: Grid): [number, number] {
        for (let row = 0; row < HEIGHT; row++) {
            for (let col = 0; col < WIDTH; col++) {
                const coord: [number, number] = [row, col];

                if (grid.has(coord) && matrix.has(coord)) {
                    return coord;
                }
            }
        }

        return [-1, -1];
    }

    public fill([row, col]: [number, number]) {
        if (this.isOutOfBounds([row, col])) {
            throw `Invalid arguments, must be within bounds of grid. Supplied args were row: ${row} col: ${col}`;
        }

        this.grid[row][col] = true;
    }

    public unfill([row, col]: [number, number]) {
        if (this.isOutOfBounds([row, col])) {
            throw `Invalid arguments, must be within bounds of grid. Supplied args were row: ${row} col: ${col}`;
        }

        this.grid[row][col] = false;
    }

    public isOutOfBounds([row, col]: [number, number]) {
	    return row < 0 || col < 0 || row >= HEIGHT || col >= WIDTH;
    }
}
