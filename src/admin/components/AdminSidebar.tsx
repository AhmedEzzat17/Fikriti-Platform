import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { t, currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const menuItems = [
    { path: "/admin", icon: "fa-grip", label: t("dashboard") },
    { path: "/admin/users", icon: "fa-user-group", label: t("users") },
    { path: "/admin/projects", icon: "fa-layer-group", label: t("our_work") },
    { path: "/admin/technologies", icon: "fa-code", label: t("technologies") },
    { path: "/admin/messages", icon: "fa-comments", label: t("messages") },
    { path: "/admin/settings", icon: "fa-gear", label: t("settings") },
  ];

  return (
    <aside
      className={`bg-white shadow-sm d-flex flex-column sticky-top border-${isRTL ? "start" : "end"}`}
      style={{
        width: isOpen ? "280px" : "0",
        minWidth: isOpen ? "280px" : "0",
        height: "100vh",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 1050,
        backgroundColor: "#ffffff",
      }}
    >
      {/* Sidebar Header */}
      <div className="p-4 d-flex align-items-center gap-3 border-bottom flex-shrink-0" style={{ height: "80px" }}>
        <div className="bg-primary rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "42px", height: "42px" }}>
          <img src="/assets/images/i-removebg-preview.png" alt="Logo" style={{ width: "30px" }} />
        </div>
        <div className="overflow-hidden">
          <h5 className="fw-bold mb-0 text-dark text-nowrap">فكرتي Admin</h5>
          <span className="smaller text-muted fw-bold text-uppercase letter-spacing-1">Control Panel</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow-1 py-4 px-3 custom-scrollbar" style={{ overflowY: "auto" }}>
        <ul className="nav flex-column gap-1">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-sm active-nav-link" 
                      : "text-muted hover-bg-light"
                  }`
                }
              >
                <div className={`d-flex align-items-center justify-content-center`} style={{ width: "24px" }}>
                  <i className={`fa-solid ${item.icon} fs-6`}></i>
                </div>
                <span className="fw-medium text-nowrap" style={{ fontSize: "0.95rem" }}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-top bg-light bg-opacity-50 mt-auto flex-shrink-0">
        <NavLink 
          to="/" 
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold transition-all border-dashed"
        >
          <i className="fa-solid fa-house-user"></i>
          <span className="text-nowrap small">{isRTL ? "العودة للموقع" : "Back to Site"}</span>
        </NavLink>
      </div>

      <style>{`
        .active-nav-link { background-color: #0d83fd !important; }
        .hover-bg-light:hover { background-color: #f8f9fa; color: #0d83fd !important; }
        .letter-spacing-1 { letter-spacing: 0.5px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
        .border-dashed { border-style: dashed !important; }
        .py-2.5 { padding-top: 0.65rem; padding-bottom: 0.65rem; }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
