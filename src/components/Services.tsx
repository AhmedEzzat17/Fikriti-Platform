import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ServiceCard from "./ServiceCard";

/* ─────────────────────────────────────────────────────────────────
   Services section – displayed on the home page.
   Each card is clickable and navigates to its detail page.
───────────────────────────────────────────────────────────────── */
const Services: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const services = [
    { id: "web-development", icon: "/assets/images/development.png", title: t("webDevelopment"), desc: t("webDevelopmentDesc"), color: "#0d83fd" },
    { id: "mobile-app", icon: "/assets/images/app-development.png", title: t("mobileApp"), desc: t("mobileAppDesc"), color: "#0a6fd4" },
    { id: "desktop-dev", icon: "/assets/images/coding.png", title: t("desktopDev"), desc: t("desktopDevDesc"), color: "#0861b8" },
    { id: "tech-consulting", icon: "/assets/images/seo-chatting.png", title: t("techConsulting"), desc: t("techConsultingDesc"), color: "#3a9ffa" },
    { id: "cloud-services", icon: "/assets/images/cloud-computing.png", title: t("cloudServices"), desc: t("cloudServicesDesc"), color: "#0d6fc9" },
    { id: "testing", icon: "/assets/images/testing.png", title: t("testing"), desc: t("testingDesc"), color: "#52aeff" },
  ];

  return (
    <section className="services text-center py-5" id="Services">
      <div className="container">
        <h2 className="text-center fw-bold text-uppercase section-title mb-4" data-aos="fade-up">{t("ourServices")}</h2>
        <p className="text-muted text-center max-w-700 mx-auto mb-5" data-aos="fade-up" data-aos-delay="100">{t("serviceIntro")}</p>
        
        <div className="services-grid mt-4" data-aos="fade-up" data-aos-delay="200">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.desc}
              color={service.color}
              index={index}
              onClick={() => navigate(`/services/${service.id}`)}
            />
          ))}
        </div>

        <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="300">
          <button
            className="btn btn-custom pt-2 pb-2"
            onClick={() => navigate("/services")}
          >
            {t("showAll")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
