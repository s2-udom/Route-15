// Define the Cell class
class Cell {
    constructor(value) {
        if (['1', '2', 'tempX', 'selectedX', 'empty'].includes(value)) {
            this.value = value;
            this.immutable = false;
        } else {
            throw new Error("Invalid value");
        }
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        if (!this.immutable && ['1', '2', 'tempX', 'selectedX', 'empty'].includes(newValue)) {
            this.value = newValue;
        } 
        
        else if (this.immutable){
            throw new Error("Cannot modify an immutable cell")
        }
        else {
            throw new Error("Invalid value");
        }
    }
    makeImmutable() {
        this.immutable = true; // Mark the cell as immutable
    }

    isImmutable() {
        return this.immutable;
    }
}

// Create the grid and map each cell to an instance of the Cell class
const grid = [];
const gridContainer = document.getElementById('grid');

for (let i = 0; i < 49; i++) {
    // Create a new Cell instance with the initial value 'empty'
    const cellInstance = new Cell('empty');
    grid.push(cellInstance);

    // Create a corresponding DOM element
    const cellElement = document.createElement('div');
    cellElement.className = 'cell empty';
    cellElement.dataset.index = i; // Map cell index
    cellElement.textContent = ''; // Set initial cell content

    // Special case for the first cell (i === 0)
    if (i === 0) {
        cellElement.classList.add('special'); // Add a special class for different styling
        cellElement.style.backgroundColor = 'purple'; // Set a unique color
        // Remove the click event listener for the first cell
        cellElement.removeEventListener('click', handleClick);
    } else {
        // Attach the click event listener for all other cells
        cellElement.addEventListener('click', handleClick);
    }

    // Append the cell element to the grid container
    gridContainer.appendChild(cellElement);
}


// Function to handle clicks on cells
function handleClick(event) {
    const clickedCellElement = event.target;
    const cellIndex = parseInt(clickedCellElement.dataset.index);
    const clickedCell = grid[cellIndex];

          // Ignore clicks on immutable cells
    if (clickedCell.isImmutable()) {
        return;
    }


    const value = clickedCell.getValue();

    if (value === 'empty') {
        grid.forEach(cell => {
            if (!cell.isImmutable() && ['1', '2', 'tempX', 'selectedX'].includes(cell.getValue())) {
                cell.setValue('empty');
            }
        });
        clickedCell.setValue('1');
        endTurnButton.disabled = false;
    } 
    
        else if (value === '1') {
        const adjacentIndices = getAdjacentIndices(cellIndex);
        adjacentIndices.forEach(index => {
            if (!grid[index].isImmutable() && ['empty', 'tempX', 'selectedX'].includes(grid[index].getValue())) {
                grid[index].setValue('tempX');
            }
        });
        clickedCell.setValue('2');
        endTurnButton.disabled = true;

    } 
    
    
    else if (value === '2') {
        grid.forEach(cell => {
            if (!cell.isImmutable() && ['1', '2', 'tempX', 'selectedX'].includes(cell.getValue())) {
                cell.setValue('empty');
            }
        });
        endTurnButton.disabled = false;
    } 
    
    
    else if (value === 'tempX') {
        clickedCell.setValue('selectedX');
        grid.forEach(cell => {
            if (!cell.isImmutable() && cell.getValue() === 'tempX') {
                cell.setValue('empty');
            }
        });
        endTurnButton.disabled = false;

    } else if (value === 'selectedX') {
        grid.forEach(cell => {
            if (!cell.isImmutable() && ['1', '2', 'tempX', 'selectedX'].includes(cell.getValue())) {
                cell.setValue('empty');
            }
        });
        endTurnButton.disabled = false;
    }

    updateGridUI();
}

// Helper function to get adjacent indices in the grid
function getAdjacentIndices(index) {
    const adjacent = [];
    const row = Math.floor(index / 7);
    const col = index % 7;

    if (row > 0) adjacent.push(index - 7);
    if (row < 6) adjacent.push(index + 7);
    if (col > 0) adjacent.push(index - 1);
    if (col < 6) adjacent.push(index + 1);

    return adjacent;
}

// Function to update the UI
function updateGridUI() {
    const cellElements = document.querySelectorAll('.cell');
    cellElements.forEach((cellElement, index) => {
        const cellValue = grid[index].getValue();

        // Update the class to match the current cell value
        cellElement.className = `cell`; // Reset class to ensure no residual classes
        if (cellValue === '1') {
            cellElement.classList.add('one');
        } else if (cellValue === '2') {
            cellElement.classList.add('two');
        } else if (cellValue === 'tempX') {
            cellElement.classList.add('tempX');
        } else if (cellValue === 'selectedX') {
            cellElement.classList.add('selectedX');
        }

        // Update text content based on cell value
        if (cellValue === 'tempX') {
            cellElement.textContent = 'X'; // Gray X for tempX
        } else if (cellValue === 'selectedX') {
            cellElement.textContent = 'X'; // Black X for selectedX
        } else {
            cellElement.textContent = cellValue !== 'empty' ? cellValue : ''; // Display 1 or 2, or leave blank for empty
        }
    });
}
    
    function endTurn() {
        grid.forEach(cell => {
            if (!cell.isImmutable() && ['1', '2','selectedX'].includes(cell.getValue())) {
                cell.makeImmutable();
            }
        });
    }
