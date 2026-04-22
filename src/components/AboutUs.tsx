import React from "react";
import { useLanguage } from "../context/LanguageContext";

const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container" id="AboutUs">
      <div className="about-us">
        <div className="info-box" data-aos="fade-right">
          <h1 data-aos="fade-up" data-aos-delay="100">{t("aboutus_title")}</h1>
          <p>
            <h3 data-aos="fade-up" data-aos-delay="200">{t("aboutus_subtitle")}</h3>
          </p>
          <p data-aos="fade-up" data-aos-delay="300">
            {t("aboutus_paragraph")}
          </p>
        </div>
        <div className="image-box" data-aos="fade-left" data-aos-delay="400">
          <img loading="lazy" src="/assets/images/pexels-cottonbro-6804612.jpg" alt="About Us" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
