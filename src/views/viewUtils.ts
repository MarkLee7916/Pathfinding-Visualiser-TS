export function getDOMElem(selector: string) {
    const elemDOM: Element | null = document.querySelector(selector);

    if (elemDOM === null) {
        throw `Selector ${selector} wasn't found in index.html`;
    } else {
        return <Element>elemDOM;
    }
}

export function getDOMElemList(selector: string) {
    const elemsDOM = document.querySelectorAll(selector);

    if (elemsDOM === null || elemsDOM.length === 0) {
        throw `Selector ${selector} wasn't found in index.html`;
    } else {
        return Array.from(elemsDOM).map(elem => <Element> elem);
    }
}

export function initGenericGridInDOM(selector: string, height: number, width: number, heightPixels: number, widthPixels: number, tileColor: string) {
    const elemDOM = getDOMElem(selector);

    for (let row = 0; row < height; row++) {
        elemDOM.append(createEmptyRowInDOM(height, width, heightPixels, widthPixels, tileColor));
    }
}

// Given a row and a column, return the tile indexed in the main grid
export function getTileInDOM(row: number, col: number) {
    const gridDOM = <HTMLTableElement>getDOMElem("#grid");
    const rowDOM = rowDOMAt(gridDOM, row);
    const tileDOM = tileDOMAt(rowDOM, col);

    return tileDOM;
}

// Create a delay for the specified amount of time in millis
export function wait(delayTime: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, delayTime);
    });
}

export function isColor(tile: HTMLTableCellElement, color: string) {
    return tile.style.backgroundColor === color;
}

// Swap the colours of two tiles in the grid
export function swapTileColors(tile: HTMLTableCellElement, cell: HTMLTableCellElement) {
    const temp = tile.style.backgroundColor;

    tile.style.backgroundColor = cell.style.backgroundColor;
    cell.style.backgroundColor = temp;
}

function createEmptyRowInDOM(height: number, width: number, heightPixels: number, widthPixels: number, tileColor: string) {
    const newRow = document.createElement("tr");

    newRow.className = "row";
    newRow.style.height = `${heightPixels / height}px`;
    newRow.style.width = `${widthPixels / width}px`;

    for (let col = 0; col < width; col++) {
        newRow.append(createEmptyTileInDOM(height, width, heightPixels, widthPixels, tileColor));
    }

    return newRow;
}

function createEmptyTileInDOM(height: number, width: number, heightPixels: number, widthPixels: number,  tileColor: string) {
    const newTile = document.createElement("td");

    newTile.className = "tile";
    newTile.style.backgroundColor = tileColor;
    newTile.draggable = true;
    newTile.style.height = `${heightPixels / height}px`;
    newTile.style.width = `${widthPixels / width}px`;

    return newTile;
}

// Given a table and a row index, return the row residing at the row index
function rowDOMAt(gridDOM: HTMLTableElement, row: number) {
    if (row >= gridDOM.rows.length) {
        throw `Supplied value of row: ${row} was greater than max row size ${gridDOM.rows.length - 1}`;
    }

    return gridDOM.rows[row];
}

// Given a table row and a column index, return the tile residing at the column index
function tileDOMAt(rowDOM: HTMLTableRowElement, col: number) {
    if (col >= rowDOM.cells.length) {
        throw `Supplied value of col: ${col} was greater than max col size ${rowDOM.cells.length - 1}`;
    }

    return rowDOM.cells[col];
}

