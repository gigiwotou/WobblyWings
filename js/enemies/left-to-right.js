class LeftToRightEnemy extends Enemy {
    constructor(game, x, y) {
        // 从左向右飞行的敌人，速度是玩家最大速度的0.8
        const playerMaxSpeed = 500;
        const speed = playerMaxSpeed * 0.8;
        super(game, x, y, 30, 15, 0); // 基础速度设为0，我们自己控制
        this.leftToRightSpeed = speed; // 保存从左向右的速度
        this.color = this.getRandomColor();
        this.dead = false;
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        // 先调用父类update，但不使用父类的移动
        // super.update(deltaTime);
        
        // 从左向右飞行
        this.x += this.leftToRightSpeed * deltaTime;
        
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
        
        // 绘制从左向右飞行的折纸敌人（机头朝右）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2); // 机头朝右
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 机翼折痕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
        
        // 机鼻折痕（现在在右侧）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.stroke();
        
        // 标记为从左向右飞行的敌人
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('→', this.x + this.width / 2 - 5, this.y + this.height / 2 + 3);
    }
}