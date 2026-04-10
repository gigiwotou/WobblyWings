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
                    // 根据敌人类型触发不同的碰撞效果
                    if (entity instanceof GiantEnemy) {
                        // 巨型敌人碰撞效果
                        player.collisionEffect.giant = true;
                        player.collisionEffect.giantTimer = 0;
                    } else if (entity instanceof LeftToRightEnemy) {
                        // 从左向右飞行的敌人碰撞效果
                        player.collisionEffect.leftToRight = true;
                        player.collisionEffect.leftToRightTimer = 0;
                    } else {
                        // 普通敌人碰撞效果
                        player.collisionEffect.normal = true;
                        player.collisionEffect.normalTimer = 0;
                    }
                    
                    // 敌人被碰撞后消失
                    entity.dead = true;
                    
                    // 增加得分
                    game.score += 20;
                }
            }
        }
    }
}