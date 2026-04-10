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
                    // 碰撞发生
                    game.stop();
                    player.destroy();
                    
                    // 跳转到游戏结束页面
                    setTimeout(() => {
                        window.location.href = `gameover.html?score=${game.getScore()}&time=${game.getTime()}`;
                    }, 500);
                    
                    break;
                }
            }
        }
    }
}