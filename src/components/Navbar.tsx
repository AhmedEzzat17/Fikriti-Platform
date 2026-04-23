import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

/* ──────────────────────────────────────────────────────────────
   Navbar – fixed top bar with scroll effect, active link
   highlighting, language toggle, and react-router navigation.
────────────────────────────────────────────────────────────── */
const Navbar: React.FC = () => {
  const { t, currentLang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navRef = useRef<HTMLElement>(null);

  // Apply shadow when scrolled and update ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (window.location.pathname === "/") {
        const sections = ["hero", "AboutUs", "Services", "OurPortfolio", "Contact"];
        let currentSection = "hero";

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2.5 && rect.bottom >= window.innerHeight / 2.5) {
              currentSection = section;
            }
          }
        }

        if (window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50) {
          currentSection = "Contact";
        }

        setActiveSection(currentSection);
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialization
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Navigate to home page then scroll to a hash section
  const goToSection = (hash: string) => {
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      navigate("/" + hash);
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const navScrolled = scrolled
    ? {
        width: "90%",
        margin: "0 auto",
        left: "2.5%",
        right: "2.5%",
        top: "12px",
        borderRadius: "40px",
      }
    : { width: "100%", margin: 0, left: 0, right: 0, top: 0, borderRadius: 0 };

  const isSubPage = location.pathname !== "/";

  return (
    <nav
      ref={navRef}
      className={`navbar navbar-expand-lg sticky-top ${scrolled ? "scrolled" : ""} ${isSubPage ? "is-subpage" : ""}`}
      id="navbar"
      style={navScrolled}
    >
      <div className="container" data-aos="fade-down" data-aos-duration="600">
        {/* Logo */}
        <a
          className="navbar-brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <img src="/assets/images/i-removebg-preview.png" alt="Fikriti Logo" />
        </a>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          aria-controls="main"
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        {/* Nav links */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="main"
        >
          <ul
            className={`navbar-nav mb-2 mb-lg-0 ${currentLang === "ar" ? "me-auto" : "ms-auto"}`}
          >
            <li className="nav-item">
              <a
                className={`nav-link p-lg-3 p-2 me-2 ${location.pathname === "/" && activeSection === "hero" ? "active" : ""}`}
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                {t("home")}
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link p-lg-3 p-2 me-2 ${location.pathname === "/" && activeSection === "AboutUs" ? "active" : ""}`}
                href="#AboutUs"
                onClick={(e) => {
                  e.preventDefault();
                  goToSection("#AboutUs");
                }}
              >
                {t("about")}
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link p-lg-3 p-2 me-2 ${(location.pathname.startsWith("/services") || (location.pathname === "/" && activeSection === "Services")) ? "active" : ""}`}
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/services");
                }}
              >
                {t("Services")}
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link p-lg-3 p-2 me-2 ${(location.pathname.startsWith("/portfolio") || (location.pathname === "/" && activeSection === "OurPortfolio")) ? "active" : ""}`}
                href="/portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/portfolio");
                }}
              >
                {t("portfolio")}
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link p-lg-3 p-2 me-2 ${(location.pathname.startsWith("/contact") || (location.pathname === "/" && activeSection === "Contact")) ? "active" : ""}`}
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/contact");
                }}
              >
                {t("contact")}
              </a>
            </li>
          </ul>

          {/* Language toggle */}
          <a
            className="ms-3 lang"
            id="language-toggle"
            href="#"
            onClick={toggleLanguage}
          >
            {currentLang === "en" ? "Ar" : "En"}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
