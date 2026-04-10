// 游戏主入口
window.addEventListener('DOMContentLoaded', () => {
    // 创建游戏引擎
    const game = new GameEngine('gameCanvas');
    
    // 创建纸飞机
    const paperPlane = new PaperPlane(game, 50, game.height / 2 - 10);
    game.addEntity(paperPlane);
    
    // 创建游戏状态
    const gameState = new GameState(game);
    game.addEntity(gameState);
    
    // 启动游戏
    game.start();
});