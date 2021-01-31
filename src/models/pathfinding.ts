import { Grid } from "./grid";
import { HashMap } from "./hashMap";
import { PriorityQueue } from "./priorityQueue";
import { Stack } from "./stack";
import { Queue } from "./queue";
import { Collection } from "./collection";
import { Coord, HEIGHT, WIDTH } from "../controllers/constants";
import { Vertice } from "./vertice";
import { generateGrid, randomIntBetween } from "./utils";
import { generateAStarComparator as generateAstarComparator, generateDijkstraComparator, generateGoalDistComparator, generateRandomComparator } from "./comparators";

type Weights = number[][];
export type Node = Vertice<Coord>;

// The protocol we use to talk to the controller
export const enum ModelMessages {
    RenderPathTile,
    RenderSearching,
    RenderWall,
    RemoveWall,
    RenderFrontier,
    RemoveWeight,
    RenderWeight
}

// Keeps track of where the pathfinding algos can't cross
const walls = new Grid();

// Keeps track of which tiles are weighted
const weights = generateGrid(1);

// Allows us to tell the controller to execute some effect
let notifyController: (message: ModelMessages, content: any) => void;

// Coordinate of the starting tile 
let start: Coord;

// Coordinate of the goal tile
let goal: Coord;

// Allows us to generically place either a weight or a wall
let tilePlacementFunc = toggleWall;

export function initPathfinding(notif: (message: ModelMessages, content: any) => void) {
    notifyController = notif;
}

// Wrapper around tilePlacementFunc to avoid having to expose mutable state
export function toggleTile(coord: Coord) {
    tilePlacementFunc(coord);
}

// If there's a wall at coord, remove it. Else, add a wall there
export function toggleWall(coord: Coord) {
    if (walls.has(coord)) {
        notifyController(ModelMessages.RemoveWall, coord);
        walls.unfill(coord);
    } else if (!isStart(coord) && !isGoal(coord)) {
        notifyController(ModelMessages.RenderWall, coord);
        walls.fill(coord);
    }
}

// If there's a weight at coord, remove it. Else, add a weight there
export function toggleWeight([row, col]: Coord) {
    const coord: Coord = [row, col];

    if (weights[row][col] !== 1) {
        notifyController(ModelMessages.RemoveWeight, coord);
        weights[row][col] = 1;
    } else if (!isStart(coord) && !isGoal(coord)) {
        const weight = randomIntBetween(10, 100);

        notifyController(ModelMessages.RenderWeight, [row, col, weight]);
        weights[row][col] = weight;
    }
}

export function setStart(coord: Coord) {
    start = coord;
}

export function setGoal(coord: Coord) {
    goal = coord;
}

// Remove all weights and walls
export function resetWalls() {
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const coord: Coord = [row, col];

            if (walls.has(coord)) {
                toggleWall(coord);
            }

            if (weights[row][col] !== 1) {
                toggleWeight(coord);
            }
        }
    }
}

export async function depthFirstSearch() {
    const stack = new Stack<Node>();

    await genericUnidirectionalSearch(stack, weights);
}

export async function breadthFirstSearch() {
    const queue = new Queue<Node>();

    await genericUnidirectionalSearch(queue, weights);
}

export async function bestFirstSearch() {
    const gridComparator = generateGoalDistComparator(goal);
    const priorityQueue = new PriorityQueue<Node>(gridComparator);

    await genericUnidirectionalSearch(priorityQueue, weights);
}

export async function astar() {
    const gridComparator = generateAstarComparator(goal);
    const priorityQueue = new PriorityQueue<Node>(gridComparator);

    await genericUnidirectionalSearch(priorityQueue, weights);
}

export async function dijkstra() {
    const gridComparator = generateDijkstraComparator();
    const priorityQueue = new PriorityQueue<Node>(gridComparator);

    await genericUnidirectionalSearch(priorityQueue, weights);
}

export async function randomSearch() {
    const randomComparator = generateRandomComparator();
    const priorityQueue = new PriorityQueue<Node>(randomComparator);

    await genericUnidirectionalSearch(priorityQueue, weights);
}

// Reset walls and generate a random maze of whatever wall type user has selected
export function randomMaze() {
    resetWalls();

    for (let row = 0; row < HEIGHT; row++) {
        fillRowRandomly(row);
    }
}

export function setBlockTypeToWall() {
    tilePlacementFunc = toggleWall;
}

export function setBlockTypeToWeight() {
    tilePlacementFunc = toggleWeight;
}

export async function bidirectionalDFS() {
    const forwardStack = new Stack<Node>();
    const backwardStack = new Stack<Node>();

    await genericBidirectionalSearch(forwardStack, backwardStack, weights);
}

export async function bidirectionalBFS() {
    const forwardQueue = new Queue<Node>();
    const backwardQueue = new Queue<Node>();

    await genericBidirectionalSearch(forwardQueue, backwardQueue, weights);
}

export async function bidirectionalBestFirstSearch() {
    const forwardsComparator = generateGoalDistComparator(goal);
    const backwardsComparator = generateGoalDistComparator(start);

    const forwardPriorityQueue = new PriorityQueue<Node>(forwardsComparator);
    const backwardPriorityQueue = new PriorityQueue<Node>(backwardsComparator);

    await genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights);
}

export async function bidirectionalDijkstra() {
    const gridComparator = generateDijkstraComparator();
    const forwardPriorityQueue = new PriorityQueue<Node>(gridComparator);
    const backwardPriorityQueue = new PriorityQueue<Node>(gridComparator);

    await genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights);
}

export async function bidirectionalRandomSearch() {
    const randomComparator = generateRandomComparator();
    const forwardPriorityQueue = new PriorityQueue<Node>(randomComparator);
    const backwardPriorityQueue = new PriorityQueue<Node>(randomComparator);

    await genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights);
}

export async function bidirectionalAstar() {
    const forwardsComparator = generateAstarComparator(goal);
    const backwardsComparator = generateAstarComparator(start);

    const forwardPriorityQueue = new PriorityQueue<Node>(forwardsComparator);
    const backwardPriorityQueue = new PriorityQueue<Node>(backwardsComparator);

    await genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights);
}

// Reset walls and generate a vertical maze of whatever wall type user has selected
export function divideVertical() {
    resetWalls();

    divideVertically(0, 0, HEIGHT, WIDTH);
}

// Reset walls and generate a horizontal maze of whatever wall type user has selected
export function divideHorizontal() {
    resetWalls();
    
    divideHorizontally(0, 0, HEIGHT, WIDTH);
}

// Algorithm for generating a vertical maze
function divideVertically(baseRow: number, baseCol: number, height: number, width: number) {
    if (width > 2 && height > 2) {
        const upperCol = baseCol + width;
        const upperRow = baseRow + height;
        const wallCol = randomIntBetween(baseCol + 1, upperCol - 1);
        const hole = randomIntBetween(baseRow, upperRow);

        for (let row = baseRow; row < upperRow; row++) {
            if (row !== hole){
                toggleTile([row, wallCol]);          
            }
        }

        divideVertically(baseRow, baseCol, height, (wallCol - baseCol) - 1);
        divideVertically(baseRow, wallCol + 1, height, (baseCol + width - wallCol) - 1);
    }   
}

// Algorithm for generating a horizontal maze
function divideHorizontally(baseRow: number, baseCol: number, height: number, width: number) {
    if (width > 2 && height > 2) {
        const upperRow = baseRow + height;
        const upperCol = baseCol + width;
        const wallRow = randomIntBetween(baseRow + 1, upperRow - 1);
        const hole = randomIntBetween(baseCol, upperCol);

        for (let col = baseCol; col < upperCol; col++) {
            if (col !== hole){
                toggleTile([wallRow, col]);          
            }
        }

        divideHorizontally(baseRow, baseCol, (wallRow - baseRow) - 1, width);
        divideHorizontally(wallRow + 1, baseCol, (baseRow + height - wallRow) - 1, width);
    }   
}

// Generic pathfinding algo for searching from a source. Parameterized with the data structure used to make it generic
async function genericUnidirectionalSearch(coords: Collection<Node>, weights: Weights) {
    const path = new HashMap<Coord, Coord>();
    const visited = new Grid();
    const considered = new Grid();
    const startVertice = new Vertice(start);

    startVertice.updateDist(0);
    coords.add(startVertice);
    visited.fill(start);

    while (!coords.isEmpty()) {
        const isFound = await considerNextNode(path, visited, coords, goal, weights, considered);

        if (isFound) {
            await renderFinalPath(path, goal);
            break;
        }
    }
}

// Generic pathfinding algo for searching from both the source and goal concurrently
async function genericBidirectionalSearch(forwardsNodes: Collection<Node>, backwardsNodes: Collection<Node>, weights: Weights) {
    const forwardsPath = new HashMap<Coord, Coord>();
    const backwardsPath = new HashMap<Coord, Coord>();

    const forwardsVisited = new Grid();
    const backwardsVisited = new Grid();

    const forwardsConsidered = new Grid();
    const backwardsConsidered = new Grid();

    const startVertice = new Vertice(start);
    const goalVertice = new Vertice(goal);

    startVertice.updateDist(0);
    goalVertice.updateDist(0);

    forwardsNodes.add(startVertice);
    backwardsNodes.add(goalVertice);

    forwardsVisited.fill(start);
    backwardsVisited.fill(goal);

    while (!forwardsNodes.isEmpty() && !backwardsNodes.isEmpty()) {
        const foundForwards = await considerNextNode(forwardsPath, forwardsVisited, forwardsNodes, goal, weights, forwardsConsidered);
        const foundBackwards = await considerNextNode(backwardsPath, backwardsVisited, backwardsNodes, start, weights, backwardsConsidered);

        if (foundForwards) {
            await renderFinalPath(forwardsPath, goal);
            break;
        } else if (foundBackwards) {
            await renderFinalPath(backwardsPath, start);
            break;
        } else if (Grid.hasIntersection(forwardsConsidered, backwardsConsidered)) {
            const intersection = Grid.intersection(forwardsConsidered, backwardsConsidered)

            await renderFinalPath(forwardsPath, intersection);
            await renderFinalPath(backwardsPath, intersection);
            break;
        }
    }
}

// Generic function for making one step in a pathfinding algorithm
async function considerNextNode(path: HashMap<Coord, Coord>, visited: Grid, nodes: Collection<Node>, target: Coord, weights: Weights, considered: Grid) {
    const currentPos = nodes.remove();
    const currentNeighbours = generateNeighbours(currentPos.val());

    considered.fill(currentPos.val());
    await notifyController(ModelMessages.RenderSearching, currentPos.val());

    if (isTarget(currentPos.val(), target)) {
        return true;
    }

    currentNeighbours.forEach(neighbour => {
        if (!walls.isOutOfBounds(neighbour) && !walls.has(neighbour)) {
            const [neighbourRow, neighbourCol] = neighbour;
            const neighbourVertice = new Vertice(neighbour);
            const newNeighbourDistance = currentPos.dist() + weights[neighbourRow][neighbourCol];

            if (!visited.has(neighbour)) {
                notifyController(ModelMessages.RenderFrontier, neighbour);
                neighbourVertice.updateDist(newNeighbourDistance);

                nodes.add(neighbourVertice);
                visited.fill(neighbour);
                path.add(neighbour, currentPos.val());
            } else if (newNeighbourDistance < neighbourVertice.dist()) {
                neighbourVertice.updateDist(newNeighbourDistance);
            }
        }
    });
}

// Fill some tiles in a row while leaving others
function fillRowRandomly(row: number) {
    const randomComparator = (x, y) => Math.random() - 0.5;
    const priorityQueue = new PriorityQueue<number>(randomComparator);
    const density = 4;

    for (let col = 0; col < WIDTH; col++) {
        priorityQueue.add(col);
    }

    for (let i = 0; i < WIDTH / density; i++) {
        const wallCoord: Coord = [row, priorityQueue.remove()];

        if (!isGoal(wallCoord) && !isStart(wallCoord) && !walls.has(wallCoord)) {
            toggleTile(wallCoord)
        }
    }
}

function isTarget([row, col]: Coord, [targRow, targCol]: Coord) {
    return row === targRow && col === targCol;
}

function isStart([row, col]: Coord) {
    const [startRow, startCol] = start;

    return row === startRow && col === startCol;
}

function isGoal([row, col]: Coord) {
    const [goalRow, goalCol] = goal;

    return row === goalRow && col === goalCol;
}

// Tell controller to display the final path
async function renderFinalPath(path: HashMap<Coord, Coord>, target: Coord) {
    let pos = target;

    while (path.get(pos) !== undefined) {
        await notifyController(ModelMessages.RenderPathTile, pos);
        pos = path.get(pos);      
    }
}

// Get all nodes one step away from a given node (diagonals not considered)
function generateNeighbours([row, col]: Coord) {
    const neighbours: Coord[] = [];

    addToNeighbours(neighbours, [row + 1, col]);
    addToNeighbours(neighbours, [row - 1, col]);
    addToNeighbours(neighbours, [row, col + 1]);
    addToNeighbours(neighbours, [row, col - 1]);

    return neighbours;
}

function addToNeighbours(neighbours: Coord[], pos: Coord) {
    if (!walls.isOutOfBounds(pos)) {
        neighbours.push(pos)
    }
}
