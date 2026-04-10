class LeftToRightEnemy extends Enemy {
    constructor(game, x, y) {
        // 从左向右飞行的敌人，速度是玩家最大速度的0.8
        const playerMaxSpeed = 500;
        const speed = playerMaxSpeed * 0.8;
        super(game, x, y, 30, 15, -speed); // 速度为负值，表示从左向右飞
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        // 从左向右飞行
        this.x += this.speed * deltaTime;
        
        // 检查是否超出屏幕
        if (this.x > this.game.scrollX + this.game.width) {
            this.dead = true;
            // 增加得分
            this.game.score += 15; // 从左向右飞的敌人得分更高
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 绘制从左向右飞行的折纸敌人
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 机翼折痕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
        
        // 机鼻折痕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.stroke();
        
        // 标记为从左向右飞行的敌人
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('←', this.x + this.width / 2 - 5, this.y + this.height / 2 + 3);
    }
}