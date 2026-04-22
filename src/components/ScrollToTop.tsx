import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component:
 * Automatically scrolls the window to the top (0,0) whenever the route (pathname) changes.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Delay slightly so the page content has time to render
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
