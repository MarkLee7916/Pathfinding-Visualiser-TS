import { Coord, HEIGHT, WIDTH } from "../controllers/constants";
import { parseNumbersFromString } from "../models/utils";
import { getDOMElem, getDOMElemList, getTileInDOM, initGenericGridInDOM, isColor, swapTileColors, wait } from "./viewUtils";

// Protocol we use to talk to the controller

export const enum ViewMessages {
    ActivateTile,
    SetStart,
    SetGoal,
    RunAlgo,
    ResetBlocks,
    GenerateMaze,
    SetWallType,
    SetHeuristic
}

const BACKGROUND_COLOR = "rgb(255, 255, 255)";
const FINAL_PATH_COLOR = "rgb(245, 209, 66)";
const SEARCHING_COLOR = "rgb(3, 148, 252)";
const START_COLOR = "rgb(255, 80, 80)";
const GOAL_COLOR = "rgb(235, 145, 9)";
const WALL_COLOR = "rgb(128,128,128)";
const FRONTIER_COLOR = "rgb(115, 240, 161)";

const HEIGHT_PIXELS = window.innerHeight * 0.7;
const WIDTH_PIXELS = HEIGHT_PIXELS * (WIDTH / HEIGHT);

// Map an algorithm onto its description
const algoDescriptions = new Map([
    ["best-first-search", "Best first search is entirely heuristic based, so is unweighted and doesn't guarantee the shortest path"],
    ["a-star", "A* combines heuristics and lowest weight path, so guarantees the shortest path if our heuristic doesn't overestimate the distance"],
    ["depth-first-search", "DFS always considers the most recent node it's seen, so is unweighted and doesn't guarantee shortest path"],
    ["breadth-first-search", "BFS always considers the least recent node it's seen, so is unweighted and guarantees shortest path"],
    ["dijkstra", "Dijkstra's always considers the lowest weight nodes, so is weighted and guarantees the shortest path"],
    ["bidirectional-BFS", "Bidirectional BFS does a BFS from both directions, so is unweighted and guarantees the shortest path"],
    ["bidirectional-DFS", "Bidirectional DFS does a DFS from both directions, so is unweighted and doesn't guarantee shortest path"],
    ["bidirectional-GBFS", "Bidirectional GBFS runs from both directions, so is unweighted and doesn't guarantee the shortest path"],
    ["bidirectional-dijkstra", "Bidirectional Dijkstra's runs from both directions, so is weighted and guarantees the shortest path"],
    ["bidirectional-a-star", "Bidirectional A* is weighted and guarantees the shortest path if if our heuristic doesn't overestimate the distance"],
    ["random", "Random search searches the grid randomly without any purpose, so is unweighted and guarantees nothing"],
    ["bidirectional-random", "Random search running concurrently from both the start and goal nodes"]
]);

// Amount of time we wait when animating (lower value means faster animations)
const DELAY = 30;
 
// True if user is holding their mouse down, otherwise false
let isMouseDown: boolean;

// Send controller a message to execute some effect
let notifyController: (message: ViewMessages, arg: any) => void;

// When user is dragging a tile, will hold a reference to the element that is being dragged
let draggedFrom: HTMLTableCellElement;

export function initView(notif: (message: ViewMessages, arg: any) => void) {
    notifyController = notif;
    isMouseDown = false;

    initGenericGridInDOM("#grid", HEIGHT, WIDTH, HEIGHT_PIXELS, WIDTH_PIXELS, BACKGROUND_COLOR);
    initEventListeners();

    renderStartTileInDOM(1, 1);
    notifyController(ViewMessages.SetStart, [1, 1]);

    renderGoalTileInDOM(HEIGHT - 2, WIDTH - 2);
    notifyController(ViewMessages.SetGoal, [HEIGHT - 2, WIDTH - 2]);
}

// Change the colour of the tile at coord to correspond to the path colour
export async function renderPathTileInDOM([row, col]: Coord) {
    await wait(DELAY);

    renderTileGeneric(row, col, FINAL_PATH_COLOR);
}

// Change the colour of the tile at coord to correspond to the searching colour
export async function renderSearchingTileInDOM([row, col]: Coord) {
    await wait(DELAY);

    renderTileGeneric(row, col, SEARCHING_COLOR);
}

// Change the colour of the tile at coord to correspond to the wall colour
export function renderWallTileInDOM([row, col]: Coord) {
    renderTileGeneric(row, col, WALL_COLOR);
}

// Change the colour of the tile at coord to correspond to the default colour
export function renderBlankTileInDOM([row, col]: Coord) {
    renderTileGeneric(row, col, BACKGROUND_COLOR);
}

// Change the colour of the tile at coord to correspond to the frontier colour
export async function renderFrontierInDOM([row, col]: Coord) {
    if (!isSearching(getTileInDOM(row, col))) {
        await wait(DELAY);

        renderTileGeneric(row, col, FRONTIER_COLOR);
    }
}

// Display a weight value on a tile
export async function renderWeightOnTileInDOM([row, col, weight]: [number, number, number]) {
    getTileInDOM(row, col).innerHTML = weight.toString();
}

// Clear a weight value from a tile
export async function removeWeightFromTileInDOM([row, col]: Coord) {
    getTileInDOM(row, col).innerHTML = "";
}

// Change the colour of the tile at coord to correspond to the start colour
function renderStartTileInDOM(row: number, col: number) {
    renderTileGeneric(row, col, START_COLOR);
}

// Change the colour of the tile at coord to correspond to the goal colour
function renderGoalTileInDOM(row: number, col: number) {
    renderTileGeneric(row, col, GOAL_COLOR);
}

// Generic function for rendering some colour on a tile
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
    getDOMElem("#block-type").addEventListener("change", updateWallType);
    getDOMElem("#select-algo").addEventListener("change", updateAlgoDescription);
    getDOMElem("#heuristic-type").addEventListener("change", updateHeuristic);
    getDOMElemList(".finish-tutorial").forEach(elem => elem.addEventListener("click", finishTutorial));
    getDOMElemList(".previous-page").forEach(elem => elem.addEventListener("click", previousPage));
    getDOMElemList(".next-page").forEach(elem => elem.addEventListener("click", nextPage));
}

function updateHeuristic(event) {
    const heuristicStr = event.target.value;

    notifyController(ViewMessages.SetHeuristic, heuristicStr);
}

// Go to previous modal page
function previousPage(event) {
    const prevPageButton = event.target;

    jumpPage(prevPageButton, curr => curr - 1);
}

// Go to next modal page
function nextPage(event) {
    const nextPageButton = event.target;

    jumpPage(nextPageButton, curr => curr + 1);
}

// Go to modal page specified by the function
function jumpPage(nextPageButton: HTMLButtonElement, pageJump: (curr: number) => number) {
    const currentModal = <HTMLDivElement> nextPageButton.parentNode;
    const currentPageNumber = parseNumbersFromString(currentModal.id);
    const nextPageNumber = pageJump(currentPageNumber);
    const nextModal = <HTMLDivElement> getDOMElem(`#modal${nextPageNumber}`);

    currentModal.style.visibility = "hidden";
    nextModal.style.visibility = "visible";
}

// Close all modals, allowing user to start using the app
function finishTutorial() {
    const restOfPageDOM = <HTMLDivElement> getDOMElem("#page");
    const tutorialModalDOM = <HTMLDivElement> getDOMElem("#modal-container");

    restOfPageDOM.style.opacity = "1";
    tutorialModalDOM.style.display = "none";
}

// When user selects a new algorithm, change description to that algorithm
function updateAlgoDescription(event) {
    const descriptionDOM = getDOMElem("#description");
    const algoStr = event.target.value;

    descriptionDOM.innerHTML = algoDescriptions.get(algoStr);
}

// When user selects a new wall type, notify the controller with the new type
function updateWallType(event) {
    notifyController(ViewMessages.SetWallType, event.target.value);
}

// Tell the controller to generate whichever type of maze user has selected
function generateWallPattern(event) {
    if (!event.target.disabled) {
        notifyController(ViewMessages.GenerateMaze, event.target.value);
    }
}

// Tell the controller to run whichever algorithm the user has selected
function runAlgo() {
    const algo = <HTMLSelectElement> getDOMElem("#select-algo");

    resetPath();
    notifyController(ViewMessages.RunAlgo, algo.value);
}

// Clear all the colours from the last algorithm run
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

// For each tile in grid, initialise all the event listeners needed
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

// Tell controller to activate a tile if user has their mouse on it (allows user to click on tiles)
function addTileMouseDownEventListener(row: number, col: number) {
    getTileInDOM(row, col).addEventListener("mousedown", () => {
        notifyController(ViewMessages.ActivateTile, [row, col]);
    });
}

// Tell controller to activate a tile if user has their mouse over it and mouse is currently down
// This allows user to drag their mouse along the grid and smoothly draw tiles
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



