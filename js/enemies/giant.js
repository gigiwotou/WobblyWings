class GiantEnemy extends Enemy {
    constructor(game, x, y) {
        // 巨型敌人，大小是普通敌人的3倍
        super(game, x, y, 90, 45, 100);
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
        ctx.lineWidth = 2;
        
        // 绘制巨型折纸敌人
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
        
        // 标记为巨型敌人
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('巨型', this.x + this.width / 2 - 15, this.y + this.height / 2 + 5);
    }
}