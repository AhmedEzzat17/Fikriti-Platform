import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ProjectCard from "../../components/ProjectCard";

/* ─────────────────────────────────────────────────────────────────
   PortfolioPage – improved grid with hover overlay and filter tags
───────────────────────────────────────────────────────────────── */

const getProjectsData = (t: (key: any) => string) => [
  {
    id: "quarter-state",
    image: "/assets/images/photo_2025-05-20_00-17-55.jpg",
    title: t("adhmn"),
    description: t("adhmnDescription"),
    category: t("webDevelopment"),
    tags: [t("website"), t("androidApp")],
  },
  {
    id: "5odark",
    image: "/assets/images/5ad.jpg",
    title: t("mishwar"),
    description: t("mishwarDescription"),
    category: t("webDevelopment"),
    tags: [t("website"), t("androidApp")],
  },
  {
    id: "dp-clothing",
    image: "/assets/images/photo_2025-05-20_10-09-18.jpg",
    title: t("circle"),
    description: t("circleDescription"),
    category: t("webDevelopment"),
    tags: [t("website")],
  },
  {
    id: "united-digital",
    image: "/assets/images/UDA.png",
    title: t("Advert"),
    description: t("AdvertDescription"),
    category: t("webDevelopment"),
    tags: [t("website")],
  },
];

const PortfolioPage: React.FC = () => {
  const { t, currentLang } = useLanguage();
  const isRtl = currentLang === "ar";

  const navigate = useNavigate();
  const projects = getProjectsData(t);

  return (
    <section className="sub-page-section">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="sub-breadcrumb" aria-label="breadcrumb">
          <a href="/" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <i className="fas fa-home"></i> {t("home")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? '‹' : '›'}</span>
          <span className="breadcrumb-current">{t("ourPortfolio")}</span>
        </nav>

        {/* Header */}
        <div className="sub-page-header" data-aos="fade-down">
          <h1 className="sub-page-title">{t("ourPortfolio")}</h1>
          <p className="sub-page-subtitle">{t("productsSubTitle")}</p>
        </div>

        {/* Portfolio grid */}
        <div className="portfolio-grid" data-aos="fade-up" data-aos-delay="200">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              image={project.image}
              title={project.title}
              description={project.description}
              category={project.category}
              tags={project.tags}
              index={index}
              onClick={() => navigate(`/portfolio/${project.id}`)}
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

export default PortfolioPage;
