import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const CtaSection: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();

  return (
    <section 
      className="py-4 my-5" 
      style={{ 
        background: "linear-gradient(135deg, var(--main-color), var(--blue-700))",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(13, 131, 253, 0.2)"
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-between text-center text-md-start" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
          <div className={`col-md-8 mb-3 mb-md-0 text-white ${currentLang === 'ar' ? 'text-md-end' : 'text-md-start'}`}>
            <h3 className="fw-bold mb-2" style={{ fontSize: "1.6rem" }}>
              {t("cta_section_title")}
            </h3>
            <p className="mb-0" style={{ fontSize: "1rem", opacity: 0.9 }}>
              {t("cta_section_subtitle")}
            </p>
          </div>
          <div className="col-md-auto">
            <button
              onClick={() => navigate("/contact")}
              className="btn btn-light rounded-pill px-4 py-2 fw-bold shadow-sm"
              style={{ color: "var(--main-color)", transition: "all 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <i className={`fa-solid fa-headset ${currentLang === 'ar' ? 'ms-2' : 'me-2'}`}></i>
              {t("cta_contact_us")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
