import React, { useEffect, useState } from "react";

const FloatingButtons: React.FC = () => {
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 300) {
        setShowScrollUp(true);
      } else {
        setShowScrollUp(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`up ${showScrollUp ? 'show' : ''}`} onClick={scrollToTop}>
        <img loading="lazy" src="/assets/images/scroll.png" alt="Scroll Up" />
      </div>

      <a href="https://wa.me/201015762659" className="whatsapp" target="_blank" rel="noopener noreferrer">
        <img loading="lazy" src="/assets/images/whatsapp.png" alt="WhatsApp" />
      </a>

      <a href="tel:01015762659" className="phone" target="_blank" rel="noopener noreferrer">
        <i className="fas fa-phone fa-shake phone-i"></i>
      </a>
    </>
  );
};

export default FloatingButtons;
