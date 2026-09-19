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
      className="admin-scope dashboard-shell vw-100 vh-100 bg-white d-flex overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: isRTL ? "Cairo" : "Inter" }}
    >
      {false && sidebarOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label={isRTL ? "إغلاق القائمة" : "Close navigation"}
        />
      )}
      {/* Sidebar - Fixed height 100% */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area - Full remaining width/height */}
      <div
        className="flex-grow-1 d-flex flex-column h-100"
        style={{ minWidth: 0 }}
      >
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="dashboard-main flex-grow-1 overflow-auto bg-light bg-opacity-50">
          <div className="dashboard-content p-3 p-md-4 w-100">
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
        .dashboard-shell { min-height: 100dvh; background: #f8fafc !important; }
        .dashboard-main { min-width: 0; min-height: 0; }
        .dashboard-content { max-width: 1680px; margin-inline: auto; }
        .bg-light { background-color: #f8fafc !important; }
        /* Reset global row overrides for admin scope */
        .admin-scope .row {
          display: flex !important;
          flex-wrap: wrap !important;
          width: 100% !important;
          margin: 0 !important;
          gap: 0 !important;
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

        /* Keep Bootstrap's grid proportions at their intended breakpoints. */
        @media (max-width: 1199.98px) {
          .admin-scope .col-xl-3,
          .admin-scope .col-xl-4,
          .admin-scope .col-xl-8,
          .admin-scope .col-xl-9 { width: 100% !important; }
        }

        /* Fix visibility */
        .admin-scope .card { opacity: 1 !important; visibility: visible !important; display: block !important; }
        .admin-scope .table-responsive { width: 100% !important; }

        /* A restrained, shared visual system for add, edit and preview dialogs. */
        .admin-scope .modal,
        .admin-scope .admin-standard-modal {
          --admin-primary: #2563eb;
          --admin-primary-soft: #eff6ff;
          --admin-surface: #ffffff;
          --admin-muted: #64748b;
          --admin-border: #e2e8f0;
          background-color: rgba(15, 23, 42, 0.42) !important;
          backdrop-filter: blur(2px);
        }
        .admin-scope .modal-dialog { margin: 1.25rem auto; }
        .admin-scope .modal-content,
        .admin-scope .admin-standard-dialog {
          border: 1px solid var(--admin-border) !important;
          border-radius: 14px !important;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18) !important;
          background: var(--admin-surface) !important;
        }
        .admin-scope .modal-header {
          min-height: 68px;
          padding: 1rem 1.25rem !important;
          background: var(--admin-surface) !important;
          border-bottom: 1px solid var(--admin-border) !important;
          color: #0f172a !important;
        }
        .admin-scope .modal-header .text-white,
        .admin-scope .modal-header .text-light,
        .admin-scope .modal-header .modal-title { color: #0f172a !important; }
        .admin-scope .modal-header .text-opacity-75 { color: var(--admin-muted) !important; }
        .admin-scope .modal-header .btn-close {
          filter: none !important;
          opacity: 0.65;
          margin: 0 !important;
          order: 2;
        }
        .admin-scope [dir="rtl"] .modal-header .btn-close,
        .admin-scope[dir="rtl"] .modal-header .btn-close { order: -1; }
        .admin-scope .modal-body { background: var(--admin-surface) !important; padding: 1.25rem !important; }
        .admin-scope .modal-footer { background: var(--admin-surface) !important; border-color: var(--admin-border) !important; }
        .admin-scope .modal .form-label,
        .admin-scope .admin-standard-modal label { color: #334155 !important; font-size: 0.82rem !important; }
        .admin-scope .modal .form-label > i { display: none; }
        .admin-scope .modal .form-control,
        .admin-scope .modal .form-select,
        .admin-scope .admin-standard-modal .form-control,
        .admin-scope .admin-standard-modal .form-select {
          min-height: 42px;
          border-color: var(--admin-border);
          box-shadow: none !important;
        }
        .admin-scope .modal .form-control:focus,
        .admin-scope .modal .form-select:focus,
        .admin-scope .admin-standard-modal .form-control:focus,
        .admin-scope .admin-standard-modal .form-select:focus {
          border-color: var(--admin-primary) !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
        }
        .admin-scope .modal .btn-primary,
        .admin-scope .admin-standard-modal .btn-primary { background: var(--admin-primary) !important; border-color: var(--admin-primary) !important; }
        .admin-scope .modal .btn-light,
        .admin-scope .admin-standard-modal .btn-light { background: #f8fafc !important; border-color: var(--admin-border) !important; color: #334155 !important; }
        .admin-scope .modal .card,
        .admin-scope .admin-standard-modal .card { border-color: var(--admin-border) !important; box-shadow: none !important; }
        .admin-scope .admin-modal .modal-header > .d-flex:first-child > div:first-child { display: none !important; }
        .admin-scope .admin-modal .clear-draft-btn {
          background: transparent !important;
          color: #475569 !important;
          border-color: #cbd5e1 !important;
          box-shadow: none !important;
        }
        .admin-scope .admin-modal .modal-body > form > .d-flex { gap: 1rem !important; }

        /* Custom Scrollbar for the main content */
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-track { background: transparent; }
        main::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
