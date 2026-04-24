import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const AdminNavbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { currentLang, toggleLanguage, t } = useLanguage();
  const isRTL = currentLang === "ar";
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-bottom py-2 px-4 d-flex align-items-center justify-content-between sticky-top z-index-1000 shadow-xs" style={{ height: "80px" }}>
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn btn-light rounded-3 d-flex align-items-center justify-content-center border shadow-none transition-all"
          style={{ width: "40px", height: "40px" }}
        >
          <i className="fa-solid fa-bars-staggered text-dark opacity-75"></i>
        </button>
        <div className="d-none d-md-block ms-1">
          <h5 className="mb-0 fw-bold text-dark">{t("dashboard")}</h5>
          <p className="smaller text-muted mb-0 fw-medium">Welcome back, Admin</p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="btn btn-white border rounded-pill px-3 py-1.5 fw-bold smaller d-flex align-items-center gap-2 hover-bg-light transition-all shadow-xs"
        >
          <i className="fa-solid fa-globe text-primary"></i>
          <span>{currentLang === "en" ? "Ar" : "En"}</span>
        </button>

        {/* Notifications */}
        <div className="position-relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center border transition-all ${showNotifications ? "bg-primary-subtle" : ""}`} 
            style={{ width: "40px", height: "40px" }}
          >
            <i className={`fa-solid fa-bell ${showNotifications ? "text-primary" : "text-muted opacity-75"}`}></i>
            <span className="position-absolute top-0 end-0 badge rounded-circle bg-danger p-1 border border-2 border-white mt-1 me-1" style={{ width: "10px", height: "10px" }}></span>
          </button>
          
          {showNotifications && (
            <div className={`position-absolute mt-3 shadow-lg rounded-3 bg-white border overflow-hidden animate__animated animate__fadeInUp ${isRTL ? "start-0" : "end-0"}`} style={{ width: "300px", zIndex: 1100, top: "100%" }}>
              <div className="p-3 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold small">{isRTL ? "الإشعارات" : "Notifications"}</h6>
                <button className="btn btn-link btn-sm p-0 text-primary smaller fw-bold text-decoration-none">Clear</button>
              </div>
              <div className="max-h-300 custom-scrollbar" style={{ maxHeight: "250px", overflowY: "auto" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 border-bottom hover-bg-light cursor-pointer transition-all">
                    <div className="d-flex gap-2">
                      <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "32px", height: "32px" }}>
                        <i className="fa-solid fa-circle-info smaller"></i>
                      </div>
                      <div>
                        <p className="mb-0 small fw-bold text-dark">System Update v1.2</p>
                        <span className="smaller text-muted">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center bg-light bg-opacity-50 border-top">
                <button className="btn btn-link btn-sm text-decoration-none fw-bold smaller">View All</button>
              </div>
            </div>
          )}
        </div>

        <div className="vr mx-1 opacity-10"></div>

        {/* Profile */}
        <div className="d-flex align-items-center gap-2 cursor-pointer p-1 ps-3 rounded-pill hover-bg-light transition-all border border-transparent border-light shadow-xs bg-light bg-opacity-30">
          <div className="text-end d-none d-lg-block">
            <p className="mb-0 fw-bold text-dark smaller">Admin User</p>
          </div>
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="fa-solid fa-user-circle fs-5"></i>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .smaller { font-size: 0.8rem; }
        .max-h-300::-webkit-scrollbar { width: 4px; }
        .max-h-300::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
        .py-1.5 { padding-top: 0.4rem; padding-bottom: 0.4rem; }
      `}</style>
    </header>
  );
};

export default AdminNavbar;
