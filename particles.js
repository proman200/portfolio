class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#00f0ff', '#ff00aa', '#ffd700', '#ffffff'];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const size = Math.random() * 2 + 1;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const speedX = Math.random() * 1 - 0.5;
        const speedY = Math.random() * 1 - 0.5;
        const alpha = Math.random() * 0.5 + 0.2;
        
        return {
            x,
            y,
            size,
            color,
            speedX,
            speedY,
            alpha,
            baseAlpha: alpha,
            vx: speedX,
            vy: speedY
        };
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        window.addEventListener('click', (e) => {
            this.explodeParticles(e.x, e.y);
        });
    }
    
    explodeParticles(x, y) {
        this.particles.forEach(particle => {
            const dx = particle.x - x;
            const dy = particle.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const force = (200 - distance) / 200;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * force * 10;
                particle.vy += Math.sin(angle) * force * 10;
            }
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            if (Math.abs(particle.vx) < 0.1) {
                particle.vx = (Math.random() * 1 - 0.5) * 0.5;
            }
            if (Math.abs(particle.vy) < 0.1) {
                particle.vy = (Math.random() * 1 - 0.5) * 0.5;
            }
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const repelForce = force * 0.5;
                    particle.vx += Math.cos(angle) * repelForce;
                    particle.vy += Math.sin(angle) * repelForce;
                    
                    particle.alpha = particle.baseAlpha + force * 0.5;
                } else {
                    particle.alpha = particle.baseAlpha;
                }
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
            
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
        });
        
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
        
        this.drawConnections();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

class CursorTrail {
    constructor() {
        this.trail = document.getElementById('cursor-trail');
        this.trailElements = [];
        this.trailCount = 20;
        this.mouse = { x: 0, y: 0 };
        this.currentX = 0;
        this.currentY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.animateTrail();
    }
    
    animateTrail() {
        const targetX = this.mouse.x - 5;
        const targetY = this.mouse.y - 5;
        
        this.currentX += (targetX - this.currentX) * 0.3;
        this.currentY += (targetY - this.currentY) * 0.3;
        
        this.trail.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.getSpeed()})`;
        this.trail.style.opacity = Math.min(this.getSpeed() * 0.5, 1);
        
        requestAnimationFrame(() => this.animateTrail());
    }
    
    getSpeed() {
        const dx = this.mouse.x - this.currentX;
        const dy = this.mouse.y - this.currentY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        return Math.min(speed / 20, 2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    new CursorTrail();
});