import React from "react";
import { useLanguage } from "../../context/LanguageContext";

/* ──────────────────────────────────────────────────────
   Helper: column widths injected as inline styles to
   bypass the global index.css overrides that force
   .row > * to width:auto / max-width:80%
────────────────────────────────────────────────────── */
const col = {
  quarter: { flex: "0 0 auto", width: "25%", maxWidth: "25%" } as React.CSSProperties,
  half:    { flex: "0 0 auto", width: "50%", maxWidth: "50%" } as React.CSSProperties,
  twoThirds:  { flex: "0 0 auto", width: "66.6667%", maxWidth: "66.6667%" } as React.CSSProperties,
  oneThird:   { flex: "0 0 auto", width: "33.3333%", maxWidth: "33.3333%" } as React.CSSProperties,
  full:    { flex: "0 0 auto", width: "100%", maxWidth: "100%" } as React.CSSProperties,
};

const Dashboard: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const stats = [
    { title: isRTL ? "المستخدمين" : "Users",    value: "1,250", icon: "fa-users",    color: "primary" },
    { title: isRTL ? "المشاريع"   : "Projects",  value: "48",    icon: "fa-rocket",   color: "success" },
    { title: isRTL ? "الرسائل"    : "Messages",  value: "12",    icon: "fa-comments", color: "warning" },
    { title: isRTL ? "التقنيات"  : "Tech Stack", value: "24",    icon: "fa-code",     color: "info"    },
  ];

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>

      {/* ── Page header ────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
          {isRTL ? "مرحباً بك مجدداً!" : "Welcome back!"}
        </h4>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
          {isRTL
            ? "إليك ملخص سريع لأداء النظام اليوم والأنشطة الأخيرة."
            : "Here is a quick summary of system performance today and recent activities."}
        </p>
      </div>

      {/* ── Stat cards (4 side-by-side) ───────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ flex: "1 1 180px", minWidth: "160px" }}>
            <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px" }}>
              <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  className={`bg-${stat.color}-subtle text-${stat.color}`}
                  style={{ width: 54, height: 54, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <i className={`fa-solid ${stat.icon} fs-5`}></i>
                </div>
                <div>
                  <p style={{ color: "#6c757d", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                    {stat.title}
                  </p>
                  <h3 style={{ fontWeight: 800, color: "#1a1a2e", margin: 0, fontSize: "1.6rem" }}>
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
              <h5 style={{ fontWeight: 700, margin: 0, color: "#1a1a2e" }}>
                {isRTL ? "المشاريع النشطة" : "Active Projects"}
              </h5>
              <button className="btn btn-link btn-sm p-0 fw-bold text-decoration-none text-primary" style={{ fontSize: "0.78rem" }}>
                {isRTL ? "عرض الكل" : "View All"}
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table align-middle mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px 20px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "المشروع" : "Project"}
                    </th>
                    <th style={{ padding: "12px 8px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "التقنية" : "Tech"}
                    </th>
                    <th style={{ padding: "12px 8px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0 }}>
                      {isRTL ? "التقدم" : "Progress"}
                    </th>
                    <th style={{ padding: "12px 20px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#6c757d", border: 0, textAlign: "center" }}>
                      {isRTL ? "الحالة" : "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <tr key={i} style={{ borderBottom: "1px solid #f8f9fa" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "8px", background: "#f8f9fa", border: "1px solid #e9ecef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <img src="/assets/images/i-removebg-preview.png" alt="p" style={{ width: "26px", height: "26px", objectFit: "contain" }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1a1a2e" }}>Web App {i}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span className="badge bg-primary-subtle text-primary" style={{ borderRadius: "20px", padding: "4px 10px", fontSize: "0.65rem", fontWeight: 700 }}>React</span>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "100px" }}>
                          <div style={{ flex: 1, height: "6px", background: "#e9ecef", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${35 + i * 10}%`, background: "#0d83fd", borderRadius: "10px" }}></div>
                          </div>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", flexShrink: 0 }}>{35 + i * 10}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", textAlign: "center" }}>
                        <span
                          className={i % 2 === 0 ? "badge bg-success-subtle text-success" : "badge bg-info-subtle text-info"}
                          style={{ borderRadius: "20px", padding: "4px 12px", fontSize: "0.7rem", fontWeight: 700 }}
                        >
                          {i % 2 === 0 ? (isRTL ? "نشط" : "Online") : (isRTL ? "جاري" : "Building")}
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
        <div style={{ flex: "35 35 260px", minWidth: "240px" }}>
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f3f4" }}>
              <h5 style={{ fontWeight: 700, margin: 0, color: "#1a1a2e" }}>
                {isRTL ? "أحدث الرسائل" : "Recent Messages"}
              </h5>
              <span className="badge bg-danger-subtle text-danger" style={{ borderRadius: "20px", padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700 }}>3 New</span>
            </div>
            <div style={{ padding: "16px 20px" }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ display: "flex", gap: "12px", paddingBottom: "14px", marginBottom: "14px", borderBottom: i < 6 ? "1px solid #f1f3f4" : "none" }}>
                  <div
                    style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem",
                      background: i === 1 ? "#0d83fd" : "#f1f3f4",
                      color: i === 1 ? "#fff" : "#6c757d"
                    }}
                  >
                    {["A","S","K","M","J","L"][i-1]}
                  </div>
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a2e" }}>User {i}</span>
                      <span style={{ fontSize: "0.7rem", color: "#adb5bd" }}>{i}h ago</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6c757d", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isRTL ? "أريد الاستفسار عن مشروع جديد..." : "I'd like to discuss a new project..."}
                    </p>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline-primary btn-sm w-100 fw-bold" style={{ borderRadius: "20px", padding: "8px" }}>
                {isRTL ? "عرض كل الرسائل" : "View All Inbox"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
