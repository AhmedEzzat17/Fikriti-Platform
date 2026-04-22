import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* ─────────────────────────────────────────────────────────────────
   ProjectDetailPage – improved project detail view
───────────────────────────────────────────────────────────────── */

const getProjectsData = (t: (key: any) => string) => [
  {
    id: "quarter-state",
    image: "/assets/images/photo_2025-05-20_00-17-55.jpg",
    title: t("adhmn"),
    description: t("adhmnDescription"),
    fullDescription: `${t("adhmnDescription")} ${t("webDevelopmentDesc")}`,
    category: t("webDevelopment"),
    tags: [t("website"), t("androidApp")],
    websiteUrl: "#",
    androidUrl: "#",
    features: [t("webDevelopment"), "UI/UX Design", t("mobileApp"), t("testing")],
    color: "#0d83fd",
    year: "2024",
    client: t("focusOnClient"),
  },
  {
    id: "5odark",
    image: "/assets/images/5ad.jpg",
    title: t("mishwar"),
    description: t("mishwarDescription"),
    fullDescription: `${t("mishwarDescription")} ${t("webDevelopmentDesc")}`,
    category: t("webDevelopment"),
    tags: [t("website"), t("androidApp")],
    websiteUrl: "#",
    androidUrl: "#",
    features: [t("webDevelopment"), "UI/UX Design", "E-Commerce", t("testing")],
    color: "#0a6fd4",
    year: "2024",
    client: t("focusOnClient"),
  },
  {
    id: "dp-clothing",
    image: "/assets/images/photo_2025-05-20_10-09-18.jpg",
    title: t("circle"),
    description: t("circleDescription"),
    fullDescription: `${t("circleDescription")} ${t("webDevelopmentDesc")}`,
    category: t("webDevelopment"),
    tags: [t("website")],
    websiteUrl: "/assets/project/index.html",
    androidUrl: null,
    features: [t("webDevelopment"), "UI/UX Design", "E-Commerce", t("cloudServices")],
    color: "#0861b8",
    year: "2024",
    client: t("focusOnClient"),
  },
  {
    id: "united-digital",
    image: "/assets/images/UDA.png",
    title: t("Advert"),
    description: t("AdvertDescription"),
    fullDescription: `${t("AdvertDescription")} ${t("webDevelopmentDesc")}`,
    category: t("webDevelopment"),
    tags: [t("website")],
    websiteUrl: "#",
    androidUrl: null,
    features: [t("webDevelopment"), "Digital Marketing", "UI/UX Design", t("techConsulting")],
    color: "#3a9ffa",
    year: "2024",
    client: t("focusOnClient"),
  },
];

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();
  const projects = getProjectsData(t);
  const project = projects.find((p) => p.id === id);
  const isRtl = currentLang === "ar";


  if (!project) {
    return (
      <section className="sub-page-section">
        <div className="container text-center py-5">
          <div className="not-found-box">
            <i className="fas fa-search not-found-icon"></i>
            <h2>{t("ourPortfolio")}</h2>
            <p>المشروع غير موجود.</p>
            <button className="sub-cta-btn" onClick={() => navigate("/portfolio")}>
              <i className="fas fa-arrow-left"></i> {t("ourPortfolio")}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sub-page-section">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="sub-breadcrumb" aria-label="breadcrumb">
          <a href="/" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            <i className="fas fa-home"></i> {t("home")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? '‹' : '›'}</span>
          <a href="/portfolio" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); navigate("/portfolio"); }}>
            {t("ourPortfolio")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? '‹' : '›'}</span>
          <span className="breadcrumb-current">{project.title}</span>
        </nav>

        <div
          className="detail-hero"
          style={{ background: `linear-gradient(${isRtl ? '-135deg' : '135deg'}, #19283f 0%, #1e3a5f 70%, ${project.color}30 100%)` }}
          data-aos="zoom-in"
        >
          <div className="detail-hero-circle" style={{ background: `${project.color}20` }}></div>

          {/* Tags */}
          <div className="detail-tags-row">
            {project.tags.map((tag, i) => (
              <span key={i} className="detail-tag" style={{ background: project.color }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="detail-hero-title">{project.title}</h1>
          <p className="detail-hero-sub">{project.description}</p>

          {/* Meta chips */}
          <div className="detail-meta-row">
            <div className="detail-meta-chip">
              <i className="fas fa-layer-group" style={{ color: project.color }}></i>
              <span>{project.category}</span>
            </div>
            <div className="detail-meta-chip">
              <i className="fas fa-calendar" style={{ color: project.color }}></i>
              <span>{project.year}</span>
            </div>
            <div className="detail-meta-chip">
              <i className="fas fa-globe" style={{ color: project.color }}></i>
              <span>{t("website")}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">

          {/* Main column */}
          <div className="detail-main-col" data-aos="fade-up" data-aos-delay="100">

            {/* Project image */}
            <div className="detail-project-img-wrap">
              <img src={project.image} alt={project.title} className="detail-project-img" loading="lazy" />
            </div>

            <h2 className="detail-section-heading">{t("ourPortfolio")}</h2>
            <p className="detail-paragraph">{project.fullDescription}</p>

            {/* External links */}
            {(project.websiteUrl || project.androidUrl) && (
              <div className="detail-project-links">
                {project.websiteUrl && project.websiteUrl !== "#" && (
                  <a
                    href={project.websiteUrl}
                    className="detail-project-link"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: project.color }}
                  >
                    <i className="fas fa-globe"></i> {t("website")}
                  </a>
                )}
                {project.androidUrl && project.androidUrl !== "#" && (
                  <a
                    href={project.androidUrl}
                    className="detail-project-link"
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: "#28a745" }}
                  >
                    <i className="fab fa-android"></i> {t("androidApp")}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar" data-aos="fade-up" data-aos-delay="300">

            {/* Tech highlights */}
            <div className="detail-sidebar-card">
              <h3 className="detail-sidebar-title">
                <i className="fas fa-tools" style={{ color: project.color }}></i>
                {t("quality")}
              </h3>
              <ul className="detail-sidebar-list">
                {project.features.map((f, i) => (
                  <li key={i} className="detail-sidebar-item">
                    <i className="fas fa-check-circle" style={{ color: project.color }}></i>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="detail-sidebar-cta"
              style={{ background: `linear-gradient(${isRtl ? '-135deg' : '135deg'}, ${project.color}, #19283f)` }}
            >
              <div className="detail-cta-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>{t("contactWithUs")}</h3>
              <p>{t("helpBuildApp")}</p>
              <button className="detail-cta-btn" onClick={() => navigate("/contact")}>
                <i className="fas fa-paper-plane"></i> {t("contact")}
              </button>
            </div>

          </aside>
        </div>

        {/* Back button */}
        <div className="detail-back-row">
          <button className="detail-back-btn" onClick={() => navigate("/portfolio")}>
            <i className="fas fa-arrow-left"></i> {t("ourPortfolio")}
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProjectDetailPage;
