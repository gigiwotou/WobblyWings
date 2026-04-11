class GameState {
    constructor(game) {
        this.game = game;
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 1.5;
        this.difficultyIncreaseTimer = 0;
        this.difficultyIncreaseInterval = 10;
        this.giantEnemyTimer = 0;
        this.giantEnemyInterval = 30; // 每30秒生成一个巨型敌人
        this.leftToRightEnemyTimer = 0;
        this.leftToRightEnemyInterval = 5; // 每5秒生成一个从左向右飞行的敌人
        this.dead = false;
    }
    
    update(deltaTime) {
        // 敌人生成
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // 巨型敌人
        this.giantEnemyTimer += deltaTime;
        if (this.giantEnemyTimer >= this.giantEnemyInterval) {
            this.spawnGiantEnemy();
            this.giantEnemyTimer = 0;
        }
        
        // 从左向右飞行的敌人
        this.leftToRightEnemyTimer += deltaTime;
        if (this.leftToRightEnemyTimer >= this.leftToRightEnemyInterval) {
            this.spawnLeftToRightEnemy();
            this.leftToRightEnemyTimer = 0;
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
        if (Math.random() < 0.85) {
            // 85% 概率生成直线飞行敌人
            this.game.addEntity(new StraightEnemy(this.game, x, y));
        } else {
            // 15% 概率生成追踪敌人（降低50%频率）
            this.game.addEntity(new TrackerEnemy(this.game, x, y));
        }
    }
    
    spawnGiantEnemy() {
        const x = this.game.scrollX + this.game.width;
        const y = Math.random() * (this.game.height - 100);
        this.game.addEntity(new GiantEnemy(this.game, x, y));
    }
    
    spawnLeftToRightEnemy() {
        const x = this.game.scrollX - 50; // 从屏幕左侧外生成
        const y = Math.random() * (this.game.height - 50);
        this.game.addEntity(new LeftToRightEnemy(this.game, x, y));
    }
    
    increaseDifficulty() {
        // 减少敌人生成间隔，增加游戏难度
        if (this.enemySpawnInterval > 0.5) {
            this.enemySpawnInterval -= 0.1;
        }
    }
}