class GameState {
    constructor(game) {
        this.game = game;
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 1.5;
        this.difficultyIncreaseTimer = 0;
        this.difficultyIncreaseInterval = 10;
    }
    
    update(deltaTime) {
        // 敌人生成
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // 难度递增
        this.difficultyIncreaseTimer += deltaTime;
        if (this.difficultyIncreaseTimer >= this.difficultyIncreaseInterval) {
            this.increaseDifficulty();
            this.difficultyIncreaseTimer = 0;
        }
        
        // 碰撞检测
        CollisionDetector.checkAllCollisions(this.game);
    }
    
    spawnEnemy() {
        const x = this.game.scrollX + this.game.width;
        const y = Math.random() * (this.game.height - 50);
        
        // 随机生成不同类型的敌人
        if (Math.random() < 0.7) {
            // 70% 概率生成直线飞行敌人
            this.game.addEntity(new StraightEnemy(this.game, x, y));
        } else {
            // 30% 概率生成追踪敌人
            this.game.addEntity(new TrackerEnemy(this.game, x, y));
        }
    }
    
    increaseDifficulty() {
        // 减少敌人生成间隔，增加游戏难度
        if (this.enemySpawnInterval > 0.5) {
            this.enemySpawnInterval -= 0.1;
        }
    }
}