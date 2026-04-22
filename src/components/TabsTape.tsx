import React from "react";
import { useLanguage } from "../context/LanguageContext";

const TabsTape: React.FC = () => {
  const { t } = useLanguage();

  const capabilities = [
    t("tape_web_apps"),
    t("tape_mobile_apps"),
    t("tape_api"),
    t("tape_uiux"),
    t("tape_optimization"),
    t("tape_security"),
    t("tape_consulting"),
    t("tape_dashboard"),
    t("tape_maintenance"),
    t("tape_seo"),
    t("tape_custom_software"),
    t("tape_qa"),
    t("tape_hosting"),
    // t("tape_cloud"),
    // t("tape_saas"),
    // t("tape_ecommerce"),
  ];

  return (
    <div className="tabe-container mb-5" data-aos="zoom-in">
      <div className="tabe-content">
        {capabilities.map((item, index) => (
          <span key={`first-${index}`}>{item}</span>
        ))}
        {capabilities.map((item, index) => (
          <span key={`second-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default TabsTape;
