// assets/js/custom-click-effect.js
(function() {
  const config = {
    particleCount: 12,
    baseSize: 10,
    speed: 8,
    fadeSpeed: 0.03,
    colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93']
  };

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * config.speed + 2;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity;
      this.radius = Math.random() * config.baseSize + 4;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.alpha = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.alpha -= config.fadeSpeed;
    }

    draw() {
      // 关键修复：钳制 alpha 到 [0, 1]，避免负值导致浏览器保留旧值
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    isDead() {
      return this.alpha <= 0;
    }
  }

  function createParticles(x, y) {
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle(x, y));
    }
    if (!animationId) {
      animate();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();

      // 关键修复：先判断死亡并移除，再决定是否绘制
      if (p.isDead()) {
        particles.splice(i, 1);
        continue;
      }

      p.draw();
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      // 关键修复：动画结束后再清一次画布，防止最后一帧残留
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animationId = null;
    }
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('input, textarea, button, a, select')) return;
    createParticles(e.clientX, e.clientY);
  });

})();
