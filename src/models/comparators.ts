import { Coord } from "../controllers/controller";
import { Node } from "./pathfinding"

// Return a comparator that implements a heuristic that is biased in favour of nodes near the goal node
export function generateGoalDistComparator([goalRow, goalCol]: Coord) {
    return (node1: Node, node2: Node) => {
        const [r1, c1] = node1.val();
        const [r2, c2] = node2.val();

        return (Math.abs(r2 - goalRow) + Math.abs(c2 - goalCol)) - (Math.abs(r1 - goalRow) + Math.abs(c1 - goalCol));
    }
}

export function generateAStarComparator(goal: Coord) {
    return (node1: Node, node2: Node) => {
        const dijkstraHeuristic = generateDijkstraComparator()(node1, node2);
        const goalDistHeuristic = generateGoalDistComparator(goal)(node1, node2);

        return dijkstraHeuristic + goalDistHeuristic;
    }
}

export function generateDijkstraComparator() {
    return (node1: Node, node2: Node) => node2.dist() - node1.dist();
}