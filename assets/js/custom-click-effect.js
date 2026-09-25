// assets/js/custom-click-effect.js
(function() {
  // 配置参数
  const config = {
    particleCount: 12,      // 每次点击产生的彩球数量
    baseSize: 10,           // 彩球基础大小
    speed: 8,               // 飞散初速度
    fadeSpeed: 0.03,        // 消失速度（0-1，越大消失越快）
    colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'] // 调色板
  };

  // 创建画布
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId;

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
      // 无重力，仅应用简单摩擦
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.alpha -= config.fadeSpeed;
    }

    draw() {
      ctx.globalAlpha = this.alpha;
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
      p.draw();
      if (p.isDead()) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
    }
  }

  // 监听全局点击事件
  document.addEventListener('click', function(e) {
    // 避免在输入框、按钮等交互元素上触发（可选）
    if (e.target.closest('input, textarea, button, a, select')) return;
    createParticles(e.clientX, e.clientY);
  });

})();
