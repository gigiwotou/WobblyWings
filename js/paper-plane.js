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
        
        // 飞机保持在屏幕左侧固定的X位置
        this.x = this.game.scrollX + 100;
        
        // 更新目标位置为鼠标Y位置
        this.targetY = this.game.mouse.y;
        
        // 橡皮筋物理效果（只控制Y方向）
        this.applyRubberBandPhysics(deltaTime);
        
        // 根据移动方向调整角度
        this.calculateAngle();
        
        // 边界检查
        this.checkBounds();
        
        // 生成尾烟
        this.particleSystem.emit(this.x - 10, this.y + this.height / 2);
    }
    
    applyRubberBandPhysics(deltaTime) {
        // 只计算Y方向的距离
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
    
    calculateAngle() {
        // 基于Y方向的速度计算角度
        const verticalAngle = this.velocityY / this.maxSpeed * 0.3;
        
        // 基础飞行角度
        const baseAngle = 0.05;
        
        // 结合晃晃悠悠的效果
        const wobbleAngle = Math.sin(this.wobbleTime * 2) * this.wobbleAmplitude;
        
        // 最终角度
        this.angle = baseAngle + verticalAngle + wobbleAngle;
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