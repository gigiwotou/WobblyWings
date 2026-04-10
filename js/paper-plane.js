class PaperPlane {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 20;
        this.speed = 100;
        this.acceleration = 200;
        this.maxSpeed = 300;
        this.angle = 0;
        this.rotationSpeed = 0.5;
        this.wobbleTime = 0;
        this.wobbleAmplitude = 0.1;
        this.dead = false;
        this.particleSystem = new ParticleSystem();
        
        // 添加粒子系统到游戏实体
        this.game.addEntity(this.particleSystem);
    }
    
    update(deltaTime) {
        // 晃晃悠悠的飞行姿态
        this.wobbleTime += deltaTime;
        this.angle = Math.sin(this.wobbleTime * 2) * this.wobbleAmplitude;
        
        // 纸飞机向前飞行
        this.x += this.speed * deltaTime;
        
        // 输入处理
        this.handleInput(deltaTime);
        
        // 边界检查
        this.checkBounds();
        
        // 生成尾烟
        this.particleSystem.emit(this.x - 10, this.y + this.height / 2);
    }
    
    handleInput(deltaTime) {
        // 鼠标控制
        const mouseY = this.game.mouse.y;
        const distance = mouseY - this.y;
        const moveSpeed = distance * 5 * deltaTime;
        this.y += moveSpeed;
        
        // 键盘控制
        if (this.game.keys['ArrowUp']) {
            this.y -= this.acceleration * deltaTime;
        }
        if (this.game.keys['ArrowDown']) {
            this.y += this.acceleration * deltaTime;
        }
    }
    
    checkBounds() {
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > this.game.height) {
            this.y = this.game.height - this.height;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        
        // 绘制折纸飞机
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 飞机主体
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
        
        ctx.restore();
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