import React from "react";
import { useLanguage } from "../context/LanguageContext";

const TabsTape: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="tabe-container mb-5" data-aos="zoom-in">
      <div className="tabe-content">
        <span>{t("tabWebDevelopment")}</span>
        <span>{t("tabMobileApp")}</span>
        <span>{t("uiux")}</span>
        <span>{t("software")}</span>
        <span>{t("ecommerce")}</span>
        <span>{t("database")}</span>
        <span>{t("projectManagement")}</span>
        <span>{t("infoSystem")}</span>
        <span>{t("tabWebDevelopment")}</span>
        <span>{t("tabMobileApp")}</span>
        <span>{t("uiux")}</span>
        <span>{t("software")}</span>
        <span>{t("ecommerce")}</span>
        <span>{t("database")}</span>
        <span>{t("projectManagement")}</span>
        <span>{t("infoSystem")}</span>
      </div>
    </div>
  );
};

export default TabsTape;
