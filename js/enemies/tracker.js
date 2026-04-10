class TrackerEnemy extends Enemy {
    constructor(game, x, y) {
        super(game, x, y, 35, 18, 180);
        this.color = this.getRandomColor();
        this.trackingSpeed = 100;
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 追踪玩家
        const player = this.game.entities.find(entity => entity instanceof PaperPlane);
        if (player) {
            const dy = player.y - this.y;
            this.y += dy * 0.5 * deltaTime * this.trackingSpeed;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 绘制折纸风格的追踪敌人
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
        
        // 标记为追踪型敌人
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 8, this.y + this.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}