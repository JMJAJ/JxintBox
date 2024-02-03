class Particle {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }

    draw(ctx, x, y, gridSize) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('sandbox');
    const ctx = canvas.getContext('2d');

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const gridSize = 5;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    let grid = [];

    let isMouseDown = false;
    let particleCount = 10; // Default particle count

    let currentElement = 1; // Default element (sand: 1, water: 2)

    // Setup event listeners for element buttons
    document.getElementById('sandButton').addEventListener('click', () => {
        currentElement = 1; // Set current element to sand
    });

    document.getElementById('waterButton').addEventListener('click', () => {
        currentElement = 2; // Set current element to water
    });

    // Setup event listener for particle count slider
    const particleCountSlider = document.getElementById('particleCountSlider');
    particleCountSlider.addEventListener('input', () => {
        particleCount = parseInt(particleCountSlider.value); // Update particle count
    });

    function setup() {
        canvas.width = width;
        canvas.height = height;

        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = 0;
            }
        }
    }

    function waterPhysics(grid, cols, rows) {
        // Water physics logic
        for (let i = 0; i < cols; i++) {
            for (let j = rows - 1; j > 0; j--) {
                if (grid[i][j] === 2) {
                    const direction = Math.floor(Math.random() * 3); // Randomly choose a direction (0: left, 1: right, 2: down)
                    if (direction === 0 && i > 0 && grid[i - 1][j] === 0) {
                        // Move water left if there's empty space to the left
                        grid[i - 1][j] = 2;
                        grid[i][j] = 0;
                    } else if (direction === 1 && i < cols - 1 && grid[i + 1][j] === 0) {
                        // Move water right if there's empty space to the right
                        grid[i + 1][j] = 2;
                        grid[i][j] = 0;
                    } else if (direction === 2 && j < rows - 1 && grid[i][j + 1] === 0) {
                        // Move water down if there's empty space below
                        grid[i][j + 1] = 2;
                        grid[i][j] = 0;
                    }
                }
            }
        }
    }

    function updateGrid() {
        // Define maximum relaxation steps per frame
        const maxRelaxationSteps = 10;

        // Perform relaxation steps for both sand and water
        for (let relaxationStep = 0; relaxationStep < maxRelaxationSteps; relaxationStep++) {
            let particlesMoved = false;

            // Update particle positions for both sand and water
            for (let i = 0; i < cols; i++) {
                for (let j = rows - 1; j > 0; j--) {
                    if (grid[i][j] === 1 || grid[i][j] === 2) { // Update for sand and water
                        // Particle movement logic
                        if ((j < rows - 1 && grid[i][j + 1] === 0) ||
                            (i > 0 && j < rows - 1 && grid[i - 1][j + 1] === 0 && grid[i - 1][j] === 0) ||
                            (i < cols - 1 && j < rows - 1 && grid[i + 1][j + 1] === 0 && grid[i + 1][j] === 0)) {
                            // If there's empty space below or diagonally below, move particle down
                            if (j < rows - 1 && grid[i][j + 1] === 0) {
                                grid[i][j + 1] = grid[i][j];
                            } else if (i > 0 && j < rows - 1 && grid[i - 1][j + 1] === 0 && grid[i - 1][j] === 0) {
                                grid[i - 1][j + 1] = grid[i][j];
                            } else if (i < cols - 1 && j < rows - 1 && grid[i + 1][j + 1] === 0 && grid[i + 1][j] === 0) {
                                grid[i + 1][j + 1] = grid[i][j];
                            }
                            grid[i][j] = 0; // Clear current cell
                            particlesMoved = true; // Set flag to indicate particle movement
                        }
                    }
                }
            }

            // If no particles were moved during the relaxation step, exit the loop
            if (!particlesMoved) {
                break;
            }
        }

        // Apply water physics logic unconditionally
        waterPhysics(grid, cols, rows);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw particles
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] === 1) {
                    ctx.fillStyle = 'yellow'; // Sand color
                } else if (grid[i][j] === 2) {
                    ctx.fillStyle = 'blue'; // Water color
                } else {
                    continue; // Skip empty cells
                }
                ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
            }
        }

        updateGrid(); // Update particle positions

        requestAnimationFrame(draw);
    }

    setup();

    canvas.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const mouseX = Math.floor(event.clientX / gridSize);
            const mouseY = Math.floor(event.clientY / gridSize);
            if (mouseX >= 0 && mouseX < cols && mouseY >= 0 && mouseY < rows) {
                for (let i = 0; i < particleCount; i++) {
                    grid[mouseX][mouseY - i] = currentElement; // Place multiple particles based on current element
                }
            }
        }
    });

    draw(); // Initial draw
});
