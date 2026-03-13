"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const NUM_STARS = 220;
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.04 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Subtle nebula backdrop
      const grad = ctx.createRadialGradient(
        width * 0.3, height * 0.25, 0,
        width * 0.3, height * 0.25, width * 0.6
      );
      grad.addColorStop(0, "rgba(45, 27, 105, 0.18)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75, height * 0.7, 0,
        width * 0.75, height * 0.7, width * 0.5
      );
      grad2.addColorStop(0, "rgba(0, 100, 120, 0.1)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach((star) => {
        const twinkle = Math.sin(t * star.speed * 3 + star.twinkleOffset);
        const alpha = star.opacity + twinkle * 0.15;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${Math.max(0, alpha)})`;
        ctx.fill();

        // Occasional bright star with glow
        if (star.radius > 1.3) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(0, 242, 255, 0.6)";
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 242, 255, ${Math.max(0, alpha * 0.5)})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      t += 1;
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stars.forEach((star) => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="star-field"
      aria-hidden="true"
    />
  );
}
