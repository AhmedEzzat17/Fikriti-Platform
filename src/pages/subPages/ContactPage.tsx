import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

/* ──────────────────────────────────────────────────────────────────
   ContactPage – standalone contact page with full form + info panel
────────────────────────────────────────────────────────────────── */
const ContactPage: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const isRtl = currentLang === "ar";

  // Simple form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to real backend / email service
    setSent(true);
  };

  return (
    <section className="sub-page-section">
      <div className="container">
        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <nav className="sub-breadcrumb" aria-label="breadcrumb">
          <a href="/" className="breadcrumb-link">
            <i className="fas fa-home"></i> {t("home")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? "‹" : "›"}</span>
          <span className="breadcrumb-current">{t("contactWithUs")}</span>
        </nav>

        {/* ── Page header ────────────────────────────────────── */}
        <div className="sub-page-header" data-aos="fade-down">
          <h1 className="sub-page-title">{t("contactWithUs")}</h1>
          <p className="sub-page-subtitle">{t("helpBuildApp")}</p>
          <p className="sub-page-intro">{t("teamCommitment")}</p>
        </div>

        {/* ── Contact grid ───────────────────────────────────── */}
        <div className="contact-page-grid">
          {/* ── Form panel ─────────────────────────────────── */}
          <div
            className="cp-form-panel"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {sent ? (
              /* Success state */
              <div className="cp-success">
                <div className="cp-success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>{t("send")} ✓</h3>
                <p>{t("teamCommitment")}</p>
                <button
                  className="cp-btn-primary mt-3"
                  onClick={() => setSent(false)}
                >
                  <i className="fas fa-redo"></i> {t("name")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cp-form">
                {/* Row 1 – Name + Email */}
                <div className="cp-form-row">
                  <div className="cp-field">
                    <label className="cp-label">
                      <i className="fas fa-user"></i> {t("name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="cp-input"
                      placeholder={t("placeholderName")}
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">
                      <i className="fas fa-envelope"></i> {t("email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="cp-input"
                      placeholder={t("placeholderEmail")}
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 2 – Phone + Subject */}
                <div className="cp-form-row">
                  <div className="cp-field">
                    <label className="cp-label">
                      <i className="fas fa-phone"></i> {t("phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="cp-input"
                      placeholder={t("placeholderPhone")}
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">
                      <i className="fas fa-tag"></i> {t("subject")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="cp-input"
                      placeholder={t("placeholderSubject")}
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="cp-field">
                  <label className="cp-label">
                    <i className="fas fa-comment-alt"></i> {t("message")}
                  </label>
                  <textarea
                    name="message"
                    className="cp-input cp-textarea"
                    rows={5}
                    placeholder={t("placeholderMessage")}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="cp-btn-primary cp-submit-btn">
                  <i className="fas fa-paper-plane"></i> {t("send")}
                </button>
              </form>
            )}
          </div>

          {/* ── Info panel ─────────────────────────────────── */}
          <aside
            className="cp-info-panel"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="cp-info-card">
              <div className="cp-info-icon-wrap cp-icon-blue">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h4 className="cp-info-title">{t("messageUs")}</h4>
                <a href="mailto:info@fikriti.com" className="cp-info-link">
                  info@fikriti.com
                </a>
              </div>
            </div>

            <div className="cp-info-card">
              <div className="cp-info-icon-wrap cp-icon-green">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <h4 className="cp-info-title">{t("callUsAt")}</h4>
                <a href="tel:+201015762659" className="cp-info-link">
                  201015762659+
                </a>
              </div>
            </div>

            <div className="cp-info-card">
              <div className="cp-info-icon-wrap cp-icon-whatsapp">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div>
                <h4 className="cp-info-title">{t("whatsapp")}</h4>
                <a
                  href="https://wa.me/201015762659"
                  className="cp-info-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  201015762659+
                </a>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="cp-cta-box">
              <h3>{t("contactWithUs")}</h3>
              <p>{t("helpBuildApp")}</p>
              <a
                href="https://wa.me/201015762659"
                className="cp-btn-whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
