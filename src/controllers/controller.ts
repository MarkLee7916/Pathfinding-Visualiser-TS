import { Heuristic, setHeuristic } from "../models/comparators";
import { bestFirstSearch, breadthFirstSearch, depthFirstSearch, initPathfinding, ModelMessages, resetWalls, setGoal, setStart, randomMaze, astar, dijkstra, setBlockTypeToWall, setBlockTypeToWeight, bidirectionalDFS, bidirectionalBFS, bidirectionalBestFirstSearch, bidirectionalDijkstra, bidirectionalAstar, toggleTile, divideHorizontal, divideVertical, bidirectionalRandomSearch, randomSearch } from "../models/pathfinding";
import { initView, removeWeightFromTileInDOM, renderBlankTileInDOM, renderPathTileInDOM, renderFrontierInDOM, renderSearchingTileInDOM, renderWallTileInDOM, renderWeightOnTileInDOM, ViewMessages } from "../views/view";

// Map an HTML value representation of a pathfinding algorithm to an actual implementation
const algoStrToFunction = new Map<string, () => void>([
    ["best-first-search", bestFirstSearch],
    ["breadth-first-search", breadthFirstSearch],
    ["depth-first-search", depthFirstSearch],
    ["a-star", astar],
    ["dijkstra", dijkstra],
    ["bidirectional-DFS", bidirectionalDFS],
    ["bidirectional-BFS", bidirectionalBFS],
    ["bidirectional-GBFS", bidirectionalBestFirstSearch],
    ["bidirectional-dijkstra", bidirectionalDijkstra],
    ["bidirectional-a-star", bidirectionalAstar],
    ["bidirectional-random", bidirectionalRandomSearch],
    ["random", randomSearch]
]);

// Map an HTML value representation of a wall type to a function that sets it to that wall type
const wallTypeStrToFunction = new Map<string, () => void>([
    ["wall", setBlockTypeToWall],
    ["weight", setBlockTypeToWeight]
]);

// Map an HTML value representation of a maze generation algorithm to an actual implentation
const generateMazeStrToFunction = new Map<string, () => void>([
    ["random-maze", randomMaze],
    ["divide-horizontal", divideHorizontal],
    ["divide-vertical", divideVertical]
]);

const heuristicStrToFunction = new Map<string, () => void>([
    ["manhattan", () => setHeuristic(Heuristic.Manhattan)],
    ["chebyshev", () => setHeuristic(Heuristic.Chebyshev)],
    ["euclidean", () => setHeuristic(Heuristic.Euclidean)],
]);

const viewMessageToAction = new Map([
    [ViewMessages.ActivateTile, content => toggleTile(<[number, number]>content)],
    [ViewMessages.SetStart, content => setStart(<[number, number]>content)],
    [ViewMessages.SetGoal, content => setGoal(<[number, number]>content)],
    [ViewMessages.RunAlgo, async content => await algoStrToFunction.get(<string>content)()],
    [ViewMessages.ResetBlocks, _ => resetWalls()],
    [ViewMessages.GenerateMaze, content => generateMazeStrToFunction.get(<string>content)()],
    [ViewMessages.SetWallType, content => wallTypeStrToFunction.get(<string>content)()],
    [ViewMessages.SetHeuristic, content => heuristicStrToFunction.get(<string>content)()]
]);

const modelMessageToAction = new Map([
    [ModelMessages.RenderPathTile, async content => await renderPathTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderSearching, async content => await renderSearchingTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderWall, content => renderWallTileInDOM(<[number, number]>content)],
    [ModelMessages.RemoveWall, content => renderBlankTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderWeight, content => renderWeightOnTileInDOM(<[number, number, number]>content)],
    [ModelMessages.RemoveWeight, content => removeWeightFromTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderFrontier, async content => await renderFrontierInDOM(<[number, number]>content)],
]);

// Callback that executes whenever the view wants to talk to the controller
async function readMessageFromView(message: ViewMessages, content: any) {
    const action = viewMessageToAction.get(message);    

    if (action === undefined) {
        throw `Argument not supported: ${message}`; 
    } else {
        await action(content);
    }
}

// Callback that executes whenever the model wants to talk to the controller
async function readMessageFromModel(message: ModelMessages, content: any) {
    const action = modelMessageToAction.get(message);    

    if (action === undefined) {
        throw `Argument not supported: ${message}`; 
    } else {
        await action(content);
    }
}

(function startProgram() {
    initView(readMessageFromView);
    initPathfinding(readMessageFromModel);
})();


