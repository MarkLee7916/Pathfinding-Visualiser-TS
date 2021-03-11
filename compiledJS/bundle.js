(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.WIDTH = exports.HEIGHT = void 0;
var isWidescreen = window.matchMedia("(min-width: 992px)");
exports.HEIGHT = isWidescreen.matches ? 20 : 40;
exports.WIDTH = isWidescreen.matches ? 40 : 20;

},{}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var comparators_1 = require("../models/comparators");
var pathfinding_1 = require("../models/pathfinding");
var view_1 = require("../views/view");
// Map an HTML value representation of a pathfinding algorithm to an actual implementation
var algoStrToFunction = new Map([
    ["best-first-search", pathfinding_1.bestFirstSearch],
    ["breadth-first-search", pathfinding_1.breadthFirstSearch],
    ["depth-first-search", pathfinding_1.depthFirstSearch],
    ["a-star", pathfinding_1.astar],
    ["dijkstra", pathfinding_1.dijkstra],
    ["bidirectional-DFS", pathfinding_1.bidirectionalDFS],
    ["bidirectional-BFS", pathfinding_1.bidirectionalBFS],
    ["bidirectional-GBFS", pathfinding_1.bidirectionalBestFirstSearch],
    ["bidirectional-dijkstra", pathfinding_1.bidirectionalDijkstra],
    ["bidirectional-a-star", pathfinding_1.bidirectionalAstar],
    ["bidirectional-random", pathfinding_1.bidirectionalRandomSearch],
    ["random", pathfinding_1.randomSearch]
]);
// Map an HTML value representation of a wall type to a function that sets it to that wall type
var wallTypeStrToFunction = new Map([
    ["wall", pathfinding_1.setBlockTypeToWall],
    ["weight", pathfinding_1.setBlockTypeToWeight]
]);
// Map an HTML value representation of a maze generation algorithm to an actual implentation
var generateMazeStrToFunction = new Map([
    ["random-maze", pathfinding_1.randomMaze],
    ["divide-horizontal", pathfinding_1.divideHorizontal],
    ["divide-vertical", pathfinding_1.divideVertical]
]);
var heuristicStrToFunction = new Map([
    ["manhattan", function () { return comparators_1.setHeuristic(1 /* Manhattan */); }],
    ["chebyshev", function () { return comparators_1.setHeuristic(2 /* Chebyshev */); }],
    ["euclidean", function () { return comparators_1.setHeuristic(0 /* Euclidean */); }],
    ["combination", function () { return comparators_1.setHeuristic(3 /* Combination */); }]
]);
var viewMessageToAction = new Map([
    [0 /* ActivateTile */, function (content) { return pathfinding_1.toggleTile(content); }],
    [1 /* SetStart */, function (content) { return pathfinding_1.setStart(content); }],
    [2 /* SetGoal */, function (content) { return pathfinding_1.setGoal(content); }],
    [3 /* RunAlgo */, function (content) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, algoStrToFunction.get(content)()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }],
    [4 /* ResetBlocks */, function (_) { return pathfinding_1.resetWalls(); }],
    [5 /* GenerateMaze */, function (content) { return generateMazeStrToFunction.get(content)(); }],
    [6 /* SetWallType */, function (content) { return wallTypeStrToFunction.get(content)(); }],
    [7 /* SetHeuristic */, function (content) { return heuristicStrToFunction.get(content)(); }]
]);
var modelMessageToAction = new Map([
    [0 /* RenderPathTile */, function (content) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, view_1.renderPathTileInDOM(content)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }],
    [1 /* RenderSearching */, function (content) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, view_1.renderSearchingTileInDOM(content)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }],
    [2 /* RenderWall */, function (content) { return view_1.renderWallTileInDOM(content); }],
    [3 /* RemoveWall */, function (content) { return view_1.renderBlankTileInDOM(content); }],
    [6 /* RenderWeight */, function (content) { return view_1.renderWeightOnTileInDOM(content); }],
    [5 /* RemoveWeight */, function (content) { return view_1.removeWeightFromTileInDOM(content); }],
    [4 /* RenderFrontier */, function (content) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, view_1.renderFrontierInDOM(content)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }],
]);
// Callback that executes whenever the view wants to talk to the controller
function readMessageFromView(message, content) {
    return __awaiter(this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    action = viewMessageToAction.get(message);
                    if (!(action === undefined)) return [3 /*break*/, 1];
                    throw "Argument not supported: " + message;
                case 1: return [4 /*yield*/, action(content)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Callback that executes whenever the model wants to talk to the controller
function readMessageFromModel(message, content) {
    return __awaiter(this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    action = modelMessageToAction.get(message);
                    if (!(action === undefined)) return [3 /*break*/, 1];
                    throw "Argument not supported: " + message;
                case 1: return [4 /*yield*/, action(content)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
(function startProgram() {
    view_1.initView(readMessageFromView);
    pathfinding_1.initPathfinding(readMessageFromModel);
})();

},{"../models/comparators":3,"../models/pathfinding":6,"../views/view":12}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.generateRandomComparator = exports.generateDijkstraComparator = exports.generateAStarComparator = exports.generateHeuristic = exports.setHeuristic = void 0;
// Reference to the heuristic the user has selected
var currentHeuristic = generateManhattanComparator;
// Map a heuristic onto its implementation
var enumToFunction = new Map([
    [1 /* Manhattan */, generateManhattanComparator],
    [0 /* Euclidean */, generateEuclideanComparator],
    [2 /* Chebyshev */, generateChebyshevComparator],
    [3 /* Combination */, generateCombinationComparator]
]);
// Update the selected heuristic
function setHeuristic(heuristic) {
    currentHeuristic = enumToFunction.get(heuristic);
}
exports.setHeuristic = setHeuristic;
// Return whichever heuristic user has selected
function generateHeuristic(goal) {
    return currentHeuristic(goal);
}
exports.generateHeuristic = generateHeuristic;
// Since all heuristics are admissable, we can take max of all of them to produce an optimal heuristic
function generateCombinationComparator(goal) {
    return function (node1, node2) {
        var chebyshevHeuristic = generateChebyshevComparator(goal)(node1, node2);
        var manhattanHeuristic = generateManhattanComparator(goal)(node1, node2);
        var euclideanHeuristic = generateEuclideanComparator(goal)(node1, node2);
        return Math.max(chebyshevHeuristic, manhattanHeuristic, euclideanHeuristic);
    };
}
// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula max(abs(p1 - g1), abs(p2 - g2))
function generateChebyshevComparator(_a) {
    var goalRow = _a[0], goalCol = _a[1];
    return function (node1, node2) {
        var _a = node1.val(), r1 = _a[0], c1 = _a[1];
        var _b = node2.val(), r2 = _b[0], c2 = _b[1];
        return Math.max(Math.abs(r2 - goalRow), Math.abs(c2 - goalCol)) - Math.max(Math.abs(r1 - goalRow), Math.abs(c1 - goalCol));
    };
}
// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula sqrt((p1 - g1)^2 + abs(p2 - g2)^2)
function generateEuclideanComparator(_a) {
    var goalRow = _a[0], goalCol = _a[1];
    return function (node1, node2) {
        var _a = node1.val(), r1 = _a[0], c1 = _a[1];
        var _b = node2.val(), r2 = _b[0], c2 = _b[1];
        var r1Dist = Math.sqrt(Math.pow(r1 - goalRow, 2) + Math.pow(c1 - goalCol, 2));
        var r2Dist = Math.sqrt(Math.pow(r2 - goalRow, 2) + Math.pow(c2 - goalCol, 2));
        return r2Dist - r1Dist;
    };
}
// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula abs(p1 - g1) + abs(p2 - g2) 
function generateManhattanComparator(_a) {
    var goalRow = _a[0], goalCol = _a[1];
    return function (node1, node2) {
        var _a = node1.val(), r1 = _a[0], c1 = _a[1];
        var _b = node2.val(), r2 = _b[0], c2 = _b[1];
        return (Math.abs(r2 - goalRow) + Math.abs(c2 - goalCol)) - (Math.abs(r1 - goalRow) + Math.abs(c1 - goalCol));
    };
}
// Return a comparator that combines a goal based heuristic with a lowest weights heuristic
function generateAStarComparator(goal) {
    return function (node1, node2) {
        var dijkstraHeuristic = generateDijkstraComparator()(node1, node2);
        var goalHeuristic = currentHeuristic(goal)(node1, node2);
        return dijkstraHeuristic + goalHeuristic;
    };
}
exports.generateAStarComparator = generateAStarComparator;
// Return a comparator that implements a heuristic that is biased in favour of the lowest weight nodes
function generateDijkstraComparator() {
    return function (node1, node2) { return node2.dist() - node1.dist(); };
}
exports.generateDijkstraComparator = generateDijkstraComparator;
function generateRandomComparator() {
    return function (x, y) { return Math.random() - 0.6; };
}
exports.generateRandomComparator = generateRandomComparator;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Grid = void 0;
var constants_1 = require("../controllers/constants");
var utils_1 = require("./utils");
var Grid = /** @class */ (function () {
    function Grid() {
        this.grid = utils_1.generateGrid(false);
    }
    Grid.prototype.has = function (_a) {
        var row = _a[0], col = _a[1];
        if (this.isOutOfBounds([row, col])) {
            return false;
        }
        else {
            return this.grid[row][col];
        }
    };
    // Return true if the given grids have any tiles in common filled in
    Grid.hasIntersection = function (grid, matrix) {
        var _a = Grid.intersection(grid, matrix), row = _a[0], col = _a[1];
        return row !== -1 && col !== -1;
    };
    // Return the coordinates of the tiles that the given grids both have filled in
    Grid.intersection = function (grid, matrix) {
        for (var row = 0; row < constants_1.HEIGHT; row++) {
            for (var col = 0; col < constants_1.WIDTH; col++) {
                var coord = [row, col];
                if (grid.has(coord) && matrix.has(coord)) {
                    return coord;
                }
            }
        }
        return [-1, -1];
    };
    Grid.prototype.fill = function (_a) {
        var row = _a[0], col = _a[1];
        if (this.isOutOfBounds([row, col])) {
            throw "Invalid arguments, must be within bounds of grid. Supplied args were row: " + row + " col: " + col;
        }
        this.grid[row][col] = true;
    };
    Grid.prototype.unfill = function (_a) {
        var row = _a[0], col = _a[1];
        if (this.isOutOfBounds([row, col])) {
            throw "Invalid arguments, must be within bounds of grid. Supplied args were row: " + row + " col: " + col;
        }
        this.grid[row][col] = false;
    };
    Grid.prototype.isOutOfBounds = function (_a) {
        var row = _a[0], col = _a[1];
        return row < 0 || col < 0 || row >= constants_1.HEIGHT || col >= constants_1.WIDTH;
    };
    return Grid;
}());
exports.Grid = Grid;

},{"../controllers/constants":1,"./utils":10}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.HashMap = void 0;
// Adapter pattern implementation of a hashmap to allow arbritrary objects as keys
var HashMap = /** @class */ (function () {
    function HashMap() {
        this.map = new Map();
    }
    HashMap.prototype.add = function (key, val) {
        this.map.set(JSON.stringify(key), val);
    };
    HashMap.prototype.get = function (key) {
        return this.map.get(JSON.stringify(key));
    };
    return HashMap;
}());
exports.HashMap = HashMap;

},{}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.divideHorizontal = exports.divideVertical = exports.bidirectionalAstar = exports.bidirectionalRandomSearch = exports.bidirectionalDijkstra = exports.bidirectionalBestFirstSearch = exports.bidirectionalBFS = exports.bidirectionalDFS = exports.setBlockTypeToWeight = exports.setBlockTypeToWall = exports.randomMaze = exports.randomSearch = exports.dijkstra = exports.astar = exports.bestFirstSearch = exports.breadthFirstSearch = exports.depthFirstSearch = exports.resetWalls = exports.setGoal = exports.setStart = exports.toggleTile = exports.initPathfinding = void 0;
var grid_1 = require("./grid");
var hashMap_1 = require("./hashMap");
var priorityQueue_1 = require("./priorityQueue");
var stack_1 = require("./stack");
var queue_1 = require("./queue");
var constants_1 = require("../controllers/constants");
var vertice_1 = require("./vertice");
var utils_1 = require("./utils");
var comparators_1 = require("./comparators");
// Keeps track of where the pathfinding algos can't cross
var walls = new grid_1.Grid();
// Keeps track of which tiles are weighted
var weights = utils_1.generateGrid(1);
// Allows us to tell the controller to execute some effect
var notifyController;
// Coordinate of the starting tile 
var start;
// Coordinate of the goal tile
var goal;
// Allows us to generically place either a weight or a wall
var tilePlacementFunc = toggleWall;
function initPathfinding(notif) {
    notifyController = notif;
}
exports.initPathfinding = initPathfinding;
// Wrapper around tilePlacementFunc to avoid having to expose mutable state
function toggleTile(coord) {
    tilePlacementFunc(coord);
}
exports.toggleTile = toggleTile;
function setStart(coord) {
    start = coord;
}
exports.setStart = setStart;
function setGoal(coord) {
    goal = coord;
}
exports.setGoal = setGoal;
// Remove all weights and walls
function resetWalls() {
    for (var row = 0; row < constants_1.HEIGHT; row++) {
        for (var col = 0; col < constants_1.WIDTH; col++) {
            var coord = [row, col];
            if (walls.has(coord)) {
                toggleWall(coord);
            }
            if (weights[row][col] !== 1) {
                toggleWeight(coord);
            }
        }
    }
}
exports.resetWalls = resetWalls;
function depthFirstSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var stack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stack = new stack_1.Stack();
                    return [4 /*yield*/, genericUnidirectionalSearch(stack, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.depthFirstSearch = depthFirstSearch;
function breadthFirstSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var queue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queue = new queue_1.Queue();
                    return [4 /*yield*/, genericUnidirectionalSearch(queue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.breadthFirstSearch = breadthFirstSearch;
function bestFirstSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var gridComparator, priorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gridComparator = comparators_1.generateHeuristic(goal);
                    priorityQueue = new priorityQueue_1.PriorityQueue(gridComparator);
                    return [4 /*yield*/, genericUnidirectionalSearch(priorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bestFirstSearch = bestFirstSearch;
function astar() {
    return __awaiter(this, void 0, void 0, function () {
        var gridComparator, priorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gridComparator = comparators_1.generateAStarComparator(goal);
                    priorityQueue = new priorityQueue_1.PriorityQueue(gridComparator);
                    return [4 /*yield*/, genericUnidirectionalSearch(priorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.astar = astar;
function dijkstra() {
    return __awaiter(this, void 0, void 0, function () {
        var gridComparator, priorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gridComparator = comparators_1.generateDijkstraComparator();
                    priorityQueue = new priorityQueue_1.PriorityQueue(gridComparator);
                    return [4 /*yield*/, genericUnidirectionalSearch(priorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.dijkstra = dijkstra;
function randomSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var randomComparator, priorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomComparator = comparators_1.generateRandomComparator();
                    priorityQueue = new priorityQueue_1.PriorityQueue(randomComparator);
                    return [4 /*yield*/, genericUnidirectionalSearch(priorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.randomSearch = randomSearch;
// Reset walls and generate a random maze of whatever wall type user has selected
function randomMaze() {
    resetWalls();
    for (var row = 0; row < constants_1.HEIGHT; row++) {
        fillRowRandomly(row);
    }
}
exports.randomMaze = randomMaze;
function setBlockTypeToWall() {
    tilePlacementFunc = toggleWall;
}
exports.setBlockTypeToWall = setBlockTypeToWall;
function setBlockTypeToWeight() {
    tilePlacementFunc = toggleWeight;
}
exports.setBlockTypeToWeight = setBlockTypeToWeight;
function bidirectionalDFS() {
    return __awaiter(this, void 0, void 0, function () {
        var forwardStack, backwardStack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forwardStack = new stack_1.Stack();
                    backwardStack = new stack_1.Stack();
                    return [4 /*yield*/, genericBidirectionalSearch(forwardStack, backwardStack, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalDFS = bidirectionalDFS;
function bidirectionalBFS() {
    return __awaiter(this, void 0, void 0, function () {
        var forwardQueue, backwardQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forwardQueue = new queue_1.Queue();
                    backwardQueue = new queue_1.Queue();
                    return [4 /*yield*/, genericBidirectionalSearch(forwardQueue, backwardQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalBFS = bidirectionalBFS;
function bidirectionalBestFirstSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var forwardsComparator, backwardsComparator, forwardPriorityQueue, backwardPriorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forwardsComparator = comparators_1.generateHeuristic(goal);
                    backwardsComparator = comparators_1.generateHeuristic(start);
                    forwardPriorityQueue = new priorityQueue_1.PriorityQueue(forwardsComparator);
                    backwardPriorityQueue = new priorityQueue_1.PriorityQueue(backwardsComparator);
                    return [4 /*yield*/, genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalBestFirstSearch = bidirectionalBestFirstSearch;
function bidirectionalDijkstra() {
    return __awaiter(this, void 0, void 0, function () {
        var gridComparator, forwardPriorityQueue, backwardPriorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gridComparator = comparators_1.generateDijkstraComparator();
                    forwardPriorityQueue = new priorityQueue_1.PriorityQueue(gridComparator);
                    backwardPriorityQueue = new priorityQueue_1.PriorityQueue(gridComparator);
                    return [4 /*yield*/, genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalDijkstra = bidirectionalDijkstra;
function bidirectionalRandomSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var randomComparator, forwardPriorityQueue, backwardPriorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomComparator = comparators_1.generateRandomComparator();
                    forwardPriorityQueue = new priorityQueue_1.PriorityQueue(randomComparator);
                    backwardPriorityQueue = new priorityQueue_1.PriorityQueue(randomComparator);
                    return [4 /*yield*/, genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalRandomSearch = bidirectionalRandomSearch;
function bidirectionalAstar() {
    return __awaiter(this, void 0, void 0, function () {
        var forwardsComparator, backwardsComparator, forwardPriorityQueue, backwardPriorityQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forwardsComparator = comparators_1.generateAStarComparator(goal);
                    backwardsComparator = comparators_1.generateAStarComparator(start);
                    forwardPriorityQueue = new priorityQueue_1.PriorityQueue(forwardsComparator);
                    backwardPriorityQueue = new priorityQueue_1.PriorityQueue(backwardsComparator);
                    return [4 /*yield*/, genericBidirectionalSearch(forwardPriorityQueue, backwardPriorityQueue, weights)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.bidirectionalAstar = bidirectionalAstar;
// Reset walls and generate a vertical maze of whatever wall type user has selected
function divideVertical() {
    resetWalls();
    divideVertically(0, 0, constants_1.HEIGHT, constants_1.WIDTH);
}
exports.divideVertical = divideVertical;
// Reset walls and generate a horizontal maze of whatever wall type user has selected
function divideHorizontal() {
    resetWalls();
    divideHorizontally(0, 0, constants_1.HEIGHT, constants_1.WIDTH);
}
exports.divideHorizontal = divideHorizontal;
// Algorithm for generating a vertical maze
function divideVertically(baseRow, baseCol, height, width) {
    if (width > 2 && height > 2) {
        var upperCol = baseCol + width;
        var upperRow = baseRow + height;
        var wallCol = utils_1.randomIntBetween(baseCol + 1, upperCol - 1);
        var hole = utils_1.randomIntBetween(baseRow, upperRow);
        for (var row = baseRow; row < upperRow; row++) {
            if (row !== hole) {
                toggleTile([row, wallCol]);
            }
        }
        divideVertically(baseRow, baseCol, height, (wallCol - baseCol) - 1);
        divideVertically(baseRow, wallCol + 1, height, (baseCol + width - wallCol) - 1);
    }
}
// Algorithm for generating a horizontal maze
function divideHorizontally(baseRow, baseCol, height, width) {
    if (width > 2 && height > 2) {
        var upperRow = baseRow + height;
        var upperCol = baseCol + width;
        var wallRow = utils_1.randomIntBetween(baseRow + 1, upperRow - 1);
        var hole = utils_1.randomIntBetween(baseCol, upperCol);
        for (var col = baseCol; col < upperCol; col++) {
            if (col !== hole) {
                toggleTile([wallRow, col]);
            }
        }
        divideHorizontally(baseRow, baseCol, (wallRow - baseRow) - 1, width);
        divideHorizontally(wallRow + 1, baseCol, (baseRow + height - wallRow) - 1, width);
    }
}
// If there's a wall at coord, remove it. Else, add a wall there
function toggleWall(coord) {
    if (walls.has(coord)) {
        notifyController(3 /* RemoveWall */, coord);
        walls.unfill(coord);
    }
    else if (!isStart(coord) && !isGoal(coord)) {
        notifyController(2 /* RenderWall */, coord);
        walls.fill(coord);
    }
}
// If there's a weight at coord, remove it. Else, add a weight there
function toggleWeight(_a) {
    var row = _a[0], col = _a[1];
    var coord = [row, col];
    if (weights[row][col] !== 1) {
        notifyController(5 /* RemoveWeight */, coord);
        weights[row][col] = 1;
    }
    else if (!isStart(coord) && !isGoal(coord)) {
        var weight = utils_1.randomIntBetween(10, 100);
        notifyController(6 /* RenderWeight */, [row, col, weight]);
        weights[row][col] = weight;
    }
}
// Generic pathfinding algo for searching from a source. Parameterized with the data structure used to make it generic
function genericUnidirectionalSearch(coords, weights) {
    return __awaiter(this, void 0, void 0, function () {
        var path, visited, considered, startVertice, isFound;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = new hashMap_1.HashMap();
                    visited = new grid_1.Grid();
                    considered = new grid_1.Grid();
                    startVertice = new vertice_1.Vertice(start);
                    startVertice.updateDist(0);
                    coords.add(startVertice);
                    visited.fill(start);
                    _a.label = 1;
                case 1:
                    if (!!coords.isEmpty()) return [3 /*break*/, 5];
                    return [4 /*yield*/, considerNextNode(path, visited, coords, goal, weights, considered)];
                case 2:
                    isFound = _a.sent();
                    if (!isFound) return [3 /*break*/, 4];
                    return [4 /*yield*/, renderFinalPath(path, goal)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Generic pathfinding algo for searching from both the source and goal concurrently
function genericBidirectionalSearch(forwardsNodes, backwardsNodes, weights) {
    return __awaiter(this, void 0, void 0, function () {
        var forwardsPath, backwardsPath, forwardsVisited, backwardsVisited, forwardsConsidered, backwardsConsidered, startVertice, goalVertice, foundForwards, foundBackwards, intersection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    forwardsPath = new hashMap_1.HashMap();
                    backwardsPath = new hashMap_1.HashMap();
                    forwardsVisited = new grid_1.Grid();
                    backwardsVisited = new grid_1.Grid();
                    forwardsConsidered = new grid_1.Grid();
                    backwardsConsidered = new grid_1.Grid();
                    startVertice = new vertice_1.Vertice(start);
                    goalVertice = new vertice_1.Vertice(goal);
                    startVertice.updateDist(0);
                    goalVertice.updateDist(0);
                    forwardsNodes.add(startVertice);
                    backwardsNodes.add(goalVertice);
                    forwardsVisited.fill(start);
                    backwardsVisited.fill(goal);
                    _a.label = 1;
                case 1:
                    if (!(!forwardsNodes.isEmpty() && !backwardsNodes.isEmpty())) return [3 /*break*/, 11];
                    return [4 /*yield*/, considerNextNode(forwardsPath, forwardsVisited, forwardsNodes, goal, weights, forwardsConsidered)];
                case 2:
                    foundForwards = _a.sent();
                    return [4 /*yield*/, considerNextNode(backwardsPath, backwardsVisited, backwardsNodes, start, weights, backwardsConsidered)];
                case 3:
                    foundBackwards = _a.sent();
                    if (!foundForwards) return [3 /*break*/, 5];
                    return [4 /*yield*/, renderFinalPath(forwardsPath, goal)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 5:
                    if (!foundBackwards) return [3 /*break*/, 7];
                    return [4 /*yield*/, renderFinalPath(backwardsPath, start)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    if (!grid_1.Grid.hasIntersection(forwardsConsidered, backwardsConsidered)) return [3 /*break*/, 10];
                    intersection = grid_1.Grid.intersection(forwardsConsidered, backwardsConsidered);
                    return [4 /*yield*/, renderFinalPath(forwardsPath, intersection)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, renderFinalPath(backwardsPath, intersection)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10: return [3 /*break*/, 1];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Generic function for making one step in a pathfinding algorithm
function considerNextNode(path, visited, nodes, target, weights, considered) {
    return __awaiter(this, void 0, void 0, function () {
        var currentPos, currentNeighbours;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentPos = nodes.remove();
                    currentNeighbours = generateNeighbours(currentPos.val());
                    considered.fill(currentPos.val());
                    return [4 /*yield*/, notifyController(1 /* RenderSearching */, currentPos.val())];
                case 1:
                    _a.sent();
                    if (isSameCoord(currentPos.val(), target)) {
                        return [2 /*return*/, true];
                    }
                    currentNeighbours.forEach(function (neighbour) {
                        if (!walls.isOutOfBounds(neighbour) && !walls.has(neighbour)) {
                            var neighbourRow = neighbour[0], neighbourCol = neighbour[1];
                            var newNeighbourDistance = currentPos.dist() + weights[neighbourRow][neighbourCol];
                            if (!visited.has(neighbour)) {
                                var neighbourVertice = new vertice_1.Vertice(neighbour);
                                notifyController(4 /* RenderFrontier */, neighbour);
                                neighbourVertice.updateDist(newNeighbourDistance);
                                nodes.add(neighbourVertice);
                                visited.fill(neighbour);
                                path.add(neighbour, currentPos.val());
                            }
                            else {
                                var vertice = nodes.find(function (vertice) { return isSameCoord(vertice.val(), neighbour); });
                                if (vertice !== undefined && newNeighbourDistance < vertice.dist()) {
                                    vertice.updateDist(newNeighbourDistance);
                                    path.add(neighbour, currentPos.val());
                                }
                            }
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Fill some tiles in a row while leaving others
function fillRowRandomly(row) {
    var randomComparator = function (x, y) { return Math.random() - 0.5; };
    var priorityQueue = new priorityQueue_1.PriorityQueue(randomComparator);
    var density = 4;
    for (var col = 0; col < constants_1.WIDTH; col++) {
        priorityQueue.add(col);
    }
    for (var i = 0; i < constants_1.WIDTH / density; i++) {
        var wallCoord = [row, priorityQueue.remove()];
        if (!isGoal(wallCoord) && !isStart(wallCoord) && !walls.has(wallCoord)) {
            toggleTile(wallCoord);
        }
    }
}
function isSameCoord(_a, _b) {
    var row = _a[0], col = _a[1];
    var targRow = _b[0], targCol = _b[1];
    return row === targRow && col === targCol;
}
function isStart(_a) {
    var row = _a[0], col = _a[1];
    var startRow = start[0], startCol = start[1];
    return row === startRow && col === startCol;
}
function isGoal(_a) {
    var row = _a[0], col = _a[1];
    var goalRow = goal[0], goalCol = goal[1];
    return row === goalRow && col === goalCol;
}
// Tell controller to display the final path
function renderFinalPath(path, target) {
    return __awaiter(this, void 0, void 0, function () {
        var pos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pos = target;
                    _a.label = 1;
                case 1:
                    if (!(path.get(pos) !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, notifyController(0 /* RenderPathTile */, pos)];
                case 2:
                    _a.sent();
                    pos = path.get(pos);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get all nodes one step away from a given node (diagonals not considered)
function generateNeighbours(_a) {
    var row = _a[0], col = _a[1];
    var neighbours = [];
    addToNeighbours(neighbours, [row + 1, col]);
    addToNeighbours(neighbours, [row - 1, col]);
    addToNeighbours(neighbours, [row, col + 1]);
    addToNeighbours(neighbours, [row, col - 1]);
    return neighbours;
}
function addToNeighbours(neighbours, pos) {
    if (!walls.isOutOfBounds(pos)) {
        neighbours.push(pos);
    }
}

},{"../controllers/constants":1,"./comparators":3,"./grid":4,"./hashMap":5,"./priorityQueue":7,"./queue":8,"./stack":9,"./utils":10,"./vertice":11}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.PriorityQueue = void 0;
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue(cmp) {
        this.compare = cmp;
        this.size = 0;
        this.heap = [];
    }
    PriorityQueue.prototype.leftChild = function (currNode) {
        return 2 * currNode + 1;
    };
    PriorityQueue.prototype.rightChild = function (currNode) {
        return 2 * currNode + 2;
    };
    PriorityQueue.prototype.parent = function (currNode) {
        return Math.floor((currNode + 1) / 2) - 1;
    };
    PriorityQueue.prototype.isValidLeftChild = function (curr) {
        return this.leftChild(curr) < this.size && this.compare(this.heap[curr], this.heap[this.leftChild(curr)]) < 0;
    };
    PriorityQueue.prototype.isValidRightChild = function (curr) {
        return this.rightChild(curr) < this.size && this.compare(this.heap[curr], this.heap[this.rightChild(curr)]) < 0;
    };
    PriorityQueue.prototype.isValidParent = function (curr) {
        return curr > 0 && this.compare(this.heap[curr], this.heap[this.parent(curr)]) > 0;
    };
    // Move element downwards into its proper heap position
    PriorityQueue.prototype.floatDown = function () {
        var curr = 0;
        var min;
        while (this.isValidLeftChild(curr) || this.isValidRightChild(curr)) {
            var left = this.leftChild(curr);
            var right = this.rightChild(curr);
            if (right >= this.size) {
                min = left;
            }
            else {
                if (this.compare(this.heap[left], this.heap[right]) > 0) {
                    min = left;
                }
                else {
                    min = right;
                }
            }
            this.swap(curr, min);
            curr = min;
        }
    };
    // Move element upwards into its proper heap position
    PriorityQueue.prototype.floatUp = function () {
        var curr = this.size - 1;
        while (this.isValidParent(curr)) {
            var parentNode = this.parent(curr);
            this.swap(curr, parentNode);
            curr = parentNode;
        }
    };
    // Exchange positions of two elements in the heap array
    PriorityQueue.prototype.swap = function (i, j) {
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    };
    PriorityQueue.prototype.find = function (predicate) {
        return this.heap.find(predicate);
    };
    // Add new item to bottom of heap and move into its appropiate place 
    PriorityQueue.prototype.add = function (elem) {
        this.size++;
        this.heap[this.size - 1] = elem;
        this.floatUp();
    };
    // Remove max item from heap and return it
    PriorityQueue.prototype.remove = function () {
        if (this.size === 0) {
            throw "Can't poll from empty queue";
        }
        var max = this.heap[0];
        this.swap(0, this.size - 1);
        this.heap.length--;
        this.size--;
        this.floatDown();
        return max;
    };
    PriorityQueue.prototype.isEmpty = function () {
        return this.size === 0;
    };
    return PriorityQueue;
}());
exports.PriorityQueue = PriorityQueue;

},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Queue = void 0;
// A wrapper around the default list to implement the collection interface
var Queue = /** @class */ (function () {
    function Queue() {
        this.queue = [];
    }
    Queue.prototype.add = function (item) {
        this.queue.push(item);
    };
    Queue.prototype.find = function (predicate) {
        return this.queue.find(predicate);
    };
    Queue.prototype.remove = function () {
        return this.queue.shift();
    };
    Queue.prototype.isEmpty = function () {
        return this.queue.length === 0;
    };
    return Queue;
}());
exports.Queue = Queue;

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Stack = void 0;
// A wrapper around the default list to implement the collection interface
var Stack = /** @class */ (function () {
    function Stack() {
        this.stack = [];
    }
    Stack.prototype.add = function (item) {
        this.stack.push(item);
    };
    Stack.prototype.find = function (predicate) {
        return this.stack.find(predicate);
    };
    Stack.prototype.remove = function () {
        return this.stack.pop();
    };
    Stack.prototype.isEmpty = function () {
        return this.stack.length === 0;
    };
    return Stack;
}());
exports.Stack = Stack;

},{}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.parseNumbersFromString = exports.randomIntBetween = exports.generateGrid = void 0;
var constants_1 = require("../controllers/constants");
function generateGrid(input) {
    var grid = [];
    for (var row = 0; row < constants_1.HEIGHT; row++) {
        grid.push([]);
        for (var col = 0; col < constants_1.WIDTH; col++) {
            grid[row].push(input);
        }
    }
    return grid;
}
exports.generateGrid = generateGrid;
// Generate a random integer between lower (inclusive) and upper (not inclusive)
function randomIntBetween(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}
exports.randomIntBetween = randomIntBetween;
function parseNumbersFromString(str) {
    var numbersOnly = Array.from(str).filter(function (char) { return !isNaN(parseInt(char)); });
    var numberStr = numbersOnly.join("");
    return parseInt(numberStr);
}
exports.parseNumbersFromString = parseNumbersFromString;

},{"../controllers/constants":1}],11:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Vertice = void 0;
var Vertice = /** @class */ (function () {
    function Vertice(data) {
        this.distance = Infinity;
        this.data = data;
    }
    Vertice.prototype.updateDist = function (newDist) {
        this.distance = newDist;
    };
    Vertice.prototype.dist = function () {
        return this.distance;
    };
    Vertice.prototype.val = function () {
        return this.data;
    };
    return Vertice;
}());
exports.Vertice = Vertice;

},{}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.removeWeightFromTileInDOM = exports.renderWeightOnTileInDOM = exports.renderFrontierInDOM = exports.renderBlankTileInDOM = exports.renderWallTileInDOM = exports.renderSearchingTileInDOM = exports.renderPathTileInDOM = exports.initView = void 0;
var constants_1 = require("../controllers/constants");
var utils_1 = require("../models/utils");
var viewUtils_1 = require("./viewUtils");
var BACKGROUND_COLOR = "rgb(255, 255, 255)";
var FINAL_PATH_COLOR = "rgb(245, 209, 66)";
var SEARCHING_COLOR = "rgb(3, 148, 252)";
var START_COLOR = "rgb(255, 80, 80)";
var GOAL_COLOR = "rgb(235, 145, 9)";
var WALL_COLOR = "rgb(128,128,128)";
var FRONTIER_COLOR = "rgb(115, 240, 161)";
var HEIGHT_PIXELS = window.innerHeight * 0.7;
var WIDTH_PIXELS = HEIGHT_PIXELS * (constants_1.WIDTH / constants_1.HEIGHT);
// Map an algorithm onto its description
var algoDescriptions = new Map([
    ["best-first-search", "Best first search is entirely heuristic based, so is unweighted and doesn't guarantee the shortest path"],
    ["a-star", "A* combines heuristics and lowest weight path, so guarantees the shortest path if our heuristic doesn't overestimate the distance"],
    ["depth-first-search", "DFS always considers the most recent node it's seen, so is unweighted and doesn't guarantee shortest path"],
    ["breadth-first-search", "BFS always considers the least recent node it's seen, so is unweighted and guarantees shortest path"],
    ["dijkstra", "Dijkstra's always considers the lowest weight nodes, so is weighted and guarantees the shortest path"],
    ["bidirectional-BFS", "Bidirectional BFS does a BFS from both directions, so is unweighted and guarantees the shortest path"],
    ["bidirectional-DFS", "Bidirectional DFS does a DFS from both directions, so is unweighted and doesn't guarantee shortest path"],
    ["bidirectional-GBFS", "Bidirectional GBFS runs from both directions, so is unweighted and doesn't guarantee the shortest path"],
    ["bidirectional-dijkstra", "Bidirectional Dijkstra's runs from both directions, so is weighted and guarantees the shortest path"],
    ["bidirectional-a-star", "Bidirectional A* is weighted and guarantees the shortest path if our heuristic doesn't overestimate the distance"],
    ["random", "Random search searches the grid randomly without any purpose, so is unweighted and guarantees nothing"],
    ["bidirectional-random", "Random search running concurrently from both the start and goal nodes"]
]);
// Amount of time we wait when animating (lower value means faster animations)
var DELAY = 30;
// True if user is holding their mouse down, otherwise false
var isMouseDown;
// Send controller a message to execute some effect
var notifyController;
// When user is dragging a tile, will hold a reference to the element that is being dragged
var draggedFrom;
function initView(notif) {
    notifyController = notif;
    isMouseDown = false;
    viewUtils_1.initGenericGridInDOM("#grid", constants_1.HEIGHT, constants_1.WIDTH, HEIGHT_PIXELS, WIDTH_PIXELS, BACKGROUND_COLOR);
    initEventListeners();
    renderStartTileInDOM(1, 1);
    notifyController(1 /* SetStart */, [1, 1]);
    renderGoalTileInDOM(constants_1.HEIGHT - 2, constants_1.WIDTH - 2);
    notifyController(2 /* SetGoal */, [constants_1.HEIGHT - 2, constants_1.WIDTH - 2]);
}
exports.initView = initView;
// Change the colour of the tile at coord to correspond to the path colour
function renderPathTileInDOM(_a) {
    var row = _a[0], col = _a[1];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, viewUtils_1.wait(DELAY)];
                case 1:
                    _b.sent();
                    renderTileGeneric(row, col, FINAL_PATH_COLOR);
                    return [2 /*return*/];
            }
        });
    });
}
exports.renderPathTileInDOM = renderPathTileInDOM;
// Change the colour of the tile at coord to correspond to the searching colour
function renderSearchingTileInDOM(_a) {
    var row = _a[0], col = _a[1];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, viewUtils_1.wait(DELAY)];
                case 1:
                    _b.sent();
                    renderTileGeneric(row, col, SEARCHING_COLOR);
                    return [2 /*return*/];
            }
        });
    });
}
exports.renderSearchingTileInDOM = renderSearchingTileInDOM;
// Change the colour of the tile at coord to correspond to the wall colour
function renderWallTileInDOM(_a) {
    var row = _a[0], col = _a[1];
    renderTileGeneric(row, col, WALL_COLOR);
}
exports.renderWallTileInDOM = renderWallTileInDOM;
// Change the colour of the tile at coord to correspond to the default colour
function renderBlankTileInDOM(_a) {
    var row = _a[0], col = _a[1];
    renderTileGeneric(row, col, BACKGROUND_COLOR);
}
exports.renderBlankTileInDOM = renderBlankTileInDOM;
// Change the colour of the tile at coord to correspond to the frontier colour
function renderFrontierInDOM(_a) {
    var row = _a[0], col = _a[1];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!isSearching(viewUtils_1.getTileInDOM(row, col))) return [3 /*break*/, 2];
                    return [4 /*yield*/, viewUtils_1.wait(DELAY)];
                case 1:
                    _b.sent();
                    renderTileGeneric(row, col, FRONTIER_COLOR);
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.renderFrontierInDOM = renderFrontierInDOM;
// Display a weight value on a tile
function renderWeightOnTileInDOM(_a) {
    var row = _a[0], col = _a[1], weight = _a[2];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            viewUtils_1.getTileInDOM(row, col).innerHTML = weight.toString();
            return [2 /*return*/];
        });
    });
}
exports.renderWeightOnTileInDOM = renderWeightOnTileInDOM;
// Clear a weight value from a tile
function removeWeightFromTileInDOM(_a) {
    var row = _a[0], col = _a[1];
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            viewUtils_1.getTileInDOM(row, col).innerHTML = "";
            return [2 /*return*/];
        });
    });
}
exports.removeWeightFromTileInDOM = removeWeightFromTileInDOM;
// Change the colour of the tile at coord to correspond to the start colour
function renderStartTileInDOM(row, col) {
    renderTileGeneric(row, col, START_COLOR);
}
// Change the colour of the tile at coord to correspond to the goal colour
function renderGoalTileInDOM(row, col) {
    renderTileGeneric(row, col, GOAL_COLOR);
}
// Generic function for rendering some colour on a tile
function renderTileGeneric(row, col, color) {
    var tile = viewUtils_1.getTileInDOM(row, col);
    if (!isStart(tile) && !isGoal(tile)) {
        viewUtils_1.getTileInDOM(row, col).style.backgroundColor = color;
    }
}
function initEventListeners() {
    initMouseDetectionEventListeners();
    initEventListenersForGrid();
    initPreventDefaultDragEventListener();
    initMenuEventListeners();
}
function initMenuEventListeners() {
    viewUtils_1.getDOMElem("#run-algo").addEventListener("click", runAlgo);
    viewUtils_1.getDOMElem("#reset-walls").addEventListener("click", function () { return notifyController(4 /* ResetBlocks */, null); });
    viewUtils_1.getDOMElem("#reset-path").addEventListener("click", resetPath);
    viewUtils_1.getDOMElem("#wall-pattern").addEventListener("change", generateWallPattern);
    viewUtils_1.getDOMElem("#block-type").addEventListener("change", updateWallType);
    viewUtils_1.getDOMElem("#select-algo").addEventListener("change", updateAlgoDescription);
    viewUtils_1.getDOMElem("#heuristic-type").addEventListener("change", updateHeuristic);
    viewUtils_1.getDOMElemList(".finish-tutorial").forEach(function (elem) { return elem.addEventListener("click", finishTutorial); });
    viewUtils_1.getDOMElemList(".previous-page").forEach(function (elem) { return elem.addEventListener("click", previousPage); });
    viewUtils_1.getDOMElemList(".next-page").forEach(function (elem) { return elem.addEventListener("click", nextPage); });
}
function updateHeuristic(event) {
    var heuristicStr = event.target.value;
    notifyController(7 /* SetHeuristic */, heuristicStr);
}
// Go to previous modal page
function previousPage(event) {
    var prevPageButton = event.target;
    jumpPage(prevPageButton, function (curr) { return curr - 1; });
}
// Go to next modal page
function nextPage(event) {
    var nextPageButton = event.target;
    jumpPage(nextPageButton, function (curr) { return curr + 1; });
}
// Go to modal page specified by the function
function jumpPage(nextPageButton, pageJump) {
    var currentModal = nextPageButton.parentNode;
    var currentPageNumber = utils_1.parseNumbersFromString(currentModal.id);
    var nextPageNumber = pageJump(currentPageNumber);
    var nextModal = viewUtils_1.getDOMElem("#modal" + nextPageNumber);
    currentModal.style.visibility = "hidden";
    nextModal.style.visibility = "visible";
}
// Close all modals, allowing user to start using the app
function finishTutorial() {
    var restOfPageDOM = viewUtils_1.getDOMElem("#page");
    var tutorialModalDOM = viewUtils_1.getDOMElem("#modal-container");
    restOfPageDOM.style.opacity = "1";
    tutorialModalDOM.style.display = "none";
}
// When user selects a new algorithm, change description to that algorithm
function updateAlgoDescription(event) {
    var descriptionDOM = viewUtils_1.getDOMElem("#description");
    var algoStr = event.target.value;
    descriptionDOM.innerHTML = algoDescriptions.get(algoStr);
}
// When user selects a new wall type, notify the controller with the new type
function updateWallType(event) {
    notifyController(6 /* SetWallType */, event.target.value);
}
// Tell the controller to generate whichever type of maze user has selected
function generateWallPattern(event) {
    if (!event.target.disabled) {
        notifyController(5 /* GenerateMaze */, event.target.value);
    }
}
// Tell the controller to run whichever algorithm the user has selected
function runAlgo() {
    var algo = viewUtils_1.getDOMElem("#select-algo");
    resetPath();
    notifyController(3 /* RunAlgo */, algo.value);
}
// Clear all the colours from the last algorithm run
function resetPath() {
    for (var row = 0; row < constants_1.HEIGHT; row++) {
        for (var col = 0; col < constants_1.WIDTH; col++) {
            var tile = viewUtils_1.getTileInDOM(row, col);
            if (isSearching(tile) || isPath(tile) || isFrontier(tile)) {
                renderBlankTileInDOM([row, col]);
            }
        }
    }
}
// Prevent the drag default actions from occuring to allow proper drag and drop between tiles
function initPreventDefaultDragEventListener() {
    document.addEventListener("dragover", function (event) { return event.preventDefault(); }, false);
    document.addEventListener("dragenter", function (event) { return event.preventDefault(); }, false);
}
// Detect when user has their mouse down or mouse up to allow smooth drawing of walls
function initMouseDetectionEventListeners() {
    document.addEventListener("mousedown", function () { return isMouseDown = true; });
    document.addEventListener("mouseup", function () { return isMouseDown = false; });
}
// For each tile in grid, initialise all the event listeners needed
function initEventListenersForGrid() {
    for (var row = 0; row < constants_1.HEIGHT; row++) {
        for (var col = 0; col < constants_1.WIDTH; col++) {
            addTileMouseOverEventListener(row, col);
            addTileMouseDownEventListener(row, col);
            addTileDragEventListener(row, col);
            addTileDropEventListener(row, col);
        }
    }
}
// Allow dragging iff tile is a start or goal tile
function addTileDragEventListener(row, col) {
    var tile = viewUtils_1.getTileInDOM(row, col);
    tile.addEventListener("dragstart", function (event) {
        if (!isStart(tile) && !isGoal(tile)) {
            event.preventDefault();
        }
        else {
            isMouseDown = false;
            draggedFrom = tile;
        }
    });
}
// Allow dropping iff drag tile was a start or goal tile and the drop tile is blank
function addTileDropEventListener(dropRow, dropCol) {
    var droppedOn = viewUtils_1.getTileInDOM(dropRow, dropCol);
    droppedOn.addEventListener("drop", function (event) {
        if (isStart(draggedFrom) && isBlank(droppedOn)) {
            notifyController(1 /* SetStart */, [dropRow, dropCol]);
            viewUtils_1.swapTileColors(droppedOn, draggedFrom);
        }
        else if (isGoal(draggedFrom) && isBlank(droppedOn)) {
            notifyController(2 /* SetGoal */, [dropRow, dropCol]);
            viewUtils_1.swapTileColors(droppedOn, draggedFrom);
        }
        else if (isBlank(droppedOn)) {
            event.stopPropagation();
        }
    });
}
// Tell controller to activate a tile if user has their mouse on it (allows user to click on tiles)
function addTileMouseDownEventListener(row, col) {
    viewUtils_1.getTileInDOM(row, col).addEventListener("mousedown", function () {
        notifyController(0 /* ActivateTile */, [row, col]);
    });
}
// Tell controller to activate a tile if user has their mouse over it and mouse is currently down
// This allows user to drag their mouse along the grid and smoothly draw tiles
function addTileMouseOverEventListener(row, col) {
    viewUtils_1.getTileInDOM(row, col).addEventListener("mouseover", function () {
        if (isMouseDown) {
            notifyController(0 /* ActivateTile */, [row, col]);
        }
    });
}
function isStart(tile) {
    return viewUtils_1.isColor(tile, START_COLOR);
}
function isGoal(tile) {
    return viewUtils_1.isColor(tile, GOAL_COLOR);
}
function isBlank(tile) {
    return viewUtils_1.isColor(tile, BACKGROUND_COLOR);
}
function isPath(tile) {
    return viewUtils_1.isColor(tile, FINAL_PATH_COLOR);
}
function isSearching(tile) {
    return viewUtils_1.isColor(tile, SEARCHING_COLOR);
}
function isFrontier(tile) {
    return viewUtils_1.isColor(tile, FRONTIER_COLOR);
}

},{"../controllers/constants":1,"../models/utils":10,"./viewUtils":13}],13:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.swapTileColors = exports.isColor = exports.wait = exports.getTileInDOM = exports.initGenericGridInDOM = exports.getDOMElemList = exports.getDOMElem = void 0;
function getDOMElem(selector) {
    var elemDOM = document.querySelector(selector);
    if (elemDOM === null) {
        throw "Selector " + selector + " wasn't found in index.html";
    }
    else {
        return elemDOM;
    }
}
exports.getDOMElem = getDOMElem;
function getDOMElemList(selector) {
    var elemsDOM = document.querySelectorAll(selector);
    if (elemsDOM === null || elemsDOM.length === 0) {
        throw "Selector " + selector + " wasn't found in index.html";
    }
    else {
        return Array.from(elemsDOM).map(function (elem) { return elem; });
    }
}
exports.getDOMElemList = getDOMElemList;
function initGenericGridInDOM(selector, height, width, heightPixels, widthPixels, tileColor) {
    var elemDOM = getDOMElem(selector);
    for (var row = 0; row < height; row++) {
        elemDOM.append(createEmptyRowInDOM(height, width, heightPixels, widthPixels, tileColor));
    }
}
exports.initGenericGridInDOM = initGenericGridInDOM;
// Given a row and a column, return the tile indexed in the main grid
function getTileInDOM(row, col) {
    var gridDOM = getDOMElem("#grid");
    var rowDOM = rowDOMAt(gridDOM, row);
    var tileDOM = tileDOMAt(rowDOM, col);
    return tileDOM;
}
exports.getTileInDOM = getTileInDOM;
// Create a delay for the specified amount of time in millis
function wait(delayTime) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delayTime);
    });
}
exports.wait = wait;
function isColor(tile, color) {
    return tile.style.backgroundColor === color;
}
exports.isColor = isColor;
// Swap the colours of two tiles in the grid
function swapTileColors(tile, cell) {
    var temp = tile.style.backgroundColor;
    tile.style.backgroundColor = cell.style.backgroundColor;
    cell.style.backgroundColor = temp;
}
exports.swapTileColors = swapTileColors;
function createEmptyRowInDOM(height, width, heightPixels, widthPixels, tileColor) {
    var newRow = document.createElement("tr");
    newRow.className = "row";
    newRow.style.height = heightPixels / height + "px";
    newRow.style.width = widthPixels / width + "px";
    for (var col = 0; col < width; col++) {
        newRow.append(createEmptyTileInDOM(height, width, heightPixels, widthPixels, tileColor));
    }
    return newRow;
}
function createEmptyTileInDOM(height, width, heightPixels, widthPixels, tileColor) {
    var newTile = document.createElement("td");
    newTile.className = "tile";
    newTile.style.backgroundColor = tileColor;
    newTile.draggable = true;
    newTile.style.height = heightPixels / height + "px";
    newTile.style.width = widthPixels / width + "px";
    return newTile;
}
// Given a table and a row index, return the row residing at the row index
function rowDOMAt(gridDOM, row) {
    if (row >= gridDOM.rows.length) {
        throw "Supplied value of row: " + row + " was greater than max row size " + (gridDOM.rows.length - 1);
    }
    return gridDOM.rows[row];
}
// Given a table row and a column index, return the tile residing at the column index
function tileDOMAt(rowDOM, col) {
    if (col >= rowDOM.cells.length) {
        throw "Supplied value of col: " + col + " was greater than max col size " + (rowDOM.cells.length - 1);
    }
    return rowDOM.cells[col];
}

},{}]},{},[1,10,7,2,6,5,4,12]);
