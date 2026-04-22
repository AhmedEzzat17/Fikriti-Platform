import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────────────────────────────────────────────────────
   Footer – fully redesigned with 4 columns, social links, and proper
   RTL / LTR support using the currentLang from LanguageContext.
──────────────────────────────────────────────────────────────────── */
const Footer: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();

  // dir is driven by the language, not hard-coded
  const dir = currentLang === "ar" ? "rtl" : "ltr";

  // Scroll to a section on the home page
  const scrollTo = (hash: string) => {
    if (window.location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      navigate("/" + hash);
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer" id="footer" dir={dir}>
      <div className="container">
        {/* ── Top grid ──────────────────────────────────────────── */}
        <div className="footer-grid">
          {/* Col 1 – Brand */}
          <div className="footer-col footer-col--brand">
            <img
              src="/assets/images/i-removebg-preview.png"
              alt="Fikriti Logo"
              className="footer-logo"
              loading="lazy"
            />
            <p className="footer-tagline">{t("footerInfo")}</p>

            {/* Social icons */}
            <div className="footer-socials">
              <a
                href="https://wa.me/201015762659"
                className="footer-social-btn footer-social-btn--whatsapp"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="mailto:info@fikriti.com"
                className="footer-social-btn footer-social-btn--email"
                aria-label="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
              <a
                href="tel:+201015762659"
                className="footer-social-btn footer-social-btn--phone"
                aria-label="Phone"
              >
                <i className="fas fa-phone"></i>
              </a>
            </div>
          </div>

          {/* Col 2 – Quick links */}
          <div className="footer-col">
            <h5 className="footer-col-title">{t("footerLinks")}</h5>
            <ul className="footer-links-list">
              <li>
                <a
                  href="/"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("home")}
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/services");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("ourServices")}
                </a>
              </li>
              <li>
                <a
                  href="/portfolio"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/portfolio");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("portfolio")}
                </a>
              </li>
              <li>
                <a
                  href="#OurGoals"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#OurGoals");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("OurGoals")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 – Company */}
          <div className="footer-col">
            <h5 className="footer-col-title">{t("footerAboutUs")}</h5>
            <ul className="footer-links-list">
              <li>
                <a
                  href="#AboutUs"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#AboutUs");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("contactUs")}
                </a>
              </li>
              <li>
                <a
                  href="#Contact"
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#Contact");
                  }}
                >
                  <i className="fas fa-chevron-right footer-link-arrow"></i>
                  {t("messageUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 – Contact info */}
          <div className="footer-col">
            <h5 className="footer-col-title">{t("footerContact")}</h5>
            <p className="footer-contact-desc">{t("footerContactText")}</p>

            <div className="footer-contact-items">
              <a href="mailto:info@fikriti.com" className="footer-contact-item">
                <span className="footer-contact-icon">
                  <i className="fas fa-envelope"></i>
                </span>
                <span>info@fikriti.com</span>
              </a>
              <a href="tel:+201015762659" className="footer-contact-item">
                <span className="footer-contact-icon">
                  <i className="fas fa-phone"></i>
                </span>
                <span>+20 101 576 2659</span>
              </a>
              <a
                href="https://wa.me/201015762659"
                className="footer-contact-item"
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-contact-icon footer-contact-icon--wa">
                  <i className="fab fa-whatsapp"></i>
                </span>
                <span>+20 101 576 2659</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="footer-divider"></div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="footer-bottom">
          <div className="footer-copyright-group">
            <p className="footer-copyright">{t("copyrightText")}</p>
            <div className="footer-version">
              <span style={{ marginLeft: "20px" }}>Version 1.0</span>
              {/* <span className="footer-version-dot">•</span>
              <span>First Release</span> */}
            </div>
          </div>
          <button className="footer-brand-link" onClick={() => navigate("/")}>
            Fikriti.com
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
