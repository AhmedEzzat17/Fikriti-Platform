import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./NotFoundPage.css";

const NotFound: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRtl = currentLang === "ar";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Interactive Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? "rgba(13, 131, 253, 0.4)" : "rgba(96, 239, 255, 0.4)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect close particles with dynamic cyan/blue glowing lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(13, 131, 253, ${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="notfound-page-container" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background Interactive Elements */}
      <canvas ref={canvasRef} className="notfound-bg-canvas" />
      <div className="notfound-bg-grid" />
      <div className="notfound-ambient-glow" />

      {/* Main Glassmorphism Card */}
      <div className="notfound-card">
        {/* Status Badge */}
        <div className="notfound-badge">
          <span className="notfound-badge-dot" />
          <span>{isRtl ? "خطأ الصفحة غير موجودة" : "404 Error — Page Not Found"}</span>
        </div>

        {/* 404 Typography */}
        <h1 className="notfound-code">404</h1>

        {/* Heading */}
        <h2 className="notfound-title">
          {isRtl ? "الصفحة غير موجودة" : "The Page Are Looking For Doesn't Exist"}
        </h2>

        {/* Description */}
        <p className="notfound-desc">
          {isRtl
            ? "الرابط الذي حاولت اتباعه قد يكون مكسوراً أو تم نقل الصفحة. لا تقلق، فريقنا الهندسي متواجد لمساعدتك دائماً."
            : "The link you followed may be broken, or the page has been moved. Don't worry, our engineering team is always here to assist."}
        </p>

        {/* Action Buttons */}
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary">
            <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
            <span>{isRtl ? "←" : "→"}</span>
          </Link>

          <Link to="/contact" className="notfound-btn-secondary">
            <span>{isRtl ? "التواصل مع الدعم" : "Contact Support"}</span>
          </Link>

         
        </div>

        {/* Card Footer */}
        <div className="notfound-footer">
          <span>Fikriti Software Agency &copy; {new Date().getFullYear()}</span>
          <span className="notfound-err-code">ERR_ROUTE_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
