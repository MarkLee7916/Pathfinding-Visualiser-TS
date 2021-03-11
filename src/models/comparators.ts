import { Coord } from "../controllers/constants";
import { Node } from "./pathfinding"

// Reference to the heuristic the user has selected
let currentHeuristic = generateManhattanComparator;

export const enum Heuristic {
    Euclidean,
    Manhattan,
    Chebyshev,
    Combination
}

// Map a heuristic onto its implementation
const enumToFunction = new Map([
    [Heuristic.Manhattan, generateManhattanComparator],
    [Heuristic.Euclidean, generateEuclideanComparator],
    [Heuristic.Chebyshev, generateChebyshevComparator],
    [Heuristic.Combination, generateCombinationComparator]
]);


// Update the selected heuristic
export function setHeuristic(heuristic: Heuristic) {
    currentHeuristic = enumToFunction.get(heuristic);
}

// Return whichever heuristic user has selected
export function generateHeuristic(goal: Coord) {
    return currentHeuristic(goal);
}

// Since all heuristics are admissable, we can take max of all of them to produce an optimal heuristic
function generateCombinationComparator(goal: Coord) {
    return (node1: Node, node2: Node) => {
        const chebyshevHeuristic = generateChebyshevComparator(goal)(node1, node2);
        const manhattanHeuristic = generateManhattanComparator(goal)(node1, node2);
        const euclideanHeuristic = generateEuclideanComparator(goal)(node1, node2);

        return Math.max(chebyshevHeuristic, manhattanHeuristic, euclideanHeuristic)
    }
}


// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula max(abs(p1 - g1), abs(p2 - g2))
function generateChebyshevComparator([goalRow, goalCol]: Coord) {
    return (node1: Node, node2: Node) => {
        const [r1, c1] = node1.val();
        const [r2, c2] = node2.val();

        return Math.max(Math.abs(r2 - goalRow), Math.abs(c2 - goalCol)) - Math.max(Math.abs(r1 - goalRow), Math.abs(c1 - goalCol));
    }
}

// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula sqrt((p1 - g1)^2 + abs(p2 - g2)^2)
function generateEuclideanComparator([goalRow, goalCol]: Coord) {
    return (node1: Node, node2: Node) => {
        const [r1, c1] = node1.val();
        const [r2, c2] = node2.val();

        const r1Dist = Math.sqrt(Math.pow(r1 - goalRow, 2) + Math.pow(c1 - goalCol, 2));
        const r2Dist = Math.sqrt(Math.pow(r2 - goalRow, 2) + Math.pow(c2 - goalCol, 2));
        
        return r2Dist - r1Dist;
    }
}

// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula abs(p1 - g1) + abs(p2 - g2) 
function generateManhattanComparator([goalRow, goalCol]: Coord) {
    return (node1: Node, node2: Node) => {
        const [r1, c1] = node1.val();
        const [r2, c2] = node2.val();

        return (Math.abs(r2 - goalRow) + Math.abs(c2 - goalCol)) - (Math.abs(r1 - goalRow) + Math.abs(c1 - goalCol));
    }
}

// Return a comparator that combines a goal based heuristic with a lowest weights heuristic
export function generateAStarComparator(goal: Coord) {
    return (node1: Node, node2: Node) => {
        const dijkstraHeuristic = generateDijkstraComparator()(node1, node2);
        const goalHeuristic = currentHeuristic(goal)(node1, node2);

        return dijkstraHeuristic + goalHeuristic;
    }
}

// Return a comparator that implements a heuristic that is biased in favour of the lowest weight nodes
export function generateDijkstraComparator() {
    return (node1: Node, node2: Node) => node2.dist() - node1.dist();
}

export function generateRandomComparator() {
    return (x: Node, y: Node) => Math.random() - 0.6;
}