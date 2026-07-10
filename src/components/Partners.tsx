import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Partners: React.FC = () => {
  const { t } = useLanguage();

  // Dummy partners for now (to be replaced with dynamic data from backend later)
  const partners = [
    { id: 1, name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { id: 2, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { id: 3, name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: 4, name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { id: 5, name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { id: 6, name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" },
  ];

  // Duplicate the array to create a seamless infinite loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="partners-section py-5" data-aos="fade-up">
      <div className="container text-center mb-4">
        <h2 className="fw-bold" style={{ color: "var(--dark-color)" }}>{t("partners_title")}</h2>
        <p className="text-muted">{t("partners_subtitle")}</p>
      </div>

      <div className="slider-container overflow-hidden" dir="ltr">
        <div className="slider-track">
          {duplicatedPartners.map((partner, index) => (
            <div key={index} className="slide-item mx-3">
              <div 
                className="card border-0 shadow-sm d-flex align-items-center justify-content-center p-3 partner-card"
                style={{ width: "200px", height: "100px", borderRadius: "15px", cursor: "pointer" }}
              >
                <img src={partner.logo} alt={partner.name} className="img-fluid partner-logo" style={{ maxHeight: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .partners-section {
          background-color: #f8f9fa;
        }
        .slider-container {
          position: relative;
          width: 100%;
          padding: 20px 0;
        }
        .slider-container::before,
        .slider-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 100px;
          height: 100%;
          z-index: 2;
        }
        .slider-container::before {
          left: 0;
          background: linear-gradient(to right, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
        }
        .slider-container::after {
          right: 0;
          background: linear-gradient(to left, #f8f9fa 0%, rgba(248, 249, 250, 0) 100%);
        }
        .slider-track {
          display: flex;
          width: calc(232px * 12); /* width (200) + margin (32) * total items (12) */
          animation: scroll-logos 30s linear infinite;
        }
        .slider-track:hover {
          animation-play-state: paused;
        }
        @keyframes scroll-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-232px * 6)); } /* scroll half the width */
        }
        
        /* Logo hover effects */
        .partner-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background-color: #ffffff;
        }
        .partner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .partner-logo {
          opacity: 0.6;
          filter: grayscale(100%);
          transition: all 0.3s ease;
        }
        .partner-card:hover .partner-logo {
          opacity: 1;
          filter: grayscale(0%);
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .slider-container::before,
          .slider-container::after {
            width: 50px;
          }
        }
      `}</style>
    </section>
  );
};

export default Partners;
