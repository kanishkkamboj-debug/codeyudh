// ⚔️ 3D Cyber-Sword Cursor with inertial physics, particle trails & slash effects
import { battleAudio } from './audio.js';

export class SwordCursor {
  constructor() {
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.prevPos = { x: this.pos.x, y: this.pos.y };
    this.angle = -45;
    this.targetAngle = -45;
    this.speed = 0;
    this.isSlashing = false;
    this.isHoveringInteractive = false;
    this.particles = [];
    this.slashes = [];

    this.container = document.createElement('div');
    this.container.id = 'sword-cursor-container';
    this.container.innerHTML = `
      <canvas id="sword-canvas"></canvas>
      <div id="sword-element" class="sword-element">
        <div class="sword-blade">
          <div class="blade-core"></div>
          <div class="blade-glow"></div>
          <div class="blade-runes">&lt;/&gt;</div>
        </div>
        <div class="sword-tsuba"></div>
        <div class="sword-hilt"></div>
      </div>
      <div id="sword-hud" class="sword-hud">
        <span class="hud-text">TARGET LOCKED</span>
      </div>
    `;

    document.body.appendChild(this.container);

    this.canvas = document.getElementById('sword-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.swordEl = document.getElementById('sword-element');
    this.hudEl = document.getElementById('sword-hud');

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));

    this.setupHoverListeners();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onMouseDown(e) {
    battleAudio.ensureContext();
    battleAudio.playSlash();
    this.triggerSlash(e.clientX, e.clientY);
  }

  triggerSlash(x, y, customAngle = null) {
    this.isSlashing = true;
    const slashAngle = customAngle !== null ? customAngle : (Math.PI / 4);

    this.slashes.push({
      x,
      y,
      angle: slashAngle,
      length: 180,
      opacity: 1,
      width: 6,
      createdAt: performance.now()
    });

    // Spawn sparks & code glyphs
    const glyphs = ['</>', '{ }', '=>', '01', 'yudh', 'const', '0x1F', '⚔️'];
    for (let i = 0; i < 22; i++) {
      const angle = slashAngle + (Math.random() - 0.5) * 1.5;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 4,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.4 ? '#ffffff' : '#ffe600',
        alpha: 1,
        life: 0.9,
        glyph: Math.random() > 0.6 ? glyphs[Math.floor(Math.random() * glyphs.length)] : null
      });
    }

    // Temporary sword slash animation class
    this.swordEl.classList.add('slashing');
    setTimeout(() => {
      this.swordEl.classList.remove('slashing');
      this.isSlashing = false;
    }, 280);
  }

  setupHoverListeners() {
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, a, .interactive, .seal-trigger, .chain-link, .weapon-card, .track-card, .faq-tablet');
      if (target) {
        this.isHoveringInteractive = true;
        this.swordEl.classList.add('charged');

        const customHud = target.getAttribute('data-hud');
        if (customHud) {
          this.hudEl.querySelector('.hud-text').textContent = customHud;
          this.hudEl.classList.add('visible');
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('button, a, .interactive, .seal-trigger, .chain-link, .weapon-card, .track-card, .faq-tablet');
      if (target) {
        this.isHoveringInteractive = false;
        this.swordEl.classList.remove('charged');
        this.hudEl.classList.remove('visible');
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Inertial lerp movement
    const dx = this.mouse.x - this.pos.x;
    const dy = this.mouse.y - this.pos.y;
    this.pos.x += dx * 0.22;
    this.pos.y += dy * 0.22;

    this.speed = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle towards movement if moving fast enough
    if (this.speed > 2 && !this.isSlashing) {
      const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
      this.targetAngle = moveAngle;
    } else if (this.isHoveringInteractive) {
      this.targetAngle = -35;
    } else {
      this.targetAngle = -45;
    }

    // Smooth angle interpolation
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff < -180) angleDiff += 360;
    while (angleDiff > 180) angleDiff -= 360;
    this.angle += angleDiff * 0.15;

    // Position sword element
    this.swordEl.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) rotate(${this.angle}deg)`;
    this.hudEl.style.transform = `translate3d(${this.pos.x + 35}px, ${this.pos.y - 30}px, 0)`;

    // Spawn movement particle trail
    if (this.speed > 3) {
      this.particles.push({
        x: this.pos.x,
        y: this.pos.y,
        vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
        vy: (Math.random() - 0.5) * 1.5 - dy * 0.05,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.5 ? '#fbbf24' : '#38bdf8',
        alpha: 0.8,
        life: 0.95
      });
    }

    // Render Canvas particles & slashes
    this.renderCanvas();
  }

  renderCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render sword slashes
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      const s = this.slashes[i];
      s.opacity -= 0.04;

      if (s.opacity <= 0) {
        this.slashes.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate(s.angle);

      // Primary slash light streak
      const grad = this.ctx.createLinearGradient(-s.length / 2, 0, s.length / 2, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(0.7, `rgba(255, 230, 0, ${s.opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(255, 230, 0, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = s.width * s.opacity;
      this.ctx.shadowColor = '#ffe600';
      this.ctx.shadowBlur = 10;

      this.ctx.beginPath();
      this.ctx.moveTo(-s.length / 2, 0);
      this.ctx.lineTo(s.length / 2, 0);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // Render particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha *= p.life;

      if (p.alpha < 0.02) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.glyph) {
        this.ctx.save();
        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 6;
        this.ctx.fillText(p.glyph, p.x, p.y);
        this.ctx.restore();
      } else {
        this.ctx.save();
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }
}
