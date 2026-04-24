import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  return (
    <div
      className="admin-scope vw-100 vh-100 bg-white d-flex overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: isRTL ? "Cairo" : "Inter" }}
    >
      {/* Sidebar - Fixed height 100% */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area - Full remaining width/height */}
      <div
        className="flex-grow-1 d-flex flex-column h-100"
        style={{ minWidth: 0 }}
      >
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-grow-1 overflow-auto bg-light bg-opacity-50">
          <div className="p-3 p-md-4 w-100">
            <div className="w-100 mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        <footer className="py-2 px-4 bg-white border-top text-center text-muted small flex-shrink-0">
          &copy; {new Date().getFullYear()} Fikriti Dashboard. All rights
          reserved.
        </footer>
      </div>

      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; }
        .bg-light { background-color: #f8faff !important; }
        /* Reset global row overrides for admin scope */
        .admin-scope .row {
          display: flex !important;
          flex-wrap: wrap !important;
          width: 100% !important;
          margin: 0 !important;
        }
        .admin-scope .row > * {
          flex-shrink: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 10px !important;
        }
        /* Restore standard bootstrap column behaviors */
        .admin-scope .col-md-3 { flex: 0 0 auto !important; width: 25% !important; }
        .admin-scope .col-xl-8 { flex: 0 0 auto !important; width: 66.666667% !important; }
        .admin-scope .col-xl-4 { flex: 0 0 auto !important; width: 33.333333% !important; }
        .admin-scope .col-xl-9 { flex: 0 0 auto !important; width: 75% !important; }
        .admin-scope .col-xl-3 { flex: 0 0 auto !important; width: 25% !important; }
        .admin-scope .col-md-6 { flex: 0 0 auto !important; width: 50% !important; }
        .admin-scope .col-md-4 { flex: 0 0 auto !important; width: 33.333333% !important; }
        .admin-scope .col-sm-6 { flex: 0 0 auto !important; width: 50% !important; }
        .admin-scope .col-12 { flex: 0 0 auto !important; width: 100% !important; }
        .admin-scope .col-lg-8 { flex: 0 0 auto !important; width: 66.666667% !important; }

        /* Fix visibility */
        .admin-scope .card { opacity: 1 !important; visibility: visible !important; display: block !important; }
        .admin-scope .table-responsive { width: 100% !important; }

        /* Custom Scrollbar for the main content */
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-track { background: transparent; }
        main::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
