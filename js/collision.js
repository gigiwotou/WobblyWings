class CollisionDetector {
    static checkCollision(a, b) {
        const boundsA = a.getBounds();
        const boundsB = b.getBounds();
        
        return (
            boundsA.x < boundsB.x + boundsB.width &&
            boundsA.x + boundsA.width > boundsB.x &&
            boundsA.y < boundsB.y + boundsB.height &&
            boundsA.y + boundsA.height > boundsB.y
        );
    }
    
    static checkAllCollisions(game) {
        const entities = game.entities;
        const player = entities.find(entity => entity instanceof PaperPlane);
        
        if (!player) return;
        
        for (const entity of entities) {
            if (entity instanceof Enemy) {
                if (this.checkCollision(player, entity)) {
                    // 统一的碰撞效果：降低90%速度，持续3秒
                    player.collisionEffect.speedReduction = true;
                    player.collisionEffect.speedReductionTimer += 3; // 每次碰撞累加3秒
                    
                    // 计算碰撞方向，实现弹开效果
                    const playerCenterX = player.x + player.width / 2;
                    const playerCenterY = player.y + player.height / 2;
                    const enemyCenterX = entity.x + entity.width / 2;
                    const enemyCenterY = entity.y + entity.height / 2;
                    
                    // 计算方向向量
                    const dx = playerCenterX - enemyCenterX;
                    const dy = playerCenterY - enemyCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        // 归一化方向向量
                        const normalizedDx = dx / distance;
                        const normalizedDy = dy / distance;
                        
                        // 弹开距离
                        const pushDistance = 50;
                        
                        // 玩家向后推
                        player.x += normalizedDx * pushDistance;
                        player.y += normalizedDy * pushDistance;
                        
                        // 敌机向后推
                        entity.x -= normalizedDx * pushDistance;
                        entity.y -= normalizedDy * pushDistance;
                        
                        // 给玩家一个初始速度，增强弹开效果
                        player.velocityX = normalizedDx * 200;
                        player.velocityY = normalizedDy * 200;
                    }
                    
                    // 增加得分
                    game.score += 20;
                }
            }
        }
    }
}