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
        this.fourAmEventTriggered = false;
        this.fourAmTimer = 0;
        
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
        
        // 检查凌晨四点事件
        const timeOfDay = (8 + (this.gameTime / 36)) % 24; // 每36秒为一天，开始于早上8点
        if (timeOfDay >= 4 && timeOfDay < 4.1 && !this.fourAmEventTriggered) {
            this.triggerFourAmEvent();
        }
        
        // 处理四点事件的10秒倒计时
        if (this.fourAmEventTriggered) {
            this.fourAmTimer += deltaTime;
            if (this.fourAmTimer >= 10) {
                this.endGame();
            }
        }
        
        // 更新所有实体
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(deltaTime);
            }
        }
        
        // 移除死亡实体
        this.entities = this.entities.filter(entity => !entity.dead);
    }
    
    triggerFourAmEvent() {
        this.fourAmEventTriggered = true;
        this.fourAmTimer = 0;
        
        // 创建并显示消息元素
        const messageElement = document.createElement('div');
        messageElement.id = 'four-am-message';
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.fontSize = '36px';
        messageElement.style.fontFamily = 'Arial, sans-serif';
        messageElement.style.color = 'white';
        messageElement.style.textAlign = 'center';
        messageElement.style.zIndex = '1000';
        messageElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        messageElement.innerHTML = '四点了。<br>但生活，不会停。';
        
        document.body.appendChild(messageElement);
    }
    
    endGame() {
        this.stop();
        window.location.href = 'index.html';
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
            if (typeof entity.render === 'function') {
                entity.render(this.ctx);
            }
        }
        
        // 恢复状态
        this.ctx.restore();
    }
    
    drawBackground() {
        // 计算一天中的时间（0-24小时），游戏开始时是早上8点
        // 游戏时间流速是现实的100倍，所以1秒游戏时间 = 100秒现实时间
        // 36秒游戏时间 = 1小时现实时间
        const timeOfDay = (8 + (this.gameTime / 36)) % 24; // 每36秒为一天，开始于早上8点
        
        // 根据时间设置背景颜色
        let skyColor;
        if (timeOfDay < 4) {
            // 凌晨
            skyColor = '#0a1128';
        } else if (timeOfDay < 6) {
            // 黎明
            skyColor = '#4a5568';
        } else if (timeOfDay < 9) {
            // 早晨
            skyColor = '#87CEEB';
        } else if (timeOfDay < 12) {
            // 上午
            skyColor = '#4DA6FF';
        } else if (timeOfDay < 16) {
            // 正午
            skyColor = '#3B82F6';
        } else if (timeOfDay < 18) {
            // 下午
            skyColor = '#60A5FA';
        } else if (timeOfDay < 20) {
            // 黄昏
            skyColor = '#FF8C42';
        } else if (timeOfDay < 22) {
            // 晚上
            skyColor = '#1E40AF';
        } else {
            // 深夜
            skyColor = '#0F172A';
        }
        
        // 绘制天空背景
        this.ctx.fillStyle = skyColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制太阳和月亮
        this.drawSunMoon(timeOfDay);
        
        // 绘制云朵（只在白天显示）
        if (timeOfDay >= 6 && timeOfDay < 18) {
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
        
        // 绘制星星（只在晚上显示）
        if (timeOfDay >= 20 || timeOfDay < 4) {
            this.drawStars();
        }
    }
    
    drawSunMoon(timeOfDay) {
        const centerX = this.width / 2;
        const centerY = this.height / 4; // 偏上显示
        
        // 计算太阳和月亮的位置
        // 调整角度范围，让太阳和月亮从地平线升起和落下
        // 从早上8点开始，太阳已经升到一定高度
        let normalizedTime, angle;
        
        if (timeOfDay >= 6 && timeOfDay < 19) {
            // 白天：6点到19点
            normalizedTime = (timeOfDay - 6) / 13; // 13小时周期
            angle = normalizedTime * Math.PI - Math.PI / 2; // 从底部开始，到顶部结束
        } else {
            // 晚上：19点到6点
            normalizedTime = (timeOfDay - 19 + 24) % 24 / 11; // 11小时周期
            angle = normalizedTime * Math.PI - Math.PI / 2; // 从底部开始，到顶部结束
        }
        
        const radius = Math.min(this.width, this.height) * 0.6; // 调整半径，让太阳运动更明显
        
        const sunX = centerX + Math.cos(angle) * radius;
        const sunY = centerY + Math.sin(angle) * radius;
        
        // 绘制月亮（晚上，19点以后升起）
        if (timeOfDay >= 19 || timeOfDay < 6) {
            this.ctx.fillStyle = '#F3F4F6';
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制月亮的暗面
            this.ctx.fillStyle = timeOfDay >= 19 ? '#1E40AF' : '#4a5568';
            this.ctx.beginPath();
            this.ctx.arc(sunX - 10, sunY - 10, 40, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 绘制太阳（白天，6点到19点）
        if (timeOfDay >= 6 && timeOfDay < 19) {
            this.ctx.fillStyle = '#FBBF24';
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制太阳光芒
            this.ctx.strokeStyle = '#FDE68A';
            this.ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const startX = sunX + Math.cos(angle) * 40;
                const startY = sunY + Math.sin(angle) * 40;
                const endX = sunX + Math.cos(angle) * 55;
                const endY = sunY + Math.sin(angle) * 55;
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height / 2;
            const size = Math.random() * 2 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
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
        try {
            // 更新指针钟显示
            const timeOfDay = (8 + (this.gameTime / 36)) % 24; // 每36秒为一天，开始于早上8点
            const hours = timeOfDay;
            const minutes = (timeOfDay - Math.floor(timeOfDay)) * 60;
            
            // 计算指针旋转角度
            const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 每小时30度，每分钟0.5度
            const minuteAngle = minutes * 6;
            
            // 更新时针
            const hourHand = document.getElementById('hourHand');
            if (hourHand) {
                hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
            }
            
            // 更新分针
            const minuteHand = document.getElementById('minuteHand');
            if (minuteHand) {
                minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
            }
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    }
    
    getScore() {
        return Math.floor(this.score);
    }
    
    getTime() {
        return Math.floor(this.gameTime);
    }
}