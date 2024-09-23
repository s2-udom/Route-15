document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    let selectedCell = null;

    for (let i = 0; i < 49; i++) { // 7x7 grid, so 49 cells
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;

        if (i === 0) {
            // Special case for the top-left cell
            cell.classList.add('non-interactive');
        } else {
            cell.dataset.clicks = 0;
            cell.addEventListener('click', handleClick);
        }

        gridContainer.appendChild(cell);
    }

    function handleClick(event) {
        const cell = event.target;
        const index = parseInt(cell.dataset.index);
        let clicks = parseInt(cell.dataset.clicks);

        if (selectedCell && selectedCell !== cell) {
            // Reset previously selected cell if it is not the current cell
            resetCell(selectedCell);
        }

        if (cell.classList.contains('x')) {
            // Special case for clicking on an X cell
            removeAdjacentX();
            cell.textContent = 'X';
            cell.classList.add('x');
            selectedCell = cell;
            return;
        }

        clicks = (clicks + 1) % 3; // Increment and reset after 2 (0 -> 1 -> 2 -> 0)
        cell.dataset.clicks = clicks;

        if (clicks === 0) {
            cell.textContent = '';
            cell.classList.remove('one', 'two');
            removeAllSpecialCells();
        } else if (clicks === 1) {
            cell.textContent = '1';
            cell.classList.add('one');
            cell.classList.remove('two');
            selectedCell = cell;
            removeAllSpecialCells();
        } else if (clicks === 2) {
            cell.textContent = '2';
            cell.classList.add('two');
            cell.classList.remove('one');
            addAdjacentX(index);
            selectedCell = cell;
        }
    }

    function resetCell(cell) {
        if (parseInt(cell.dataset.clicks) === 1) {
            cell.textContent = '';
            cell.classList.remove('one');
        } 
        cell.dataset.clicks = 0;
    }

    function addAdjacentX(index) {
        const adjacentIndices = getAdjacentIndices(index);
        adjacentIndices.forEach(i => {
            const adjacentCell = gridContainer.children[i];
            if (adjacentCell.dataset.clicks != 2) {
                adjacentCell.textContent = 'X';
                adjacentCell.classList.add('x');
            }
        });
    }

    function removeAllSpecialCells() {
        const cells = document.querySelectorAll('.grid-cell.x, .grid-cell.two');
        cells.forEach(cell => {
            if (cell.dataset.clicks != 2) {
                cell.textContent = '';
                cell.classList.remove('x', 'two');
            }
        });
    }

    function removeAdjacentX() {
        const cells = document.querySelectorAll('.grid-cell.x');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x');
        });
    }

    function getAdjacentIndices(index) {
        const adjacentIndices = [];
        const row = Math.floor(index / 7);
        const col = index % 7;

        if (col > 0) adjacentIndices.push(index - 1); // left
        if (col < 6) adjacentIndices.push(index + 1); // right
        if (row > 0) adjacentIndices.push(index - 7); // top
        if (row < 6) adjacentIndices.push(index + 7); // bottom

        return adjacentIndices;
    }

    window.endTurn = function() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            if (cell.textContent !== '') {
                cell.removeEventListener('click', handleClick);
            }
        });
    }
});
