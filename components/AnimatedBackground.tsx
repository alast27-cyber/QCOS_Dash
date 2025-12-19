import React, { useEffect, useRef } from 'react';

const PARALLAX_STRENGTH = 40;

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const viewOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles: Particle[] = [];

    const handleMouseMove = (event: MouseEvent) => {
        mouse.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x + viewOffset.current.x, this.y + viewOffset.current.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(0, 255, 255, 0.8)';
        ctx!.fill();
      }
    }

    function createParticles() {
      particles = [];
      const particleCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const p1x = particles[i].x + viewOffset.current.x;
          const p1y = particles[i].y + viewOffset.current.y;
          const p2x = particles[j].x + viewOffset.current.x;
          const p2y = particles[j].y + viewOffset.current.y;
          
          const dist = Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));

          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(p1x, p1y);
            ctx!.lineTo(p2x, p2y);
            ctx!.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 120})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
    }
    
    let animationFrameId: number;
    function animate() {
      const targetX = (mouse.current.x / width - 0.5) * -PARALLAX_STRENGTH;
      const targetY = (mouse.current.y / height - 0.5) * -PARALLAX_STRENGTH;
      viewOffset.current.x += (targetX - viewOffset.current.x) * 0.05;
      viewOffset.current.y += (targetY - viewOffset.current.y) * 0.05;

      ctx!.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    }
  }, []);

  return <canvas ref={canvasRef} id="animated-bg" />;
};

export default AnimatedBackground;