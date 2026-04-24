import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";

const ProjectsPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [showModal, setShowModal]       = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [projects, setProjects] = useState([
    { id: 1, name: "Fikriti Web",    category: "Web Development", date: "2026-04-10", image: "/assets/images/i-removebg-preview.png", status: "Active"    },
    { id: 2, name: "E-Commerce App", category: "Mobile App",      date: "2026-04-12", image: "/assets/images/i-removebg-preview.png", status: "Pending"   },
    { id: 3, name: "School System",  category: "System",          date: "2026-04-15", image: "/assets/images/i-removebg-preview.png", status: "Completed" },
  ]);

  const statusColor: Record<string, string> = {
    Active:    "bg-success-subtle text-success",
    Pending:   "bg-warning-subtle text-warning",
    Completed: "bg-info-subtle text-info",
  };

  const columns = [
    {
      key: "name",
      label: isRTL ? "اسم المشروع" : "Project Name",
      render: (row: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={row.image} alt={row.name}
            style={{ width: 36, height: 36, objectFit: "contain", borderRadius: "8px", background: "#f8f9fa", border: "1px solid #e9ecef", padding: "4px" }} />
          <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.9rem" }}>{row.name}</span>
        </div>
      )
    },
    { key: "category", label: isRTL ? "التصنيف" : "Category" },
    { key: "date",     label: isRTL ? "التاريخ"  : "Date"     },
    {
      key: "status",
      label: isRTL ? "الحالة" : "Status",
      render: (row: any) => (
        <span className={`badge rounded-pill fw-bold ${statusColor[row.status] || "bg-light text-dark"}`}
          style={{ padding: "5px 12px", fontSize: "0.72rem" }}>
          {row.status}
        </span>
      )
    },
  ];

  const handleAdd    = ()              => { setSelectedProject(null);    setShowModal(true); };
  const handleEdit   = (proj: any)     => { setSelectedProject(proj);    setShowModal(true); };
  const handleDelete = (proj: any)     => {
    if (window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المشروع؟" : "Delete this project?"))
      setProjects(prev => prev.filter(p => p.id !== proj.id));
  };

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
          {isRTL ? "أعمالنا" : "Our Work"}
        </h4>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
          {isRTL ? "إدارة المشاريع المعروضة في المعرض" : "Manage portfolio projects"}
        </p>
      </div>

      <DataTable
        title={isRTL ? "قائمة المشاريع" : "Project List"}
        columns={columns}
        data={projects}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", width: "100%", maxWidth: "480px", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "20px 24px", background: "#0d83fd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>
                {selectedProject ? (isRTL ? "تعديل مشروع" : "Edit Project") : (isRTL ? "إضافة مشروع جديد" : "Add New Project")}
              </h5>
              <button className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <div style={{ padding: "24px", background: "#fafbfc" }}>
              <form onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "اسم المشروع" : "Project Name"}
                  </label>
                  <input type="text" defaultValue={selectedProject?.name}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "التصنيف" : "Category"}
                  </label>
                  <select style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: "0.9rem", outline: "none" }}>
                    {["Web Development","Mobile App","System","Design","Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "الحالة" : "Status"}
                  </label>
                  <select defaultValue={selectedProject?.status}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: 0, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontSize: "0.9rem", outline: "none" }}>
                    {["Active","Pending","Completed"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "صورة المشروع" : "Project Image"}
                  </label>
                  <input type="file" accept="image/*"
                    style={{ width: "100%", padding: "8px 14px", borderRadius: "10px", border: "1px dashed #dee2e6", background: "#fff", fontSize: "0.85rem", boxSizing: "border-box", cursor: "pointer" }} />
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

export default ProjectsPage;
