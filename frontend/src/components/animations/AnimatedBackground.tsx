import React, { useEffect, useRef, useState } from 'react';

interface AnimatedBackgroundProps {
  theme: 'day' | 'evening' | 'night';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle canvas resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Particle and animation system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = dimensions.width;
    const canvasHeight = dimensions.height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Particle system for floating elements
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      type: 'star' | 'cloud' | 'dot';

      constructor(type: 'star' | 'cloud' | 'dot') {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.type = type;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;

        if (this.type === 'star') {
          // Draw twinkling stars for night theme
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 'cloud') {
          // Draw soft cloud particles
          ctx.fillStyle = theme === 'day' ? '#ffffff' : theme === 'evening' ? '#ffb347' : '#4a5568';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw glowing dots (airports)
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Airplane path with trail
    class AirplanePath {
      points: { x: number; y: number }[] = [];
      progress: number = 0;
      speed: number = 0.001;

      constructor() {
        // Create curved flight path
        const startX = Math.random() * canvasWidth;
        const startY = canvasHeight + 50;
        const endX = Math.random() * canvasWidth;
        const endY = -50;
        const controlX = canvasWidth / 2 + (Math.random() - 0.5) * canvasWidth * 0.5;
        const controlY = canvasHeight / 2;

        // Generate bezier curve points
        for (let t = 0; t <= 1; t += 0.01) {
          const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
          const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
          this.points.push({ x, y });
        }
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
      }

      draw() {
        if (!ctx || this.points.length === 0) return;

        const currentIndex = Math.floor(this.progress * this.points.length);
        const currentPoint = this.points[currentIndex];

        // Draw trail
        ctx.save();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = Math.max(0, currentIndex - 30); i < currentIndex; i++) {
          const point = this.points[i];
          const alpha = (i - (currentIndex - 30)) / 30;
          ctx.globalAlpha = alpha * 0.3;
          
          if (i === Math.max(0, currentIndex - 30)) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        ctx.stroke();

        // Draw airplane icon
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#3b82f6';
        ctx.save();
        ctx.translate(currentPoint.x, currentPoint.y);
        
        // Calculate rotation based on path direction
        if (currentIndex < this.points.length - 1) {
          const nextPoint = this.points[currentIndex + 1];
          const angle = Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x);
          ctx.rotate(angle + Math.PI / 2);
        }

        // Draw airplane shape
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(-4, 4);
        ctx.lineTo(0, 2);
        ctx.lineTo(4, 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        ctx.restore();
      }
    }

    // Radar sweep animation
    class RadarSweep {
      angle: number = 0;
      speed: number = 0.02;
      centerX: number;
      centerY: number;
      radius: number = 150;

      constructor() {
        this.centerX = Math.random() * canvasWidth;
        this.centerY = Math.random() * canvasHeight;
      }

      update() {
        this.angle += this.speed;
        if (this.angle > Math.PI * 2) this.angle = 0;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        
        // Draw radar circles
        for (let i = 1; i <= 3; i++) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (4 - i)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(this.centerX, this.centerY, this.radius * i / 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw sweep line
        const gradient = ctx.createLinearGradient(
          this.centerX,
          this.centerY,
          this.centerX + Math.cos(this.angle) * this.radius,
          this.centerY + Math.sin(this.angle) * this.radius
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(
          this.centerX + Math.cos(this.angle) * this.radius,
          this.centerY + Math.sin(this.angle) * this.radius
        );
        ctx.stroke();

        ctx.restore();
      }
    }

    // Initialize elements based on theme
    let particles: Particle[] = [];
    let airplanePaths: AirplanePath[] = [];
    let radarSweeps: RadarSweep[] = [];

    const initializeElements = () => {
      particles = [];
      airplanePaths = [];
      radarSweeps = [];

      // Create particles based on theme
      const particleType = theme === 'night' ? 'star' : 'cloud';
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(particleType));
      }

      // Add glowing airport dots
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle('dot'));
      }

      // Create airplane paths
      for (let i = 0; i < 3; i++) {
        airplanePaths.push(new AirplanePath());
      }

      // Create radar sweeps
      for (let i = 0; i < 2; i++) {
        radarSweeps.push(new RadarSweep());
      }
    };

    initializeElements();

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw all elements
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      airplanePaths.forEach(path => {
        path.update();
        path.draw();
      });

      radarSweeps.forEach(radar => {
        radar.update();
        radar.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};
