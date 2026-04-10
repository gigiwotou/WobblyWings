class Enemy {
    constructor(game, x, y, width, height, speed) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dead = false;
    }
    
    update(deltaTime) {
        this.x -= (this.speed - this.game.scrollSpeed) * deltaTime;
        
        // 检查是否超出屏幕
        if (this.x + this.width < this.game.scrollX) {
            this.dead = true;
            // 增加得分
            this.game.score += 10;
        }
    }
    
    render(ctx) {
        // 子类实现具体的渲染逻辑
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    destroy() {
        this.dead = true;
    }
}