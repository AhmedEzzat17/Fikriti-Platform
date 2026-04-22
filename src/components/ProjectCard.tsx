import React from "react";
import { useLanguage } from "../context/LanguageContext";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  onClick: () => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  image, title, description, category, tags, onClick, index 
}) => {
  const { t } = useLanguage();

  return (
    <div
      className="sp-portfolio-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={title}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="sp-portfolio-img-wrap">
        <img src={image} alt={title} className="sp-portfolio-img" loading="lazy" />
        <div className="sp-portfolio-overlay">
          <span className="sp-portfolio-view">
            <i className="fas fa-eye"></i> {t("showMore")}
          </span>
        </div>
      </div>

      <div className="sp-portfolio-body">
        <span className="sp-portfolio-category">{category}</span>
        <h4 className="sp-portfolio-title">{title}</h4>
        <p className="sp-portfolio-desc">{description}</p>

        <div className="sp-portfolio-badges">
          {tags.map((tag, i) => (
            <span key={i} className="sp-badge">
              <i className={tag === t("website") ? "fas fa-globe" : "fab fa-android"}></i>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
