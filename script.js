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

    let currentElement = 1; // Default element (sand: 1, water: 2, lava: 3, erase: 4)

    // Setup event listeners for element buttons
    document.getElementById('sandButton').addEventListener('click', () => {
        currentElement = 1; // Set current element to sand
    });

    document.getElementById('waterButton').addEventListener('click', () => {
        currentElement = 2; // Set current element to water
    });

    document.getElementById('lavaButton').addEventListener('click', () => {
        currentElement = 3; // Set current element to lava
    });

    document.getElementById('eraseButton').addEventListener('click', () => {
        currentElement = 4; // Set current element to erase
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

    function lavaPhysics(grid, cols, rows) {
        // Lava physics logic
        for (let i = 0; i < cols; i++) {
            for (let j = rows - 1; j > 0; j--) {
                if (grid[i][j] === 3) {
                    const direction = Math.floor(Math.random() * 3); // Randomly choose a direction (0: left, 1: right, 2: down)
                    if (direction === 0 && i > 0 && grid[i - 1][j] === 0) {
                        // Move lava left if there's empty space to the left
                        grid[i - 1][j] = 3;
                        grid[i][j] = 0;
                    } else if (direction === 1 && i < cols - 1 && grid[i + 1][j] === 0) {
                        // Move lava right if there's empty space to the right
                        grid[i + 1][j] = 3;
                        grid[i][j] = 0;
                    } else if (direction === 2 && j < rows - 1 && grid[i][j + 1] === 0) {
                        // Move lava down if there's empty space below
                        grid[i][j + 1] = 3;
                        grid[i][j] = 0;
                    }
                }
            }
        }
    }

    function updateGrid() {
        // Define maximum relaxation steps per frame
        const maxRelaxationSteps = 10;

        // Perform relaxation steps for all particles
        for (let relaxationStep = 0; relaxationStep < maxRelaxationSteps; relaxationStep++) {
            let particlesMoved = false;

            // Update particle positions
            for (let i = 0; i < cols; i++) {
                for (let j = rows - 1; j > 0; j--) {
                    if (grid[i][j] === 1 || grid[i][j] === 2 || grid[i][j] === 3 || grid[i][j] === 4) { // Update for all particles
                        // Particle movement logic
                        if (grid[i][j] === 2) { // Water behavior
                            if (j < rows - 1 && grid[i][j + 1] === 0) {
                                // Move water down if there's empty space below
                                grid[i][j + 1] = 2;
                                grid[i][j] = 0;
                                particlesMoved = true;
                            }
                        } else if (grid[i][j] === 3) { // Lava behavior
                            if (j < rows - 1 && grid[i][j + 1] === 0) {
                                // Move lava down if there's empty space below
                                grid[i][j + 1] = 3;
                                grid[i][j] = 0;
                                particlesMoved = true;
                            }
                        } else if (grid[i][j] === 1 || grid[i][j] === 4) { // Sand and erase behavior
                            if ((j < rows - 1 && (grid[i][j + 1] === 0 || grid[i][j + 1] === 2 || grid[i][j + 1] === 3)) ||
                                (i > 0 && j < rows - 1 && (grid[i - 1][j + 1] === 0 || grid[i - 1][j + 1] === 2 || grid[i - 1][j + 1] === 3) && grid[i - 1][j] === 0) ||
                                (i < cols - 1 && j < rows - 1 && (grid[i + 1][j + 1] === 0 || grid[i + 1][j + 1] === 2 || grid[i + 1][j + 1] === 3) && grid[i + 1][j] === 0)) {
                                // If there's empty space or water/lava below or diagonally below, move particle down
                                if (j < rows - 1 && (grid[i][j + 1] === 0 || grid[i][j + 1] === 2 || grid[i][j + 1] === 3)) {
                                    grid[i][j + 1] = grid[i][j];
                                } else if (i > 0 && j < rows - 1 && (grid[i - 1][j + 1] === 0 || grid[i - 1][j + 1] === 2 || grid[i - 1][j + 1] === 3) && grid[i - 1][j] === 0) {
                                    grid[i - 1][j + 1] = grid[i][j];
                                } else if (i < cols - 1 && j < rows - 1 && (grid[i + 1][j + 1] === 0 || grid[i + 1][j + 1] === 2 || grid[i + 1][j + 1] === 3) && grid[i + 1][j] === 0) {
                                    grid[i + 1][j + 1] = grid[i][j];
                                }
                                grid[i][j] = 0; // Clear current cell
                                particlesMoved = true; // Set flag to indicate particle movement
                            }
                        }
                    }
                }
            }

            // If no particles were moved during the relaxation step, exit the loop
            if (!particlesMoved) {
                break;
            }
        }

        // Apply water and lava physics logic unconditionally
        waterPhysics(grid, cols, rows);
        lavaPhysics(grid, cols, rows);

        // Remove erase particles after 5 seconds
        setTimeout(() => {
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (grid[i][j] === 4) {
                        grid[i][j] = 0; // Clear erase particle
                    }
                }
            }
        }, 5000); // 5000 milliseconds = 5 seconds
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
                } else if (grid[i][j] === 3) {
                    ctx.fillStyle = 'red'; // Lava color
                } else if (grid[i][j] === 4) {
                    ctx.fillStyle = 'white'; // Erase color
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
