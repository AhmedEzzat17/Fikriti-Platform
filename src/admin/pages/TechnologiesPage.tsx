import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";

const TechnologiesPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [showModal, setShowModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState<any>(null);

  const [techs, setTechs] = useState([
    { id: 1, name: "React JS",      icon: "fa-react",    level: "Expert",       color: "text-info"    },
    { id: 2, name: "Node JS",       icon: "fa-node-js",  level: "Intermediate", color: "text-success" },
    { id: 3, name: "Tailwind CSS",  icon: "fa-css3-alt", level: "Advanced",     color: "text-primary" },
    { id: 4, name: "MongoDB",       icon: "fa-database", level: "Intermediate", color: "text-success" },
    { id: 5, name: "TypeScript",    icon: "fa-code",     level: "Advanced",     color: "text-primary" },
    { id: 6, name: "Next.js",       icon: "fa-n",        level: "Expert",       color: "text-dark"    },
  ]);

  const columns = [
    {
      key: "name",
      label: isRTL ? "التقنية" : "Technology",
      render: (row: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            className={row.color}
            style={{ width: 38, height: 38, borderRadius: "50%", background: "#f8f9fa", border: "1px solid #e9ecef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <i className={`fa-brands ${row.icon} fs-5`}></i>
          </div>
          <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{row.name}</span>
        </div>
      )
    },
    {
      key: "level",
      label: isRTL ? "المستوى" : "Level",
      render: (row: any) => {
        const colors: Record<string, string> = {
          Expert:       "bg-success-subtle text-success",
          Advanced:     "bg-primary-subtle text-primary",
          Intermediate: "bg-warning-subtle text-warning",
          Beginner:     "bg-secondary-subtle text-secondary",
        };
        return (
          <span className={`badge rounded-pill px-3 py-1 fw-bold ${colors[row.level] || "bg-light text-dark"}`}
            style={{ fontSize: "0.72rem" }}>
            {row.level}
          </span>
        );
      }
    },
  ];

  const handleAdd    = ()           => { setSelectedTech(null);  setShowModal(true); };
  const handleEdit   = (tech: any)  => { setSelectedTech(tech);  setShowModal(true); };
  const handleDelete = (tech: any)  => {
    if (window.confirm(isRTL ? "هل أنت متأكد من حذف هذه التقنية؟" : "Delete this technology?"))
      setTechs(prev => prev.filter(t => t.id !== tech.id));
  };

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
          {isRTL ? "التقنيات" : "Technologies"}
        </h4>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
          {isRTL ? "إدارة المهارات والتقنيات المستخدمة في مشاريعنا" : "Manage skills and technologies used in our projects"}
        </p>
      </div>

      {/* Two-column layout: table | stats card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>

        {/* Table – takes most of the width */}
        <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
          <DataTable
            title={isRTL ? "قائمة التقنيات" : "Tech List"}
            columns={columns}
            data={techs}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Stats sidebar */}
        <div style={{ flex: "0 0 260px", minWidth: "220px" }}>
          {/* Summary card */}
          <div style={{
            borderRadius: "16px", padding: "24px",
            background: "linear-gradient(135deg, #0d83fd 0%, #4facfe 100%)",
            color: "#fff", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(13,131,253,0.25)",
            marginBottom: "16px"
          }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h5 style={{ fontWeight: 700, marginBottom: "8px" }}>
                {isRTL ? "تحليل المهارات" : "Skills Analysis"}
              </h5>
              <p style={{ fontSize: "0.82rem", opacity: 0.8, marginBottom: "20px" }}>
                {isRTL
                  ? "تنظيم التقنيات يساعد في عرض خبرات الفريق للعملاء بشكل احترافي."
                  : "Organizing technologies helps showcase team expertise to clients professionally."}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1 }}>{techs.length}</span>
                <span style={{ fontSize: "0.82rem", opacity: 0.8 }}>
                  {isRTL ? "تقنية نشطة" : "Active Technologies"}
                </span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.25)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "75%", background: "#fff", borderRadius: "10px" }}></div>
              </div>
            </div>
            <i className="fa-solid fa-microchip"
              style={{ position: "absolute", bottom: "-20px", right: "-20px", fontSize: "130px", opacity: 0.12 }}></i>
          </div>

          {/* Level breakdown */}
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", padding: "20px" }}>
            <h6 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "14px", fontSize: "0.9rem" }}>
              {isRTL ? "توزيع المستويات" : "Level Breakdown"}
            </h6>
            {["Expert","Advanced","Intermediate","Beginner"].map(lvl => {
              const count = techs.filter(t => t.level === lvl).length;
              const pct   = techs.length ? Math.round((count / techs.length) * 100) : 0;
              const clrMap: Record<string,string> = { Expert:"#10b981", Advanced:"#0d83fd", Intermediate:"#f59e0b", Beginner:"#6c757d" };
              return (
                <div key={lvl} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1a1a2e" }}>{lvl}</span>
                    <span style={{ fontSize: "0.7rem", color: "#6c757d", fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ height: "6px", background: "#f1f3f4", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: clrMap[lvl], borderRadius: "10px", transition: "width 0.6s ease" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", width: "100%", maxWidth: "460px", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "20px 24px", background: "#0d83fd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>
                {selectedTech
                  ? (isRTL ? "تعديل تقنية" : "Edit Technology")
                  : (isRTL ? "إضافة تقنية جديدة" : "Add New Technology")}
              </h5>
              <button className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <div style={{ padding: "24px", background: "#fafbfc" }}>
              <form onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
                {[
                  { label: isRTL ? "اسم التقنية" : "Technology Name", type: "text",  val: selectedTech?.name  },
                  { label: isRTL ? "كلاس الأيقونة" : "Icon Class",    type: "text",  val: selectedTech?.icon, ph: "fa-react" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</label>
                    <input type={f.type} defaultValue={f.val} placeholder={f.ph || ""}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "المستوى" : "Level"}
                  </label>
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: "0.9rem", outline: "none" }}>
                    {["Beginner","Intermediate","Advanced","Expert"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" className="btn btn-light btn-sm fw-bold px-4" style={{ borderRadius: "20px" }} onClick={() => setShowModal(false)}>
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm fw-bold px-5" style={{ borderRadius: "20px" }}>
                    {isRTL ? "حفظ" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologiesPage;
