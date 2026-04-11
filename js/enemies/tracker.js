class TrackerEnemy extends Enemy {
    constructor(game, x, y) {
        // 随机大小
        const sizeMultiplier = 0.8 + Math.random() * 0.4; // 0.8 到 1.2 倍
        const width = 35 * sizeMultiplier;
        const height = 18 * sizeMultiplier;
        super(game, x, y, width, height, 0); // 基础速度设为0，我们自己控制移动
        this.color = this.getRandomColor();
        this.trackingSpeed = 0;
        this.playerLastX = x;
        this.playerLastY = y;
        this.targetY = y;
        this.trackingDelay = 1.2; // 增加追踪延迟时间，让玩家有更多反应时间
        this.trackingTimer = 0;
        this.velocityY = 0;
        this.rubberBandStrength = 150; // 减小橡皮筋强度，降低上下移动速度
        this.damping = 0.92;
        this.maxSpeed = 500 / 4; // 降低上下移动的最大速度
        this.forwardSpeed = 30; // 增加向前飞行的速度
        this.dead = false;
    }
    
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(deltaTime) {
        // 先调用父类update，但不使用父类的移动
        // 我们自己控制X和Y方向的移动
        
        // X方向移动（与场景滚动保持一致，加上额外的向前速度）
        this.x -= (this.game.scrollSpeed + this.forwardSpeed) * deltaTime;
        
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
        
        // 应用橡皮筋物理效果（Y方向）
        this.applyRubberBandPhysics(deltaTime);
        
        // 检查是否超出屏幕
        if (this.x + this.width < this.game.scrollX) {
            this.dead = true;
            // 增加得分
            this.game.score += 10;
        }
    }
    
    applyRubberBandPhysics(deltaTime) {
        // 计算Y方向的距离
        const dy = this.targetY - this.y;
        
        // 计算橡皮筋拉力（与距离成正比）
        const forceY = dy * this.rubberBandStrength * deltaTime;
        
        // 应用拉力和阻尼
        this.velocityY = (this.velocityY + forceY) * this.damping;
        
        // 限制最大速度
        if (Math.abs(this.velocityY) > this.maxSpeed) {
            this.velocityY = this.velocityY > 0 ? this.maxSpeed : -this.maxSpeed;
        }
        
        // 更新Y位置
        this.y += this.velocityY * deltaTime;
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