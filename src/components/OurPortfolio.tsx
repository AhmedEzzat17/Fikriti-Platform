import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "./ProjectCard";

/* ─────────────────────────────────────────────────────────────────
   OurPortfolio – home-page section with Swiper slider.
   Each card is now clickable and navigates to its detail page.
───────────────────────────────────────────────────────────────── */
const OurPortfolio: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const projects = [
    {
      id: "quarter-state",
      image: "/assets/images/photo_2025-05-20_00-17-55.jpg",
      title: t("adhmn"),
      desc: t("adhmnDescription"),
      cat: t("webDevelopment"),
      tags: [t("website"), t("androidApp")],
    },
    {
      id: "5odark",
      image: "/assets/images/5ad.jpg",
      title: t("mishwar"),
      desc: t("mishwarDescription"),
      cat: t("webDevelopment"),
      tags: [t("website"), t("androidApp")],
    },
    {
      id: "dp-clothing",
      image: "/assets/images/photo_2025-05-20_10-09-18.jpg",
      title: t("circle"),
      desc: t("circleDescription"),
      cat: t("webDevelopment"),
      tags: [t("website")],
    },
    {
      id: "united-digital",
      image: "/assets/images/UDA.png",
      title: t("Advert"),
      desc: t("AdvertDescription"),
      cat: t("webDevelopment"),
      tags: [t("website")],
    },
  ];

  useEffect(() => {
    // Initialize Swiper correctly
    // @ts-ignore
    if (window.Swiper) {
      // @ts-ignore
      new window.Swiper(".slider-wrapper", {
        loop: true,
        grabCursor: true,
        spaceBetween: 25,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        speed: 600,
        breakpoints: {
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }
  }, []);

  return (
    <section className="testimonials-section container py-5" id="OurPortfolio">
      <h2 className="text-center fw-bold text-uppercase section-title mb-5" data-aos="fade-up">
        {t("ourPortfolio")}
      </h2>

      <div className="section-content">
        <div className="slider-container swiper">
          <div
            className="slider-wrapper" data-aos="fade-up" data-aos-delay="100"
            style={{ overflow: "hidden", padding: "10px" }}
          >
            <ul className="testimonials-list swiper-wrapper">
              {projects.map((project, index) => (
                <li
                  key={project.id}
                  className="testimonial swiper-slide"
                  style={{ height: "auto" }}
                >
                  <ProjectCard
                    image={project.image}
                    title={project.title}
                    description={project.desc}
                    category={project.cat}
                    tags={project.tags}
                    index={index}
                    onClick={() => navigate(`/portfolio/${project.id}`)}
                  />
                </li>
              ))}
            </ul>

            <div className="swiper-pagination"></div>

            <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="200">
              <button
                onClick={() => navigate("/portfolio")}
                className="btn btn-custom pt-2 pb-2"
              >
                {t("showAll")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPortfolio;
