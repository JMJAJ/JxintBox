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
