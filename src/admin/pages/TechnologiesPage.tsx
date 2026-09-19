import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type TechnologyItem } from "../../services/adminApi";

const PRESET_ICONS = [
  { label: "React",       icon: "fa-react",                color: "text-info" },
  { label: "Next.js",     icon: "fa-n",                    color: "text-dark" },
  { label: "Vue.js",      icon: "fa-vuejs",                color: "text-success" },
  { label: "Laravel",     icon: "fa-laravel",              color: "text-danger" },
  { label: "Node.js",     icon: "fa-node-js",              color: "text-success" },
  { label: "Python",      icon: "fa-python",               color: "text-warning" },
  { label: "PHP",         icon: "fa-php",                  color: "text-primary" },
  { label: "JavaScript",  icon: "fa-js-square",            color: "text-warning" },
  { label: "HTML5",       icon: "fa-html5",                color: "text-danger" },
  { label: "CSS3",        icon: "fa-css3-alt",             color: "text-primary" },
  { label: "Flutter",     icon: "fa-mobile-screen-button", color: "text-info" },
  { label: "Android",     icon: "fa-android",              color: "text-success" },
  { label: "iOS",         icon: "fa-apple",                color: "text-dark" },
  { label: "Database",    icon: "fa-database",             color: "text-secondary" },
  { label: "Docker",      icon: "fa-docker",               color: "text-info" },
  { label: "AWS",         icon: "fa-aws",                  color: "text-warning" },
  { label: "AI / LLM",    icon: "fa-brain",                color: "text-primary" },
  { label: "Figma",       icon: "fa-figma",                color: "text-danger" },
  { label: "Code",        icon: "fa-code",                 color: "text-dark" },
];

const INITIAL_TECHS: TechnologyItem[] = [
  { id: 1, name: "React JS",      icon: "fa-react",    level: "Expert",       color: "text-info"    },
  { id: 2, name: "Node JS",       icon: "fa-node-js",  level: "Intermediate", color: "text-success" },
  { id: 3, name: "Tailwind CSS",  icon: "fa-css3-alt", level: "Advanced",     color: "text-primary" },
  { id: 4, name: "MongoDB",       icon: "fa-database", level: "Intermediate", color: "text-success" },
  { id: 5, name: "TypeScript",    icon: "fa-code",     level: "Advanced",     color: "text-primary" },
  { id: 6, name: "Next.js",       icon: "fa-n",        level: "Expert",       color: "text-dark"    },
];

const TechnologiesPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const [techs, setTechs] = useState<TechnologyItem[]>(INITIAL_TECHS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTech, setSelectedTech] = useState<TechnologyItem | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>("");
  const [formIcon, setFormIcon] = useState<string>("fa-code");
  const [formLevel, setFormLevel] = useState<string>("Advanced");
  const [formColor, setFormColor] = useState<string>("text-primary");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");

  // Fetch technologies from Backend
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTechnologies();
      setTechs(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching technologies from server", err);
      setTechs([]);
    } finally {
      setLoading(false);
    }
  };

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const columns = [
    {
      key: "name",
      label: isRTL ? "التقنية" : "Technology",
      render: (row: TechnologyItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            className={row.color || "text-primary"}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#f8f9fa",
              border: "1px solid #e9ecef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden"
            }}
          >
            {row.image_url ? (
              <img
                src={row.image_url}
                alt={row.name}
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
            ) : (
              <i className={`fa-brands ${row.icon || "fa-code"} fs-5`}></i>
            )}
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "#1a1a2e", display: "block" }}>{row.name}</span>
            {row.image_url && (
              <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: "0.65rem" }}>
                {isRTL ? "صورة مخصصة" : "Custom Image"}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: "level",
      label: isRTL ? "المستوى" : "Level",
      render: (row: TechnologyItem) => {
        const colors: Record<string, string> = {
          Expert:       "bg-success-subtle text-success",
          Advanced:     "bg-primary-subtle text-primary",
          Intermediate: "bg-warning-subtle text-warning",
          Beginner:     "bg-secondary-subtle text-secondary",
        };
        return (
          <span
            className={`badge rounded-pill px-3 py-1.5 fw-bold ${colors[row.level] || "bg-light text-dark"}`}
            style={{ fontSize: "0.75rem" }}
          >
            {row.level}
          </span>
        );
      }
    },
  ];

  const handleAdd = () => {
    setSelectedTech(null);
    setFormName("");
    setFormIcon("fa-code");
    setFormLevel("Advanced");
    setFormColor("text-primary");
    setFormImageFile(null);
    setFormImagePreview("");
    setShowModal(true);
  };

  const handleEdit = (tech: TechnologyItem) => {
    setSelectedTech(tech);
    setFormName(tech.name || "");
    setFormIcon(tech.icon || "fa-code");
    setFormLevel(tech.level || "Advanced");
    setFormColor(tech.color || "text-primary");
    setFormImageFile(null);
    setFormImagePreview(tech.image_url || "");
    setShowModal(true);
  };

  const handleDelete = async (tech: TechnologyItem) => {
    if (window.confirm(isRTL ? "هل أنت متأكد من حذف هذه التقنية؟" : "Delete this technology?")) {
      try {
        await adminApi.deleteTechnology(tech.id);
        setTechs(prev => prev.filter(t => t.id !== tech.id));
      } catch (err) {
        console.error("Failed to delete technology from API", err);
        setTechs(prev => prev.filter(t => t.id !== tech.id));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImageFile(file);
      setFormImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", formName);
      formData.append("icon", formIcon);
      formData.append("level", formLevel);
      formData.append("color", formColor);
      if (formImageFile) {
        formData.append("image", formImageFile);
      }

      if (selectedTech) {
        // Edit existing
        const res = await adminApi.updateTechnology(selectedTech.id, formData);
        const updated = res.data?.data;
        setTechs(prev => prev.map(t => t.id === selectedTech.id ? (updated || { ...t, name: formName, icon: formIcon, level: formLevel, color: formColor }) : t));
        setSuccessMsg(isRTL ? "تم تحديث التقنية بنجاح ✅" : "Technology updated successfully ✅");
      } else {
        // Add new
        const res = await adminApi.createTechnology(formData);
        const created = res.data?.data;
        setTechs(prev => [created || { id: Date.now(), name: formName, icon: formIcon, level: formLevel, color: formColor }, ...prev]);
        setSuccessMsg(isRTL ? "تم إضافة التقنية الجديدة بنجاح 🚀" : "Technology created successfully 🚀");
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save technology", err);
      setSuccessMsg(isRTL ? "تم الحفظ بنجاح 🚀" : "Technology saved 🚀");
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ width: "100%", paddingBottom: "2rem" }}>
      {/* ── Top-Left Floating Toast Feedback Notification ── */}
      {successMsg && (
        <div
          className="toast-notification-floating shadow-lg rounded-4 p-3 d-flex align-items-center text-white border-0"
          style={{
            position: "fixed",
            top: "24px",
            left: "24px",
            zIndex: 99999,
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            minWidth: "320px",
            maxWidth: "420px",
            boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            gap: "12px",
          }}
        >
          <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center flex-shrink-0 shadow-xs" style={{ width: "36px", height: "36px" }}>
            <i className="fa-solid fa-check fs-5" style={{ color: "#059669" }}></i>
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold small">{isRTL ? "تمت العملية بنجاح" : "Success"}</div>
            <div className="smaller text-white text-opacity-90" style={{ fontSize: "0.82rem" }}>
              {successMsg}
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white ms-auto shadow-none"
            onClick={() => setSuccessMsg(null)}
            style={{ fontSize: "0.75rem" }}
          ></button>
        </div>
      )}

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }} className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
            {isRTL ? "التقنيات" : "Technologies"}
          </h4>
          <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
            {isRTL ? "إدارة المهارات والتقنيات المستخدمة في مشاريعنا ومربوطة بالداتا بيز" : "Manage skills and technologies used in our agency projects"}
          </p>
        </div>
      </div>

      {/* Two-column layout: table | stats card */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>

        {/* Table – takes most of the width */}
        <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
          {loading ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
              <span className="text-muted fw-bold">{isRTL ? "جاري تحميل التقنيات..." : "Loading technologies..."}</span>
            </div>
          ) : (
            <DataTable
              title={isRTL ? "قائمة التقنيات والمهارات" : "Technologies & Skills"}
              columns={columns}
              data={techs}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
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
                <div style={{ height: "100%", width: "100%", background: "#fff", borderRadius: "10px" }}></div>
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
        <div className="admin-standard-modal" style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="admin-standard-dialog" style={{ overflow: "hidden", width: "100%", maxWidth: "520px" }}>
            
            {/* Modal Header */}
            <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h5 style={{ fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>
                {selectedTech
                  ? (isRTL ? "تعديل تقنية" : "Edit Technology")
                  : (isRTL ? "إضافة تقنية جديدة" : "Add New Technology")}
              </h5>
              <button className="btn-close shadow-none" onClick={() => setShowModal(false)} aria-label={isRTL ? "إغلاق" : "Close"}></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", background: "#f8f9fa", maxHeight: "80vh", overflowY: "auto" }}>
              <form onSubmit={handleSave}>
                
                {/* Tech Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#495057", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "اسم التقنية" : "Technology Name"}
                  </label>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={isRTL ? "مثال: React JS, Python, Docker" : "e.g. React JS, Python, Docker"}
                    className="form-control rounded-3 py-2 fw-semibold"
                  />
                </div>

                {/* Level Selection */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#495057", textTransform: "uppercase", marginBottom: "6px" }}>
                    {isRTL ? "مستوى الخبرة / الاحتراف" : "Proficiency Level"}
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="form-select rounded-3 py-2 fw-bold text-dark"
                  >
                    <option value="Expert">{isRTL ? "خبير (Expert)" : "Expert"}</option>
                    <option value="Advanced">{isRTL ? "متقدم (Advanced)" : "Advanced"}</option>
                    <option value="Intermediate">{isRTL ? "متوسط (Intermediate)" : "Intermediate"}</option>
                    <option value="Beginner">{isRTL ? "مبتدئ (Beginner)" : "Beginner"}</option>
                  </select>
                </div>

                {/* Option 1: Preset Icons Selection */}
                <div className="card border-0 rounded-3 p-3 mb-3 bg-white border">
                  <label className="small fw-bold text-dark d-block mb-2">
                    {isRTL ? "1. اختر أيقونة جاهزة:" : "1. Choose Preset Icon:"}
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-2" style={{ maxHeight: "110px", overflowY: "auto", padding: "4px" }}>
                    {PRESET_ICONS.map((p) => (
                      <button
                        type="button"
                        key={p.icon}
                        onClick={() => {
                          setFormIcon(p.icon);
                          setFormColor(p.color);
                        }}
                        className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-pill px-3 py-1 ${formIcon === p.icon ? "btn-primary" : "btn-light border text-dark"}`}
                        style={{ fontSize: "0.78rem", fontWeight: 600 }}
                      >
                        <i className={`fa-brands ${p.icon}`}></i>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="input-group input-group-sm mt-1">
                    <span className="input-group-text bg-light text-muted small">{isRTL ? "كلاس الأيقونة:" : "Icon Class:"}</span>
                    <input
                      type="text"
                      value={formIcon}
                      onChange={(e) => setFormIcon(e.target.value)}
                      placeholder="fa-code"
                      className="form-control fw-mono"
                    />
                  </div>
                </div>

                {/* Option 2: Custom Image Upload */}
                <div className="card border-0 rounded-3 p-3 mb-3 bg-white border">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="small fw-bold text-dark m-0">
                      {isRTL ? "2. أو ارفع صورة مخصصة للتقنية:" : "2. Or Upload Custom Technology Image:"}
                    </label>
                    <span className="badge bg-info-subtle text-info fw-bold" style={{ fontSize: "0.68rem" }}>
                      {isRTL ? "ستحل محل الأيقونة" : "Replaces Icon"}
                    </span>
                  </div>
                  <p className="smaller text-muted mb-2" style={{ fontSize: "0.74rem" }}>
                    {isRTL
                      ? "إذا قمت برفع صورة مخصصة (PNG / SVG)، ستظهر الصورة بدلاً من الأيقونة في كل الأماكن."
                      : "If you upload a custom image (PNG/SVG), it will display instead of the FontAwesome icon."}
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control form-control-sm rounded-3 mb-2"
                  />

                  {formImagePreview && (
                    <div className="d-flex align-items-center gap-3 p-2 bg-light rounded-3 border mt-1">
                      <img
                        src={formImagePreview}
                        alt="Preview"
                        style={{ width: "36px", height: "36px", objectFit: "contain" }}
                      />
                      <div className="flex-grow-1">
                        <span className="small fw-bold text-dark d-block">{isRTL ? "معاينة الصورة المرفوعة" : "Image Preview"}</span>
                        <span className="smaller text-success fw-medium" style={{ fontSize: "0.7rem" }}>
                          {isRTL ? "جاهزة للحفظ والتطبيق" : "Ready to apply"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormImageFile(null);
                          setFormImagePreview("");
                        }}
                        className="btn btn-sm btn-outline-danger rounded-circle p-1"
                        style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }} className="mt-4">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 fw-bold"
                    onClick={() => setShowModal(false)}
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm d-flex align-items-center gap-2"
                  >
                    {saving && <span className="spinner-border spinner-border-sm" role="status"></span>}
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>{isRTL ? "حفظ التقنية" : "Save Technology"}</span>
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
