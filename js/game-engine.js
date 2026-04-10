class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.entities = [];
        this.keys = {};
        this.mouse = { x: 100, y: this.height / 2 };
        this.gameTime = 0;
        this.score = 0;
        this.isRunning = false;
        this.scrollX = 0;
        this.scrollSpeed = 50;
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    bindEvents() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 鼠标事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // 触摸事件
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.touches[0].clientX - rect.left;
            this.mouse.y = e.touches[0].clientY - rect.top;
        });
    }
    
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.gameTime += deltaTime;
        
        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染游戏
        this.render();
        
        // 更新得分和时间显示
        this.updateUI();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        // 场景滚动
        this.scrollX += this.scrollSpeed * deltaTime;
        
        // 更新所有实体
        for (const entity of this.entities) {
            entity.update(deltaTime);
        }
        
        // 移除死亡实体
        this.entities = this.entities.filter(entity => !entity.dead);
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 保存当前状态
        this.ctx.save();
        
        // 应用滚动偏移
        this.ctx.translate(-this.scrollX, 0);
        
        // 绘制所有实体
        for (const entity of this.entities) {
            entity.render(this.ctx);
        }
        
        // 恢复状态
        this.ctx.restore();
    }
    
    drawBackground() {
        // 绘制天空背景
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制云朵
        this.ctx.fillStyle = 'white';
        const cloudSpeed = 0.5;
        const cloudOffset = (this.gameTime * cloudSpeed + this.scrollX * 0.1) % 200;
        
        // 绘制几朵云，考虑滚动效果
        for (let i = 0; i < 5; i++) {
            const x = (i * 200 - cloudOffset) % (this.width + 200);
            const y = 80 + Math.sin(i * 0.5) * 70;
            this.drawCloud(x, y);
        }
    }
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
        this.ctx.arc(x + 35, y - 15, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 15, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateUI() {
        document.getElementById('score').textContent = Math.floor(this.score);
        document.getElementById('time').textContent = Math.floor(this.gameTime);
    }
    
    getScore() {
        return Math.floor(this.score);
    }
    
    getTime() {
        return Math.floor(this.gameTime);
    }
}