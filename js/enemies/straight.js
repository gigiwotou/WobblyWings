class StraightEnemy extends Enemy {
    constructor(game, x, y) {
        // 随机大小
        const sizeMultiplier = 0.8 + Math.random() * 0.4; // 0.8 到 1.2 倍
        const width = 30 * sizeMultiplier;
        const height = 15 * sizeMultiplier;
        super(game, x, y, width, height, 150);
        this.color = this.getRandomColor();
        this.dead = false;
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 绘制折纸风格的敌人
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 折痕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
    }
}