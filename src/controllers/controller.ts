import { bestFirstSearch, breadthFirstSearch, depthFirstSearch, initPathfinding, ModelMessages, resetBlocks, setGoal, setStart, randomMaze, AStar, Dijkstra, setBlockTypeToWall, setBlockTypeToWeight, bidirectionalDFS, bidirectionalBFS, bidirectionalBestFirstSearch, bidirectionalDijkstra, bidirectionalAStar, toggleTile, divideHorizontal, divideVertical } from "../models/pathfinding";
import { initView, removeWeightInDOM, renderBlankTileInDOM, renderFinalPathTileInDOM, renderFrontierInDOM, renderSearchingTileInDOM, renderWallTileInDOM, renderWeightInDOM, ViewMessages } from "../views/view";

export const HEIGHT = 20;
export const WIDTH = 40;
export type Coord = [number, number]
    
const algoStrToFunction = new Map<string, () => void>([
    ["best-first-search", bestFirstSearch],
    ["breadth-first-search", breadthFirstSearch],
    ["depth-first-search", depthFirstSearch],
    ["a-star", AStar],
    ["dijkstra", Dijkstra],
    ["bidirectional-DFS", bidirectionalDFS],
    ["bidirectional-BFS", bidirectionalBFS],
    ["bidirectional-GBFS", bidirectionalBestFirstSearch],
    ["bidirectional-dijkstra", bidirectionalDijkstra],
    ["bidirectional-a-star", bidirectionalAStar]
]);

const blockTypeStrToFunction = new Map<string, () => void>([
    ["wall", setBlockTypeToWall],
    ["weight", setBlockTypeToWeight]
]);

const generateWallStrToFunction = new Map<string, () => void>([
    ["random-maze", randomMaze],
    ["divide-horizontal", divideHorizontal],
    ["divide-vertical", divideVertical]
]);

const viewMessageToAction = new Map([
    [ViewMessages.ActivateTile, content => toggleTile(<[number, number]>content)],
    [ViewMessages.SetStart, content => setStart(<[number, number]>content)],
    [ViewMessages.SetGoal, content => setGoal(<[number, number]>content)],
    [ViewMessages.RunAlgo, async content => await algoStrToFunction.get(<string>content)()],
    [ViewMessages.ResetBlocks, _ => resetBlocks()],
    [ViewMessages.GenerateMaze, content => generateWallStrToFunction.get(<string>content)()],
    [ViewMessages.SetBlockType, content => blockTypeStrToFunction.get(<string>content)()]
]);

const modelMessageToAction = new Map([
    [ModelMessages.RenderPathTile, async content => await renderFinalPathTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderSearching, async content => await renderSearchingTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderWall, content => renderWallTileInDOM(<[number, number]>content)],
    [ModelMessages.RemoveWall, content => renderBlankTileInDOM(<[number, number]>content)],
    [ModelMessages.RenderWeight, content => renderWeightInDOM(<[number, number, number]>content)],
    [ModelMessages.RemoveWeight, content => removeWeightInDOM(<[number, number]>content)],
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

