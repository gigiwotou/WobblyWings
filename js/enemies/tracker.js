class TrackerEnemy extends Enemy {
    constructor(game, x, y) {
        super(game, x, y, 35, 18, 60); // 速度降低3倍：180 / 3 = 60
        this.color = this.getRandomColor();
        this.trackingSpeed = 80;
        this.playerLastX = x;
        this.playerLastY = y;
        this.targetY = y;
        this.trackingDelay = 1.0; // 追踪延迟时间（秒）
        this.trackingTimer = 0;
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 追踪玩家，但有延迟
        this.trackingTimer += deltaTime;
        
        if (this.trackingTimer >= this.trackingDelay) {
            // 每隔一段时间更新一次目标位置
            const player = this.game.entities.find(entity => entity instanceof PaperPlane);
            if (player) {
                this.targetY = player.y;
            }
            this.trackingTimer = 0;
        }
        
        // 向目标位置移动，平滑过渡
        const dy = this.targetY - this.y;
        this.y += dy * 0.3 * deltaTime * this.trackingSpeed;
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