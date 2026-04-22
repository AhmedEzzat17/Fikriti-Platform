import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

/* ─────────────────────────────────────────────────────────────────
   ServiceDetailPage – improved detail view matching reference image
───────────────────────────────────────────────────────────────── */

const getServicesData = (t: (key: any) => string) => [
  {
    id: "web-development",
    icon: "/assets/images/development.png",
    title: t("webDevelopment"),
    description: t("webDevelopmentDesc"),
    details: t("WebDetails"),
    color: "#0d83fd",
    tags: ["UI/UX", "Front-End", "Back-End", "E-Commerce"],
    features: ["تصميم واجهة وتجربة المستخدم", "تطوير الواجهة الأمامية والخلفية", "متاجر إلكترونية", "مواقع ديناميكية"],
    duration: "4 – 12 أسبوع",
    level: "جميع المستويات",
    type: "فريق متخصص",
  },
  {
    id: "mobile-app",
    icon: "/assets/images/app-development.png",
    title: t("mobileApp"),
    description: t("mobileAppDesc"),
    details: t("MobDetails"),
    color: "#0a6fd4",
    tags: ["iOS", "Android", "Flutter", "React Native"],
    features: ["تطبيقات أصلية iOS/Android", "تطوير متعدد الأنظمة", "تصميم UI/UX للموبايل", "ASO"],
    duration: "6 – 16 أسبوع",
    level: "جميع المستويات",
    type: "فريق متخصص",
  },
  {
    id: "desktop-dev",
    icon: "/assets/images/coding.png",
    title: t("desktopDev"),
    description: t("desktopDevDesc"),
    details: t("DeskDetails"),
    color: "#0861b8",
    tags: ["Windows", "macOS", "Linux", "Electron"],
    features: ["تطبيقات أصلية لسطح المكتب", "تطبيقات متعددة الأنظمة", "تصميم UI/UX", "تحسين الأداء"],
    duration: "6 – 14 أسبوع",
    level: "جميع المستويات",
    type: "فريق متخصص",
  },
  {
    id: "tech-consulting",
    icon: "/assets/images/seo-chatting.png",
    title: t("techConsulting"),
    description: t("techConsultingDesc"),
    details: t("TechDetails"),
    color: "#3a9ffa",
    tags: ["IT", "أمن سيبراني", "تحول رقمي", "هندسة برمجيات"],
    features: ["استشارات البنية التحتية", "هيكلة البرمجيات", "الأمن السيبراني", "استراتيجية التحول الرقمي"],
    duration: "مرن",
    level: "الشركات والأفراد",
    type: "استشاري معتمد",
  },
  {
    id: "cloud-services",
    icon: "/assets/images/cloud-computing.png",
    title: t("cloudServices"),
    description: t("cloudServicesDesc"),
    details: t("CloudDetails"),
    color: "#0d6fc9",
    tags: ["استضافة", "نطاقات", "دعم فني", "SSL"],
    features: ["استضافة موثوقة وسريعة", "رفع المواقع واعداداتها", "دعم فني على مدار الساعة", "خطط مرنة لجميع الأحجام"],
    duration: "فوري",
    level: "جميع المشاريع",
    type: "خدمة مستمرة",
  },
  {
    id: "testing",
    icon: "/assets/images/testing.png",
    title: t("testing"),
    description: t("testingDesc"),
    details: t("TestDetails"),
    color: "#52aeff",
    tags: ["اختبار يدوي", "اختبار تلقائي", "صيانة", "أمان"],
    features: ["اختبار يدوي وتلقائي شامل", "إصلاح الأخطاء وحل المشاكل", "تحديثات أمنية دورية", "ترقية إصدارات البرمجيات"],
    duration: "حسب المشروع",
    level: "جميع المستويات",
    type: "فريق QA",
  },
];

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, currentLang } = useLanguage();
  const navigate = useNavigate();
  const services = getServicesData(t);
  const service = services.find((s) => s.id === id);
  const isRtl = currentLang === "ar";


  if (!service) {
    return (
      <section className="sub-page-section">
        <div className="container text-center py-5">
          <div className="not-found-box">
            <i className="fas fa-search not-found-icon"></i>
            <h2>{t("ourServices")}</h2>
            <p>الخدمة غير موجودة.</p>
            <button className="sub-cta-btn" onClick={() => navigate("/services")}>
              <i className="fas fa-arrow-left"></i> {t("ourServices")}
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
          <a href="/services" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); navigate("/services"); }}>
            {t("ourServices")}
          </a>
          <span className="breadcrumb-sep">{isRtl ? '‹' : '›'}</span>
          <span className="breadcrumb-current">{service.title}</span>
        </nav>

        {/* ── Hero banner ──────────────────────────────────── */}
        <div className="detail-hero" data-aos="zoom-in" style={{ background: `linear-gradient(${isRtl ? '-135deg' : '135deg'}, #19283f 0%, #1e3a5f 70%, ${service.color}30 100%)` }}>
          {/* Decorative circle */}
          <div className="detail-hero-circle" style={{ background: `${service.color}20` }}></div>

          {/* Tags */}
          <div className="detail-tags-row">
            {service.tags.map((tag, i) => (
              <span key={i} className="detail-tag" style={{ background: service.color }}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="detail-hero-title">{service.title}</h1>
          <p className="detail-hero-sub">{service.description}</p>

          {/* Meta chips */}
          <div className="detail-meta-row">
            <div className="detail-meta-chip">
              <i className="fas fa-users" style={{ color: service.color }}></i>
              <span>{service.type}</span>
            </div>
            <div className="detail-meta-chip">
              <i className="fas fa-chart-line" style={{ color: service.color }}></i>
              <span>{service.level}</span>
            </div>
            <div className="detail-meta-chip">
              <i className="fas fa-clock" style={{ color: service.color }}></i>
              <span>{service.duration}</span>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="detail-body">

          {/* Main column */}
          <div className="detail-main-col" data-aos="fade-up" data-aos-delay="100">

            {/* Service icon + title */}
            <div className="detail-service-header">
              <div className="detail-icon-circle" style={{ background: `${service.color}18` }}>
                <img src={service.icon} alt={service.title} className="detail-service-icon" />
              </div>
              <h2 className="detail-section-heading">{t("ourServices")}</h2>
            </div>

            <p className="detail-paragraph">{service.description}</p>

            {/* Features list */}
            <h3 className="detail-section-heading" style={{ marginTop: "28px" }}>
              {t("showMore")}
            </h3>
            <div className="detail-features-list">
              {service.details.split("\n").filter(Boolean).map((line, i) => (
                <div key={i} className="detail-feature-item">
                  <span className="detail-feature-dot" style={{ background: service.color }}></span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar" data-aos="fade-up" data-aos-delay="300">

            {/* Highlights card */}
            <div className="detail-sidebar-card">
              <h3 className="detail-sidebar-title">
                <i className="fas fa-star" style={{ color: service.color }}></i>
                {t("quality")}
              </h3>
              <ul className="detail-sidebar-list">
                {service.features.map((f, i) => (
                  <li key={i} className="detail-sidebar-item">
                    <i className="fas fa-check-circle" style={{ color: service.color }}></i>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div className="detail-sidebar-cta" style={{ background: `linear-gradient(${isRtl ? '-135deg' : '135deg'}, ${service.color}, #19283f)` }}>
              <div className="detail-cta-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>{t("contactWithUs")}</h3>
              <p>{t("helpBuildApp")}</p>
              <button
                className="detail-cta-btn"
                onClick={() => navigate("/contact")}
              >
                <i className="fas fa-paper-plane"></i> {t("contact")}
              </button>
            </div>

          </aside>
        </div>

        {/* Back button */}
        <div className="detail-back-row">
          <button className="detail-back-btn" onClick={() => navigate("/services")}>
            <i className="fas fa-arrow-left"></i> {t("ourServices")}
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServiceDetailPage;
