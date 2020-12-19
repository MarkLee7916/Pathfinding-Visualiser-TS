import { Coord, HEIGHT, WIDTH } from "../controllers/controller";
import { getDOMElem, getTileInDOM, initGridInDOM, isColor, swapTileColors, wait } from "./viewUtils";

export const enum ViewMessages {
    ActivateTile,
    SetStart,
    SetGoal,
    RunAlgo,
    ResetBlocks,
    GenerateMaze,
    SetBlockType
}

const BACKGROUND_COLOR = "rgb(255, 255, 255)";
const FINAL_PATH_COLOR = "rgb(245, 209, 66)";
const SEARCHING_COLOR = "rgb(3, 148, 252)";
const START_COLOR = "rgb(255, 80, 80)";
const GOAL_COLOR = "rgb(235, 145, 9)";
const WALL_COLOR = "rgb(128,128,128)";
const FRONTIER_COLOR = "rgb(115, 240, 161)";
const HEIGHT_PIXELS = 500;
const WIDTH_PIXELS = 1000;

const algoDescriptions = new Map([
    ["best-first-search", "Best first search is entirely heuristic based, so is unweighted and doesn't guarantee the shortest path"],
    ["a-star", "A* combines heuristics and lowest weight path, so guarantees the shortest path if we use a proper heuristic"],
    ["depth-first-search", "DFS always considers the most recent node it's seen, so is unweighted and doesn't guarantee shortest path"],
    ["breadth-first-search", "BFS always considers the first node it's seen but not visited, so is weighted and guarantees shortest path"],
    ["dijkstra", "Dijkstra's always considers the lowest weight nodes, so guarantees the shortest path"],
    ["bidirectional-BFS", "Bidirectional BFS does a BFS from both directions, so is unweighted and guarantees the shortest path"],
    ["bidirectional-DFS", "Bidirectional DFS does a DFS from both directions, so is unweighted and doesn't guarantee shortest path"],
    ["bidirectional-GBFS", "Bidirectional GBFS runs from both directions, so is unweighted and doesn't guarantee the shortest path"],
    ["bidirectional-dijkstra", "Bidirectional Dijkstra's runs from both directions, so is weighted and guarantees the shortest path"],
    ["bidirectional-a-star", "Bidirectional A* is weighted and guarantees the shortest path if we use a proper heuristic"]
]);

let isMouseDown: boolean;
let delayTime: number;
let notifyController: (message: ViewMessages, arg: any) => void;
let draggedFrom: HTMLTableCellElement;

export function initView(notif: (message: ViewMessages, arg: any) => void) {
    notifyController = notif;
    isMouseDown = false;
    delayTime = 30;

    initGridInDOM("#grid", HEIGHT, WIDTH, HEIGHT_PIXELS, WIDTH_PIXELS, BACKGROUND_COLOR);
    initEventListeners();

    renderStartTileInDOM(1, 1);
    notifyController(ViewMessages.SetStart, [1, 1]);

    renderGoalTileInDOM(HEIGHT - 2, WIDTH - 2);
    notifyController(ViewMessages.SetGoal, [HEIGHT - 2, WIDTH - 2]);
}

export async function renderFinalPathTileInDOM([row, col]: Coord) {
    await wait(delayTime);

    renderTileGeneric(row, col, FINAL_PATH_COLOR);
}

export async function renderSearchingTileInDOM([row, col]: Coord) {
    await wait(delayTime);

    renderTileGeneric(row, col, SEARCHING_COLOR);
}

export function renderWallTileInDOM([row, col]: Coord) {
    renderTileGeneric(row, col, WALL_COLOR);
}

export function renderBlankTileInDOM([row, col]: Coord) {
    renderTileGeneric(row, col, BACKGROUND_COLOR);
}

export async function renderFrontierInDOM([row, col]: Coord) {
    if (!isSearching(getTileInDOM(row, col))) {
        await wait(delayTime);

        renderTileGeneric(row, col, FRONTIER_COLOR);
    }
}

export async function renderWeightInDOM([row, col, weight]: [number, number, number]) {
    getTileInDOM(row, col).innerHTML = weight.toString();
}

export async function removeWeightInDOM([row, col]: Coord) {
    getTileInDOM(row, col).innerHTML = "";
}

function renderStartTileInDOM(row: number, col: number) {
    renderTileGeneric(row, col, START_COLOR);
}

function renderGoalTileInDOM(row: number, col: number) {
    renderTileGeneric(row, col, GOAL_COLOR);
}

function renderTileGeneric(row: number, col: number, color: string) {
    const tile = getTileInDOM(row, col);

    if (!isStart(tile) && !isGoal(tile)) {
        getTileInDOM(row, col).style.backgroundColor = color;
    }
}

function initEventListeners() {
    initMouseDetectionEventListeners();
    initEventListenersForGrid();
    initPreventDefaultDragEventListener();
    initMenuEventListeners();
}

function initMenuEventListeners() {
    getDOMElem("#run-algo").addEventListener("click", runAlgo);
    getDOMElem("#reset-walls").addEventListener("click", () => notifyController(ViewMessages.ResetBlocks, null));
    getDOMElem("#reset-path").addEventListener("click", resetPath);
    getDOMElem("#wall-pattern").addEventListener("change", generateWallPattern);
    getDOMElem("#block-type").addEventListener("change", handleBlockTypeChange);
    getDOMElem("#select-algo").addEventListener("change", handleAlgoDescriptionUpdate)
}

function handleAlgoDescriptionUpdate(event) {
    const descriptionDOM = getDOMElem("#description");
    const algoStr = event.target.value;

    descriptionDOM.innerHTML = algoDescriptions.get(algoStr);
}

function handleBlockTypeChange(event) {
    notifyController(ViewMessages.SetBlockType, event.target.value);
}

function generateWallPattern(event) {
    if (!event.target.disabled) {
        notifyController(ViewMessages.GenerateMaze, event.target.value);
    }
}

function runAlgo() {
    const algo = <HTMLSelectElement> getDOMElem("#select-algo");

    resetPath();
    notifyController(ViewMessages.RunAlgo, algo.value);
}

function resetPath() {
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const tile = getTileInDOM(row, col);

            if (isSearching(tile) || isPath(tile) || isFrontier(tile)) {
                renderBlankTileInDOM([row, col]);
            }
        }
    }
}

// Prevent the drag default actions from occuring to allow proper drag and drop between tiles
function initPreventDefaultDragEventListener() {
    document.addEventListener("dragover", event => event.preventDefault(), false);
    document.addEventListener("dragenter", event => event.preventDefault(), false);
}

// Detect when user has their mouse down or mouse up to allow smooth drawing of walls
function initMouseDetectionEventListeners() {
    document.addEventListener("mousedown", () => isMouseDown = true);
    document.addEventListener("mouseup", () => isMouseDown = false);
}

function initEventListenersForGrid() {
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            addTileMouseOverEventListener(row, col);
            addTileMouseDownEventListener(row, col);
            addTileDragEventListener(row, col);
            addTileDropEventListener(row, col);
        }
    }
}

// Allow dragging iff tile is a start or goal tile
function addTileDragEventListener(row: number, col: number) {
    const tile = getTileInDOM(row, col);

    tile.addEventListener("dragstart", event => {
        if (!isStart(tile) && !isGoal(tile)) {
            event.preventDefault();
        } else {
            isMouseDown = false;
            draggedFrom = tile;
        }
    });
}

// Allow dropping iff drag tile was a start or goal tile and the drop tile is blank
function addTileDropEventListener(dropRow: number, dropCol: number) {
    const droppedOn = getTileInDOM(dropRow, dropCol);

    droppedOn.addEventListener("drop", event => {
        if (isStart(draggedFrom) && isBlank(droppedOn)) {
            notifyController(ViewMessages.SetStart, [dropRow, dropCol]);
            swapTileColors(droppedOn, draggedFrom);
        } else if (isGoal(draggedFrom) && isBlank(droppedOn)) {
            notifyController(ViewMessages.SetGoal, [dropRow, dropCol]);
            swapTileColors(droppedOn, draggedFrom);
        } else if (isBlank(droppedOn)) {
            event.stopPropagation();
        }
    });
}

function addTileMouseDownEventListener(row: number, col: number) {
    getTileInDOM(row, col).addEventListener("mousedown", () => {
        notifyController(ViewMessages.ActivateTile, [row, col]);
    });
}

function addTileMouseOverEventListener(row: number, col: number) {
    getTileInDOM(row, col).addEventListener("mouseover", () => {
        if (isMouseDown) {
            notifyController(ViewMessages.ActivateTile, [row, col]);
        }
    });
}

function isStart(tile: HTMLTableCellElement) {
    return isColor(tile, START_COLOR);
}

function isGoal(tile: HTMLTableCellElement) {
    return isColor(tile, GOAL_COLOR);
}

function isBlank(tile: HTMLTableCellElement) {
    return isColor(tile, BACKGROUND_COLOR);
}

function isPath(tile: HTMLTableCellElement) {
    return isColor(tile, FINAL_PATH_COLOR);
}

function isSearching(tile: HTMLTableCellElement) {
    return isColor(tile, SEARCHING_COLOR);
}

function isFrontier(tile: HTMLTableCellElement) {
    return isColor(tile, FRONTIER_COLOR);
}



