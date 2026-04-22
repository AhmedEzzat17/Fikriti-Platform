import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────────────────────────────────────────────────
   Hero – Modern, streamlined landing section (LTR & RTL aware)
──────────────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();
  const isRtl = currentLang === "ar";

  return (
    <section id="hero" className="hero-modern">
      {/* ── Background & Smart Overlay ── */}
      <div className="hero-bg">
        <img
          src="/assets/images/computer-8779040_1280.jpg"
          alt="Fikriti hero background"
          loading="eager"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="container relative z-10">
        <div className="row justify-content-center text-center">
          {/* Centered layout */}
          <div className="col-xl-9 col-lg-10 hero-content" data-aos="fade-up">
            <h1 className="hero-title">
              {t("hero_title").replace(".", "")}
              <span style={{ color: "var(--main-color)" }}>.</span>
            </h1>

            <p className="hero-desc">{t("hero_paragraph")}</p>

            {/* ── CTA Buttons ── */}
            <div className="hero-cta-row justify-content-center">
              <button
                className="hero-btn hero-btn--outline"
                onClick={() => navigate("/services")}
              >
                <i
                  className={`fas fa-arrow-${isRtl ? "left" : "right"}`}
                  style={{ margin: isRtl ? "0 0 0 8px" : "0 8px 0 0" }}
                ></i>
                {t("hero_products")}
              </button>

              <button
                className="hero-btn hero-btn--outline"
                onClick={() => navigate("/portfolio")}
              >
                <i
                  className="fas fa-briefcase"
                  style={{ margin: isRtl ? "0 0 0 8px" : "0 8px 0 0" }}
                ></i>
                {t("ourPortfolio")}
              </button>
              <button
                className="hero-btn  hero-btn--primary"
                onClick={() => navigate("/contact")}
              >
                <i
                  className="fas fa-paper-plane"
                  style={{ margin: isRtl ? "0 0 0 8px" : "0 8px 0 0" }}
                ></i>
                {t("contact")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
