import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  baseRadius: number;
  color: string;
  vx: number;
  vy: number;
}

export const HalftoneBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000, radius: 250 }; // Increased radius for smoother, wider interaction

    const spacing = 18; // Space between dots
    const maxRadius = 6.5; // Max dot size in center

    // Helper to interpolate colors (dark -> tick green -> neon green -> white)
    const interpolateColor = (distRatio: number) => {
      let r1, g1, b1, r2, g2, b2, localRatio;
      
      if (distRatio < 0.33) {
        // Stop 1: Very Dark Green/Black (#040d06) -> Tick Green (#1e5028)
        r1 = 4; g1 = 13; b1 = 6;
        r2 = 30; g2 = 80; b2 = 40;
        localRatio = distRatio / 0.33;
      } else if (distRatio < 0.66) {
        // Stop 2: Tick Green (#1e5028) -> Neon Green (#c9ff00)
        r1 = 30; g1 = 80; b1 = 40;
        r2 = 201; g2 = 255; b2 = 0;
        localRatio = (distRatio - 0.33) / 0.33;
      } else {
        // Stop 3: Neon Green (#c9ff00) -> White
        r1 = 201; g1 = 255; b1 = 0;
        r2 = 255; g2 = 255; b2 = 255;
        localRatio = (distRatio - 0.66) / 0.34;
      }
      
      // Clamp localRatio just in case floating point math goes slightly out of bounds
      localRatio = Math.max(0, Math.min(1, localRatio));
      
      const r = Math.round(r1 + (r2 - r1) * localRatio);
      const g = Math.round(g1 + (g2 - g1) * localRatio);
      const b = Math.round(b1 + (b2 - b1) * localRatio);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const init = () => {
      particles = [];
      // Use offsetWidth/offsetHeight in case parent isn't window size exactly
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Calculate max distance to corner for normalized gradient
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      // Create grid of particles
      for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const distRatio = Math.min(dist / maxDist, 1);
          
          // Halftone effect: larger in center, smaller at edges
          // Non-linear falloff (power of 1.5) for a smoother gradient
          const radius = Math.max(0.5, maxRadius * (1 - Math.pow(distRatio, 1.5)));
          
          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            baseRadius: radius,
            color: interpolateColor(distRatio),
            vx: 0,
            vy: 0
          });
        }
      }
    };

    const animate = () => {
      // Clear canvas on every frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Physics for repel effect
        let dx = mouse.x - p.baseX;
        let dy = mouse.y - p.baseY;
        // Prevent distance from being 0 to avoid division by zero (which causes dots to disappear)
        let distance = Math.max(0.1, Math.sqrt(dx * dx + dy * dy));
        
        let targetX = p.baseX;
        let targetY = p.baseY;

        // If mouse is near particle, push it away
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // Smooth bell-curve-like force distribution
          const force = Math.pow((mouse.radius - distance) / mouse.radius, 1.5);
          const repelStrength = force * 60; // How far particles get pushed
          
          targetX = p.baseX - forceDirectionX * repelStrength;
          targetY = p.baseY - forceDirectionY * repelStrength;
        }

        // Fluid spring physics
        const spring = 0.04;
        const friction = 0.85;

        // Calculate force to target
        const ax = (targetX - p.x) * spring;
        const ay = (targetY - p.y) * spring;

        // Apply force to velocity, then add friction
        p.vx += ax;
        p.vy += ay;
        p.vx *= friction;
        p.vy *= friction;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0 bg-[#040d06]"
    />
  );
};
