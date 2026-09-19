import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import apiClient from "../api/client";
import LoginGateModal from "../components/LoginGateModal";
import "./LoginPage.css";

class Particle {
  x: number = 0;
  y: number = 0;
  size: number = 1;
  speedX: number = 0;
  speedY: number = 0;
  opacity: number = 0.5;
  color: string = "";
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color =
      Math.random() > 0.5
        ? `rgba(13, 131, 253, ${this.opacity})`
        : `rgba(96, 239, 255, ${this.opacity})`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > this.canvasWidth) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.speedY *= -1;

    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const force = 0.0001;

    this.speedX += dx * force;
    this.speedY += dy * force;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(")", ", 0.1)");
    ctx.fill();
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang, t } = useLanguage();
  const isRTL = currentLang === "ar";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorLightRef = useRef<HTMLDivElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; global?: string }>({});
  const [loading, setLoading] = useState(false);
  const [boxMounted, setBoxMounted] = useState(false);
  const [showGateModal, setShowGateModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBoxMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check Login Access Gate Status
  useEffect(() => {
    const checkGateStatus = async () => {
      const alreadyPassed = sessionStorage.getItem("login_gate_passed") === "true";
      if (alreadyPassed) {
        setShowGateModal(false);
        return;
      }
      try {
        const res = await apiClient.get<{ enabled: boolean }>("/auth/login-gate/status");
        if (res.enabled) {
          setShowGateModal(true);
        }
      } catch {
        // Fallback to enabling gate modal if status check fails
        setShowGateModal(true);
      }
    };
    checkGateStatus();
  }, []);

  // Background Canvas Animation & Mouse light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;

    const trails: HTMLDivElement[] = [];
    const maxTrails = 10;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = 90;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorLightRef.current) {
        cursorLightRef.current.style.left = `${mouseX}px`;
        cursorLightRef.current.style.top = `${mouseY}px`;
      }

      if (Math.abs(mouseX - lastMouseX) > 5 || Math.abs(mouseY - lastMouseY) > 5) {
        const trail = document.createElement("div");
        trail.className = "login-cursor-trail";
        trail.style.left = `${mouseX}px`;
        trail.style.top = `${mouseY}px`;
        document.body.appendChild(trail);
        trails.push(trail);

        if (trails.length > maxTrails) {
          const oldTrail = trails.shift();
          oldTrail?.remove();
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            const opacity = 0.12 * (1 - distance / 110);
            ctx.strokeStyle = `rgba(13, 131, 253, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        const dx = particles[i].x - mouseX;
        const dy = particles[i].y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          ctx.beginPath();
          const opacity = 0.25 * (1 - distance / 140);
          ctx.strokeStyle = `rgba(96, 239, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();

          const angle = Math.atan2(dy, dx);
          const force = (140 - distance) / 140;
          particles[i].speedX += Math.cos(angle) * force * 0.08;
          particles[i].speedY += Math.sin(angle) * force * 0.08;
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, "rgba(13, 131, 253, 0.12)");
      gradient.addColorStop(0.5, "rgba(10, 25, 41, 0.85)");
      gradient.addColorStop(1, "#020617");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      drawLines();

      trails.forEach((trail, index) => {
        trail.style.opacity = `${1 - index / maxTrails}`;
        trail.style.transform = `scale(${1 - index / maxTrails})`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      trails.forEach((t) => t.remove());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = t("login_err_email_required") || (isRTL ? "الرجاء إدخال البريد الإلكتروني" : "Please enter your email address");
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = t("login_err_email_invalid") || (isRTL ? "صيغة البريد الإلكتروني غير صحيحة" : "Please enter a valid email address");
    }

    if (!password) {
      newErrors.password = t("login_err_password_required") || (isRTL ? "الرجاء إدخال كلمة المرور" : "Please enter your password");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const responseData = await apiClient.post<any>("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = responseData?.access_token || responseData?.data?.access_token;
      const user = responseData?.user || responseData?.data?.user;

      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user", JSON.stringify(user || {}));

        if (user?.role === "admin" || !user?.role) {
          navigate("/admin");
        } else {
          navigate("/");
        }
        return;
      }

      setErrors({
        global: t("login_err_credentials") || (isRTL
          ? "بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور."
          : "The provided credentials are incorrect. Please check your email and password.")
      });
    } catch (err: any) {
      const errMsg = err?.message || "";
      let friendlyMsg = "";

      if (errMsg.includes("credentials") || errMsg.includes("incorrect") || errMsg.includes("Unprocessable") || errMsg.includes("422")) {
        friendlyMsg = t("login_err_credentials") || (isRTL
          ? "بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور."
          : "The provided credentials are incorrect. Please check your email and password.");
      } else {
        friendlyMsg = t("login_err_server") || (isRTL
          ? "تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الـ API والاتصال بالشبكة."
          : "Unable to connect to the server. Please check your connection and try again.");
      }

      setErrors({ global: friendlyMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container" dir={isRTL ? "rtl" : "ltr"}>
      {/* Login Access Gatekeeper Security Modal */}
      <LoginGateModal
        isOpen={showGateModal}
        onSuccess={() => setShowGateModal(false)}
      />
      <div ref={cursorLightRef} className="login-cursor-light" />
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />
      <canvas ref={canvasRef} className="login-bg-canvas" />

      <div
        className="login-box"
        style={{
          opacity: boxMounted ? 1 : 0,
          transform: boxMounted ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <button
          type="button"
          className="login-close-btn"
          onClick={() => navigate("/")}
          title={t("login_close") || (isRTL ? "إغلاق" : "Close")}
        >
          &times;
        </button>

        {/* Fikriti Brand Logo Header */}
        <div className="login-header-logo">
          <img
            src="/assets/images/i-removebg-preview.png"
            alt="Fikriti Logo"
            className="login-logo-img"
          />
        </div>

        <h2>{t("login_title") || (isRTL ? "تسجيل الدخول" : "Sign In")}</h2>
        <p className="login-subtitle">
          {t("login_subtitle") || (isRTL ? "أهلاً بك في منصة فكرتي للحلول البرمجية المتكاملة" : "Welcome to Fikriti Platform for Integrated Software Solutions")}
        </p>

        {errors.global && (
          <div
            className="login-global-error"
            dir={isRTL ? "rtl" : "ltr"}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            <svg style={{ width: 20, height: 20, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field with SVG Envelope Icon */}
          <div className="login-form-group">
            <label className="login-form-label">
              {t("login_email_label") || (isRTL ? "البريد الإلكتروني" : "Email Address")}
            </label>
            <div className="login-input-wrapper">
              <svg
                className="login-input-icon-svg"
                style={{ right: isRTL ? "16px" : "auto", left: isRTL ? "auto" : "16px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`login-form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="name@company.com"
                style={{
                  paddingRight: isRTL ? "48px" : "16px",
                  paddingLeft: isRTL ? "16px" : "48px",
                  textAlign: isRTL ? "right" : "left",
                }}
                autoFocus
              />
            </div>
            {errors.email && <div className="login-error-message">{errors.email}</div>}
          </div>

          {/* Password Field with SVG Lock Icon & SVG Eye Toggle */}
          <div className="login-form-group">
            <label className="login-form-label">
              {t("login_password_label") || (isRTL ? "كلمة المرور" : "Password")}
            </label>
            <div className="login-input-wrapper">
              <svg
                className="login-input-icon-svg"
                style={{ right: isRTL ? "16px" : "auto", left: isRTL ? "auto" : "16px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`login-form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="••••••••"
                style={{
                  paddingRight: isRTL ? "48px" : "48px",
                  paddingLeft: isRTL ? "48px" : "48px",
                  textAlign: isRTL ? "right" : "left",
                }}
              />
              <button
                type="button"
                className="login-toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{ left: isRTL ? "14px" : "auto", right: isRTL ? "auto" : "14px" }}
                title={showPassword ? (isRTL ? "إخفاء كلمة المرور" : "Hide Password") : (isRTL ? "إظهار كلمة المرور" : "Show Password")}
              >
                {showPassword ? (
                  /* SVG Eye Off Icon */
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.158-6.158a3 3 0 104.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"
                    />
                  </svg>
                ) : (
                  /* SVG Eye Open Icon */
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <div className="login-error-message">{errors.password}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading
              ? (t("login_authenticating") || (isRTL ? "جاري التحقق..." : "Authenticating..."))
              : (t("login_button") || (isRTL ? "تسجيل الدخول" : "Sign In"))}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
