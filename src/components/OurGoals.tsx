import React from "react";
import { useLanguage } from "../context/LanguageContext";

const OurGoals: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-5 Our" id="OurGoals">
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="vision-message">
            <img loading="lazy" src="/assets/images/targeting.png" alt="Vision Icon" />
            <h2 className="fw-bold" data-aos="fade-up">{t("ourVision")}</h2>
            <p>{t("visionText")}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="vision-message">
            <img loading="lazy" src="/assets/images/comment.png" alt="Message Icon" />
            <h2 className="fw-bold" data-aos="fade-up" data-aos-delay="100">{t("ourMessage")}</h2>
            <p>{t("messageText")}</p>
          </div>
        </div>
      </div>

      <div className="values">
        <div className="text-center mb-4">
          <h2 className="section-title" data-aos="fade-up">{t("ourValues")}</h2>
          <p>{t("valuesText")}</p>
        </div>

        <div className="values-container" data-aos="fade-up" data-aos-delay="200">
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-lightbulb text-warning"></i></div>
            <h5 className="fw-bold mt-2">{t("innovation")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-award" style={{color: '#0d83fd'}}></i></div>
            <h5 className="fw-bold mt-2">{t("quality")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-bullseye text-danger"></i></div>
            <h5 className="fw-bold mt-2">{t("focusOnClient")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-users" style={{color: '#0dcaf0'}}></i></div>
            <h5 className="fw-bold mt-2">{t("teamwork")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-bolt text-warning"></i></div>
            <h5 className="fw-bold mt-2">{t("quickResponse")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-book-open" style={{color: '#0d83fd'}}></i></div>
            <h5 className="fw-bold mt-2">{t("continuousLearning")}</h5>
          </div>
          <div className="value-card">
            <div className="value-icon"><i className="fa-solid fa-leaf text-success"></i></div>
            <h5 className="fw-bold mt-2">{t("sustainability")}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurGoals;
