class Cell {
    constructor(value) {
        if (['1', '2', 'tempX', 'selectedX', 'empty', 'frozen', 'discoverableOne', 'discoverableTwo', 'routed'].includes(value)) {
            this.value = value;
            this.immutable = false;
            this.previousContent = value; // Store initial value
        } else {
            throw new Error("Invalid value");
        }
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        if (!this.isImmutable() && ['1', '2', 'tempX', 'selectedX', 'empty', 'frozen', 'discoverableOne', 'discoverableTwo', 'routed'].includes(newValue)) {
            this.setPreviousContent(this.value); // Save previous content before changing
            this.value = newValue;
        } 
    }
    
    setPreviousContent(content) {
        if (['1', '2', 'tempX', 'selectedX'].includes(content)) { 
            this.previousContent = content; // Ensure we store valid values
        }
    }

    getPreviousContent() {
        return this.previousContent;
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
        cellElement.style.backgroundColor = 'purple'; // Keep the unique color

        cellInstance.makeImmutable();

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
        findRouteButton.disabled = true;
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
        

    } 
    
    else if (value === 'selectedX') {
        grid.forEach(cell => {
            if (!cell.isImmutable() && ['1', '2', 'tempX', 'selectedX'].includes(cell.getValue())) {
                cell.setValue('empty');
            }
        });
        endTurnButton.disabled = false;
    }
    
    else if (value === 'frozen'){
        return;
    }
  
    else  if (value === 'discoverableOne') {
         
        // Change clicked cell to 'routed'
        clickedCell.setValue('routed');
        // Revert all other discoverable cells back to 'frozen'
        grid.forEach(cell => {
            if (cell.getValue() === 'discoverableOne' || cell.getValue() === 'discoverableTwo') {
                cell.setValue('frozen');
        
            }
          
        });
        const adjacentIndices = getAdjacentIndices(cellIndex);
        adjacentIndices.forEach(index => {
            const adjacentCell = grid[index];
            // Only set adjacent cells to 'discoverable' if they are not 'X' or 'frozen'
            if (adjacentCell.getPreviousContent()=== '1' && adjacentCell.getValue() !== 'routed') {
                adjacentCell.setValue('discoverableOne');
                console.log('adjacent cell is now a discoverableOne');
                
            }
            else if (adjacentCell.getPreviousContent() === '2' && adjacentCell.getValue() !== 'routed'){
                adjacentCell.setValue('discoverableTwo');
                console.log('adjacent cell is now a discoverableTwo');
               
            }
            else if (adjacentCell.getValue() === 'routed'){

                console.log('cell is already routed');
            }
        });

    }
    else  if (value === 'discoverableTwo') {
         
        // Change clicked cell to 'routed'
        clickedCell.setValue('routed');
        // Revert all other discoverable cells back to 'frozen'
        grid.forEach(cell => {
            if (cell.getValue() === 'discoverableOne' || cell.getValue() === 'discoverableTwo') {
                cell.setValue('frozen');
            }
        });
        const diagonalIndices = getDiagonalIndices(cellIndex);
        diagonalIndices.forEach(index => {
            const diagonalCell = grid[index];
            // Only set diagonal cells to 'discoverable' if they are not 'X' or 'frozen'
            if (diagonalCell.getPreviousContent()=== '1' && diagonalCell.getValue() !== 'routed') {
                diagonalCell.setValue('discoverableOne');
                console.log('diagonal cell is now a discoverableOne');
                
            }
            else if (diagonalCell.getPreviousContent() === '2' && diagonalCell.getValue() !== 'routed'){
                diagonalCell.setValue('discoverableTwo');
                console.log('diagonal cell is now a discoverableTwo');
               
            }
            else if (diagonalCell.getValue() === 'routed'){

                console.log('cell is already routed');
            }
        });

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

//function to get diagonal indices for
function getDiagonalIndices(index) {
    const diagonals = [];
    const row = Math.floor(index / 7);
    const col = index % 7;

    if (row > 0 && col > 0) diagonals.push(index - 8);
    if (row > 0 && col < 6) diagonals.push(index - 6);
    if (row < 6 && col > 0) diagonals.push(index + 6);
    if (row < 6 && col < 6) diagonals.push(index + 8);

    return diagonals;
}


// Function to update the UI
function updateGridUI() {
    const cellElements = document.querySelectorAll('.cell');
    cellElements.forEach((cellElement, index) => {
        const cell = grid[index];
        const cellValue = cell.getValue();
        const previousContent = cell.getPreviousContent(); 

        // Reset class
        cellElement.className = 'cell';

        let displayText = '';
        if (cellValue === 'frozen' || cellValue === 'discoverableOne' || cellValue === 'discoverableTwo' || cellValue === 'routed') {
            // Show 'X' for 'selectedX' or 'tempX' and keep the previous content otherwise
            displayText = (previousContent === 'selectedX') ? 'X' : previousContent;
            displayText = (previousContent === 'tempX') ? '' : displayText;
        
            // If the previous content was 'empty', leave the display as empty
            displayText = (previousContent === 'empty') ? '' : displayText;
        } else if (cellValue === '1') {
            displayText = '1';
        } else if (cellValue === '2') {
            displayText = '2';
        } else if (cellValue === 'tempX' || cellValue === 'selectedX') {
            displayText = 'X';
        }
        
        // Apply the display text to the cell element
        cellElement.textContent = displayText;
        

        // Apply data-content for CSS
        cellElement.setAttribute('data-content', displayText);

        // Specifically add class for routed cells
        if (cellValue === 'routed') {
            cellElement.classList.add('routed');
        }
    });
}




    
function endTurn() {
    grid.forEach(cell => {
        if (!cell.isImmutable() && ['1', '2', 'selectedX'].includes(cell.getValue())) {
            cell.setPreviousContent(cell.getValue()); // Store before freezing
            cell.setValue('frozen');
        }
    });
    updateGridUI();
    findRouteButton.disabled = false;
}

    
function initialiseRoute() {
    grid.forEach((cell, index) => {
        const cellElement = document.querySelector(`[data-index='${index}']`); // Get the cell element

        // Check if the cell is frozen and if it contains '1' or '2', then make it discoverable
        if (cell.getValue() === 'frozen' && ['1'].includes(cell.getPreviousContent()) && index >= 42 && index <= 48) {
            
            cell.setValue('discoverableOne');
            
        }
        else if(cell.getValue() === 'frozen' && ['2'].includes(cell.getPreviousContent()) && index >= 42 && index <= 48){
            cell.setValue('discoverableTwo');
            
        }
        else if (cell.getValue() === 'empty') {
            cellElement.removeEventListener('click', handleClick); // Remove the event listener
        }
    });

    // Update the UI after changes
    updateGridUI();
    endTurnButton.disabled = true;
}




