import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ServiceCard from "../../components/ServiceCard";

/* ─────────────────────────────────────────────────────────────────
   ServicesPage – improved grid layout with animated cards
───────────────────────────────────────────────────────────────── */

const getServicesData = (t: (key: any) => string) => [
  {
    id: "web-development",
    icon: "/assets/images/development.png",
    title: t("webDevelopment"),
    description: t("webDevelopmentDesc"),
    color: "#0d83fd",
  },
  {
    id: "mobile-app",
    icon: "/assets/images/app-development.png",
    title: t("mobileApp"),
    description: t("mobileAppDesc"),
    color: "#0a6fd4",
  },
  {
    id: "desktop-dev",
    icon: "/assets/images/coding.png",
    title: t("desktopDev"),
    description: t("desktopDevDesc"),
    color: "#0861b8",
  },
  {
    id: "tech-consulting",
    icon: "/assets/images/seo-chatting.png",
    title: t("techConsulting"),
    description: t("techConsultingDesc"),
    color: "#3a9ffa",
  },
  {
    id: "cloud-services",
    icon: "/assets/images/cloud-computing.png",
    title: t("cloudServices"),
    description: t("cloudServicesDesc"),
    color: "#0d6fc9",
  },
  {
    id: "testing",
    icon: "/assets/images/testing.png",
    title: t("testing"),
    description: t("testingDesc"),
    color: "#52aeff",
  },
];

const ServicesPage: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const isRtl = currentLang === "ar";

  const navigate = useNavigate();
  const services = getServicesData(t);

  return (
    <section className="sub-page-section">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="sub-breadcrumb" aria-label="breadcrumb">
          <a href="/" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <i className="fas fa-home"></i> {t("home")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? '‹' : '›'}</span>
          <span className="breadcrumb-current">{t("ourServices")}</span>
        </nav>

        {/* Header */}
        <div className="sub-page-header" data-aos="fade-down">
          <h1 className="sub-page-title">{t("ourServices")}</h1>
          <p className="sub-page-subtitle">{t("qualityMeetsInnovation")}</p>
          <p className="sub-page-intro">{t("serviceIntro")}</p>
        </div>

        {/* Services grid */}
        <div className="services-grid" data-aos="fade-up" data-aos-delay="200">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              index={index}
              onClick={() => navigate(`/services/${service.id}`)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="sub-page-cta-row" data-aos="fade-up" data-aos-delay="300">
          <button className="sub-cta-btn" onClick={() => navigate("/contact")}>
            <i className="fas fa-paper-plane"></i> {t("contact")}
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServicesPage;
