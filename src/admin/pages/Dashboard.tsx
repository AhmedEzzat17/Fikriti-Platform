import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import adminApi, { type ClientProject, type ContactLead } from "../../services/adminApi";

const defaultDemoProjects: ClientProject[] = [
  { id: 1, title: "E-Commerce Enterprise ERP", client_id: 1, total_cost: 4500, amount_paid: 3000, remaining_balance: 1500, currency: "USD", status: "active", is_allowed_access: true, client: { id: 1, company_name: "Arabian Tech Co." } },
  { id: 2, title: "Healthcare Medical Portal", client_id: 2, total_cost: 6000, amount_paid: 6000, remaining_balance: 0, currency: "USD", status: "completed", is_allowed_access: true, client: { id: 2, company_name: "Shifa Medical Clinics" } },
  { id: 3, title: "Logistics Delivery Platform", client_id: 3, total_cost: 3500, amount_paid: 1000, remaining_balance: 2500, currency: "USD", status: "active", is_allowed_access: true, client: { id: 3, company_name: "QuickExpress Logistics" } },
  { id: 4, title: "Fintech Mobile Banking App", client_id: 4, total_cost: 8000, amount_paid: 4000, remaining_balance: 4000, currency: "USD", status: "pending", is_allowed_access: false, client: { id: 4, company_name: "InvestCorp Global" } },
];

const defaultDemoMessages: ContactLead[] = [
  { id: 1, full_name: "Ahmed Ezzat", name: "Ahmed Ezzat", email: "ahmed@example.com", message: "أريد الاستفسار عن تكلفة تصميم متجر إلكتروني متكامل.", created_at: "10m ago", status: "new" },
  { id: 2, full_name: "Sara Ali", name: "Sara Ali", email: "sara@example.com", message: "Hello, do you provide mobile app development services?", created_at: "1h ago", status: "in_progress" },
  { id: 3, full_name: "Khaled Mohamed", name: "Khaled Mohamed", email: "khaled@example.com", message: "نحن شركة ناشئة ونريد تطوير نظام لإدارة الموارد.", created_at: "3h ago", status: "new" },
  { id: 4, full_name: "Mona Sherif", name: "Mona Sherif", email: "mona@clinic.org", message: "Need consultation for medical records system integration.", created_at: "1d ago", status: "closed" },
];

const Dashboard: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ users: 12, projects: 8, messages: 15, unread: 3, portfolios: 14 });
  const [recentProjects, setRecentProjects] = useState<ClientProject[]>(defaultDemoProjects);
  const [recentMessages, setRecentMessages] = useState<ContactLead[]>(defaultDemoMessages);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [usersRes, projectsRes, messagesRes, portfoliosRes, unreadRes] = await Promise.all([
          adminApi.getUsers().catch(() => null),
          adminApi.getClientProjects({ page: 1, per_page: 5 }).catch(() => null),
          adminApi.getContacts({ page: 1 }).catch(() => null),
          adminApi.getPortfolios({ page: 1 }).catch(() => null),
          adminApi.getUnreadContactsCount().catch(() => null),
        ]);

        const loadedUsersCount = usersRes?.data?.total || usersRes?.data?.data?.length || counts.users;
        const loadedProjects = projectsRes?.data?.data || [];
        const loadedProjectsCount = projectsRes?.data?.total || loadedProjects.length || counts.projects;
        const loadedMessages = messagesRes?.data?.data || [];
        const loadedMessagesCount = messagesRes?.data?.meta?.total || loadedMessages.length || counts.messages;
        const loadedPortfoliosCount = portfoliosRes?.data?.total || portfoliosRes?.data?.data?.length || counts.portfolios;
        const loadedUnread = unreadRes?.data?.unread_count ?? (loadedMessages.filter(m => m.status === "new" || m.status === "unread").length);

        setCounts({
          users: loadedUsersCount,
          projects: loadedProjectsCount,
          messages: loadedMessagesCount,
          unread: loadedUnread,
          portfolios: loadedPortfoliosCount,
        });

        if (loadedProjects.length > 0) setRecentProjects(loadedProjects.slice(0, 5));
        if (loadedMessages.length > 0) setRecentMessages(loadedMessages.slice(0, 5));
        
        setIsFallback(!usersRes && !projectsRes && !messagesRes);
      } catch (err) {
        console.warn("Using offline demo telemetry for admin dashboard overview.", err);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    { title: isRTL ? "المستخدمون" : "Total Users", value: loading ? "..." : counts.users.toLocaleString(), icon: "fa-users", color: "primary", link: "/admin/users" },
    { title: isRTL ? "مشاريع العملاء" : "Client Projects", value: loading ? "..." : counts.projects.toLocaleString(), icon: "fa-briefcase", color: "success", link: "/admin/projects" },
    { title: isRTL ? "الرسائل (جديدة)" : "Inbox (Unread)", value: loading ? "..." : `${counts.unread} new / ${counts.messages}`, icon: "fa-comments", color: "warning", link: "/admin/messages" },
    { title: isRTL ? "أعمال المعرض" : "Showcase Work", value: loading ? "..." : counts.portfolios.toLocaleString(), icon: "fa-layer-group", color: "info", link: "/admin/projects" },
  ];

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>

      {/* ── Page header ────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
              {isRTL ? "مرحباً بك مجدداً في مركز القيادة!" : "Welcome back to Fikriti Command Center!"}
            </h4>
            {isFallback && (
              <span className="badge bg-warning-subtle text-warning smaller px-2 py-1">
                {isRTL ? "وضع العرض (غير متصل بالخادم)" : "Demo Mode (Offline)"}
              </span>
            )}
          </div>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
            {isRTL
              ? "إليك ملخص مباشر لأداء المنظومة وحسابات المشاريع الحية واستفسارات العملاء."
              : "Here is a live telemetry summary of system performance, client projects, and lead inquiries."}
          </p>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-light btn-sm rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-2 text-primary"
        >
          <i className="fa-solid fa-rotate-right"></i>
          <span>{isRTL ? "تحديث المتابعة" : "Refresh KPIs"}</span>
        </button>
      </div>

      {/* ── Stat cards (4 side-by-side) ───────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            style={{ flex: "1 1 200px", minWidth: "180px", cursor: "pointer" }}
            onClick={() => navigate(stat.link)}
          >
            <div className="card border-0 shadow-sm bg-white transition-all hover-shadow" style={{ borderRadius: "16px" }}>
              <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  className={`bg-${stat.color}-subtle text-${stat.color}`}
                  style={{ width: 54, height: 54, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <i className={`fa-solid ${stat.icon} fs-5`}></i>
                </div>
                <div>
                  <p style={{ color: "#6c757d", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                    {stat.title}
                  </p>
                  <h3 style={{ fontWeight: 800, color: "#1a1a2e", margin: 0, fontSize: "1.45rem" }}>
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content (table + messages) ───────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>

        {/* Active Projects table – takes 65% */}
        <div style={{ flex: "65 65 400px", minWidth: "300px" }}>
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f3f4" }}>
              <h5 style={{ fontWeight: 700, margin: 0, color: "#1a1a2e", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-briefcase text-primary fs-6"></i>
                <span>{isRTL ? "مشاريع العملاء النشطة" : "Active Client Projects"}</span>
              </h5>
              <Link to="/admin/projects" className="btn btn-link btn-sm p-0 fw-bold text-decoration-none text-primary" style={{ fontSize: "0.82rem" }}>
                {isRTL ? "إدارة المشاريع" : "Manage All Projects"}
              </Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table align-middle mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px 20px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "المشروع والعميل" : "Project & Client"}
                    </th>
                    <th style={{ padding: "12px 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "الحساب والمتبقي" : "Financial Balance"}
                    </th>
                    <th style={{ padding: "12px 12px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "بوابة الدخول" : "Portal Gate"}
                    </th>
                    <th style={{ padding: "12px 20px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0, textAlign: "center" }}>
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((proj, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f8f9fa" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: 38, height: 38, borderRadius: "10px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#3b82f6", fontWeight: "bold" }}>
                            <i className="fa-solid fa-folder-tree fs-6"></i>
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e", display: "block" }}>{proj.title}</span>
                            <span className="text-muted smaller d-flex align-items-center gap-1">
                              <i className="fa-solid fa-building text-primary smaller"></i>
                              <span>{proj.client?.company_name || proj.client?.user?.name || `Client #${proj.client_id}`}</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <div className="small">
                          <div className="fw-bold text-dark">${proj.total_cost} {proj.currency}</div>
                          <div className={`smaller fw-medium ${proj.remaining_balance > 0 ? "text-danger" : "text-success"}`}>
                            {isRTL ? "المتبقي:" : "Rem:"} ${proj.remaining_balance}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <span className={`badge rounded-pill px-2 py-1 smaller ${proj.is_allowed_access ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                          <i className={`fa-solid ${proj.is_allowed_access ? "fa-lock-open" : "fa-lock"} me-1`}></i>
                          {proj.is_allowed_access ? (isRTL ? "مفتوح" : "Open") : (isRTL ? "مقفل/محجوب" : "Blocked")}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span
                          className={`badge rounded-pill px-3 py-1 fw-bold ${
                            proj.status === "active" ? "bg-success-subtle text-success" :
                            proj.status === "completed" ? "bg-info-subtle text-info" : "bg-warning-subtle text-warning"
                          }`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {proj.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent messages – takes 35% */}
        <div style={{ flex: "35 35 280px", minWidth: "260px" }}>
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f3f4" }}>
              <h5 style={{ fontWeight: 700, margin: 0, color: "#1a1a2e", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="fa-solid fa-envelope text-warning fs-6"></i>
                <span>{isRTL ? "أحدث استفسارات العملاء" : "Recent Lead Inquiries"}</span>
              </h5>
              {counts.unread > 0 && (
                <span className="badge bg-warning-subtle text-warning rounded-pill px-2 py-1 fw-bold smaller">
                  {counts.unread} {isRTL ? "جديدة" : "New"}
                </span>
              )}
            </div>
            <div style={{ padding: "16px 20px" }}>
              {recentMessages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", paddingBottom: "14px", marginBottom: "14px", borderBottom: idx < recentMessages.length - 1 ? "1px solid #f1f3f4" : "none" }}>
                  <div
                    className={`rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center fw-bold text-white shadow-xs`}
                    style={{ 
                      width: 42, 
                      height: 42, 
                      fontSize: "0.9rem",
                      background: idx % 3 === 0 ? "linear-gradient(135deg, #2563eb, #1e40af)" : idx % 3 === 1 ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #d97706, #b45309)"
                    }}
                  >
                    {(msg.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a1a2e", display: "flex", alignItems: "center", gap: 6 }}>
                        {msg.name}
                        {msg.status === "new" && <span className="badge bg-danger rounded-circle p-1" style={{ width: 6, height: 6 }}></span>}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#adb5bd" }}>{msg.created_at || "recently"}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#6c757d", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.message || msg.subject || "No content provided..."}
                    </p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => navigate("/admin/messages")} 
                className="btn btn-outline-primary btn-sm w-100 fw-bold rounded-pill py-2 mt-2"
              >
                {isRTL ? "عرض صندوق الوارد بالكامل" : "View Full Inbox"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
