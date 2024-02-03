class Particle {
    constructor(type, color) {
        this.type = type;
        this.color = color;
    }

    draw(ctx, x, y, gridSize) {
        if (this.type === 3) {
            // Draw small circle for lava sparkle
            ctx.beginPath();
            ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        } else {
            // Draw solid rectangle for other particles
            ctx.fillStyle = this.color;
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }
}