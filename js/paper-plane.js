class PaperPlane {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.width = 80; // 放大两倍
        this.height = 40; // 放大两倍
        this.speed = 100;
        this.maxSpeed = 500;
        this.angle = 0;
        this.wobbleTime = 0;
        this.wobbleAmplitude = 0.1;
        this.dead = false;
        this.particleSystem = new ParticleSystem();
        
        // 橡皮筋物理参数
        this.rubberBandStrength = 400;
        this.damping = 0.92;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // 碰撞效果
        this.collisionEffect = {
            normal: false,
            normalTimer: 0,
            giant: false,
            giantTimer: 0,
            leftToRight: false,
            leftToRightTimer: 0
        };
        
        // 原始速度
        this.originalMaxSpeed = 500;
        
        // 添加粒子系统到游戏实体
        this.game.addEntity(this.particleSystem);
    }
    
    update(deltaTime) {
        // 晃晃悠悠的飞行姿态
        this.wobbleTime += deltaTime;
        
        // 碰撞效果处理
        this.handleCollisionEffects(deltaTime);
        
        // 更新目标位置为鼠标位置（考虑滚动偏移）
        this.targetX = this.game.scrollX + this.game.mouse.x;
        this.targetY = this.game.mouse.y;
        
        // 橡皮筋物理效果（控制X和Y方向）
        this.applyRubberBandPhysics(deltaTime);
        
        // 根据移动方向调整角度
        this.calculateAngle();
        
        // 边界检查
        this.checkBounds();
        
        // 生成尾烟
        this.particleSystem.emit(this.x + 10, this.y + this.height / 2);
    }
    
    handleCollisionEffects(deltaTime) {
        // 普通敌人碰撞效果
        if (this.collisionEffect.normal) {
            this.collisionEffect.normalTimer += deltaTime;
            this.wobbleAmplitude = 0.3; // 增加抖动
            this.maxSpeed = this.originalMaxSpeed * 0.7; // 降低速度
            
            if (this.collisionEffect.normalTimer >= 5) {
                this.collisionEffect.normal = false;
                this.collisionEffect.normalTimer = 0;
                this.wobbleAmplitude = 0.1;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }
        
        // 巨型敌人碰撞效果
        if (this.collisionEffect.giant) {
            this.collisionEffect.giantTimer += deltaTime;
            this.maxSpeed = this.originalMaxSpeed * 0.99; // 降低1%
            
            if (this.collisionEffect.giantTimer >= 30) {
                this.collisionEffect.giant = false;
                this.collisionEffect.giantTimer = 0;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }
        
        // 从左向右飞行的敌人碰撞效果
        if (this.collisionEffect.leftToRight) {
            this.collisionEffect.leftToRightTimer += deltaTime;
            this.wobbleAmplitude = 0.4; // 剧烈抖动
            this.maxSpeed = this.originalMaxSpeed * 0.7; // 降低速度
            
            // 不受控制的乱飞
            if (Math.random() < 0.3) {
                this.velocityX += (Math.random() - 0.5) * 100;
                this.velocityY += (Math.random() - 0.5) * 100;
            }
            
            if (this.collisionEffect.leftToRightTimer >= 3) {
                this.collisionEffect.leftToRight = false;
                this.collisionEffect.leftToRightTimer = 0;
                this.wobbleAmplitude = 0.1;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }
    }
    
    applyRubberBandPhysics(deltaTime) {
        // 计算X和Y方向的距离
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
        // 机头始终朝右，基于垂直速度调整角度
        const verticalAngle = this.velocityY / this.maxSpeed * 0.3;
        
        // 结合晃晃悠悠的效果
        const wobbleAngle = Math.sin(this.wobbleTime * 2) * this.wobbleAmplitude;
        
        // 最终角度（机头朝右）
        this.angle = verticalAngle + wobbleAngle;
    }
    
    checkBounds() {
        // 边界检查，整个窗口都是飞机可移动的范围
        if (this.x < this.game.scrollX) {
            this.x = this.game.scrollX;
            this.velocityX = 0;
        }
        if (this.x + this.width > this.game.scrollX + this.game.width) {
            this.x = this.game.scrollX + this.game.width - this.width;
            this.velocityX = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
        if (this.y + this.height > this.game.height) {
            this.y = this.game.height - this.height;
            this.velocityY = 0;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        
        // 绘制折纸飞机（机头朝右）
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 飞机主体（机头朝右）
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2); // 机头在右侧中间
        ctx.lineTo(this.x, this.y); // 左侧上方
        ctx.lineTo(this.x, this.y + this.height); // 左侧下方
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