class PaperPlane {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.width = 40;
        this.height = 20;
        this.speed = 100;
        this.maxSpeed = 250;
        this.angle = 0;
        this.wobbleTime = 0;
        this.wobbleAmplitude = 0.1;
        this.dead = false;
        this.particleSystem = new ParticleSystem();
        
        // 橡皮筋物理参数
        this.rubberBandStrength = 200;
        this.damping = 0.85;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // 添加粒子系统到游戏实体
        this.game.addEntity(this.particleSystem);
    }
    
    update(deltaTime) {
        // 晃晃悠悠的飞行姿态
        this.wobbleTime += deltaTime;
        this.wobbleAmplitude = 0.1;
        
        // 更新目标位置为鼠标位置（考虑滚动偏移）
        this.targetX = this.game.scrollX + this.game.mouse.x;
        this.targetY = this.game.mouse.y;
        
        // 橡皮筋物理效果
        this.applyRubberBandPhysics(deltaTime);
        
        // 纸飞机向前飞行的基础速度
        this.x += this.speed * deltaTime;
        
        // 根据移动方向调整角度
        this.calculateAngle();
        
        // 边界检查
        this.checkBounds();
        
        // 生成尾烟
        this.particleSystem.emit(this.x - 10, this.y + this.height / 2);
    }
    
    applyRubberBandPhysics(deltaTime) {
        // 计算飞机与鼠标的距离
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        
        // 计算橡皮筋拉力（与距离成正比）
        const forceX = dx * this.rubberBandStrength * deltaTime;
        const forceY = dy * this.rubberBandStrength * deltaTime;
        
        // 应用拉力和阻尼
        this.velocityX = (this.velocityX + forceX) * this.damping;
        this.velocityY = (this.velocityY + forceY) * this.damping;
        
        // 限制最大速度
        const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (currentSpeed > this.maxSpeed) {
            const ratio = this.maxSpeed / currentSpeed;
            this.velocityX *= ratio;
            this.velocityY *= ratio;
        }
        
        // 更新位置
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }
    
    calculateAngle() {
        // 计算朝向目标的角度
        const targetAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        
        // 基础飞行角度
        const baseAngle = 0.1;
        
        // 结合晃晃悠悠的效果
        const wobbleAngle = Math.sin(this.wobbleTime * 2) * this.wobbleAmplitude;
        
        // 平滑过渡到目标角度
        this.angle = baseAngle + targetAngle * 0.3 + wobbleAngle;
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