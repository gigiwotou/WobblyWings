class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.dead = false;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        
        if (this.life <= 0) {
            this.dead = true;
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    addParticle(x, y, vx, vy, life, color) {
        this.particles.push(new Particle(x, y, vx, vy, life, color));
    }
    
    update(deltaTime) {
        for (const particle of this.particles) {
            particle.update(deltaTime);
        }
        
        this.particles = this.particles.filter(particle => !particle.dead);
    }
    
    render(ctx) {
        for (const particle of this.particles) {
            particle.render(ctx);
        }
    }
    
    emit(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const vx = -50 - Math.random() * 50;
            const vy = -20 + Math.random() * 40;
            const life = 0.5 + Math.random() * 0.5;
            const color = { r: 255, g: 0, b: 0 };
            
            this.addParticle(x, y, vx, vy, life, color);
        }
    }
}