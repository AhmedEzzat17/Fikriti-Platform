import React from "react";
import { useLanguage } from "../context/LanguageContext";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  color?: string;
  onClick: () => void;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, color = "#0d83fd", onClick, index }) => {
  const { t } = useLanguage();
  
  return (
    <div
      className="sp-service-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="sp-card-top">
        <div className="sp-card-icon-bg" style={{ background: `${color}18` }}>
          <img src={icon} alt={title} className="sp-card-icon" loading="lazy" />
        </div>
        <div className="sp-card-accent" style={{ background: color }}></div>
      </div>
      
      <div>
        <h4 className="sp-card-title">{title}</h4>
        <p className="sp-card-desc">{description}</p>
      </div>

      <div className="sp-card-footer">
        <span className="sp-read-more" style={{ color: color }}>
          {t("showMore")} <i className="fas fa-arrow-left ms-1"></i>
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
