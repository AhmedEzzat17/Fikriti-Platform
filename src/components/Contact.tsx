import React from "react";
// import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────────────────────────────────────────────────
   Contact – home-page section with quick contact info + form CTA
──────────────────────────────────────────────────────────────── */
const Contact: React.FC = () => {
  const { t } = useLanguage();
  // const navigate = useNavigate();

  return (
    <div className="container pb-5" id="Contact">
      <h1 data-aos="fade-up">
        <em>{t("contactWithUs")}</em>
      </h1>
      <h2 className="text-center" data-aos="fade-up" data-aos-delay="100">
        {t("helpBuildApp")}
      </h2>

      <div className="contact-container">
        {/* ── Form panel (simplified on home; links to full page) ── */}
        <div className="contact-form" data-aos="fade-up" data-aos-delay="200">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row mb-3">
              <div className="col">
                <label>{t("name")}</label>
                <input
                  type="text"
                  className="form-control text-light"
                  placeholder={t("placeholderName")}
                />
              </div>
              <div className="col">
                <label>{t("email")}</label>
                <input
                  type="email"
                  className="form-control text-light"
                  placeholder={t("placeholderEmail")}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col">
                <label>{t("phone")}</label>
                <input
                  type="text"
                  className="form-control text-light"
                  placeholder={t("placeholderPhone")}
                />
              </div>
              <div className="col">
                <label>{t("subject")}</label>
                <input
                  type="text"
                  className="form-control text-light"
                  placeholder={t("placeholderSubject")}
                />
              </div>
            </div>
            <div className="mb-3">
              <label>{t("message")}</label>
              <textarea
                className="form-control text-light"
                rows={3}
                placeholder={t("placeholderMessage")}
              ></textarea>
            </div>

            {/* Two-button row: Send + Full contact page */}
            <div className="contact-form-actions">
              <button type="submit" className="send-btn">
                <i className="fas fa-paper-plane"></i> {t("send")}
              </button>
              {/* <button
                type="button"
                className="contact-full-btn"
                onClick={() => navigate("/contact")}
              >
                <i className="fas fa-external-link-alt"></i> {t("contactWithUs")}
              </button> */}
            </div>
          </form>
        </div>

        {/* ── Info panel ──────────────────────────────────────────── */}
        <div className="contact-info" data-aos="fade-up" data-aos-delay="300">
          <p className="p-one">{t("teamCommitment")}</p>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <i className="fas fa-envelope fa-bounce"></i>
            </div>
            <div>
              <strong>{t("messageUs")}</strong>
              <a href="mailto:info@fikriti.com">info@fikriti.com</a>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <i className="fas fa-phone fa-shake"></i>
            </div>
            <div>
              <strong>{t("callUsAt")}</strong>
              <a href="tel:+201015762659">201015762659+</a>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon contact-info-icon--whatsapp">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <strong>{t("whatsapp")}</strong>
              <a
                href="https://wa.me/201015762659"
                target="_blank"
                rel="noreferrer"
              >
                201015762659+
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
