import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi from "../../services/adminApi";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  job_title?: string;
  role: string;
  status?: string;
  notes?: string;
  joinDate?: string;
  created_at?: string;
}

const DRAFT_STORAGE_KEY = "fikriti_user_add_draft_v1";

const UsersPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  
  const defaultEmptyForm = {
    name: "",
    email: "",
    phone: "",
    job_title: "",
    role: "admin",
    status: "active",
    password: "",
    notes: "",
  };

  const [formData, setFormData] = useState(defaultEmptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await adminApi.getUsers();
      const fetchedUsers = (res.data.data || []).map((u: any) => ({
        ...u,
        phone: u.phone || "",
        job_title: u.job_title || "",
        status: u.status || "active",
        notes: u.notes || "",
        joinDate: u.joinDate || (u.created_at ? u.created_at.split("T")[0] : "2026-07-24"),
      }));
      setUsers(fetchedUsers);
      setIsFallback(false);
    } catch (error: any) {
      console.error("Failed fetching users from server", error);
      setUsers([]);
      setIsFallback(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-save draft whenever user modifies formData during Add mode (selectedUser === null)
  useEffect(() => {
    if (showModal && selectedUser === null) {
      const hasContent = Object.entries(formData).some(([k, v]) => k !== "role" && k !== "status" && v !== "");
      if (hasContent) {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
          setIsDraftLoaded(true);
        } catch (e) {
          console.error("Could not save form draft", e);
        }
      }
    }
  }, [formData, showModal, selectedUser]);

  const getAvatarStyle = (name: string) => {
    const char = (name || "U").charAt(0).toUpperCase();
    const colors = [
      { bg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color: "#fff" },
      { bg: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "#fff" },
      { bg: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#fff" },
      { bg: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", color: "#fff" },
      { bg: "linear-gradient(135deg, #475569 0%, #334155 100%)", color: "#fff" },
    ];
    const idx = char.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  // Role Badge configurations (Admin & Editor)
  const getRoleBadgeConfig = (roleStr: string) => {
    const r = (roleStr || "").toLowerCase().trim();
    if (r === "admin" || r === "super admin") {
      return {
        bg: "#18181b",
        text: "#fbbf24",
        border: "#27272a",
        icon: "fa-shield-halved",
        label: "Admin"
      };
    } else {
      return {
        bg: "#ecfdf5",
        text: "#047857",
        border: "#a7f3d0",
        icon: "fa-pen-nib",
        label: isRTL ? "محرر (Editor)" : "Editor"
      };
    }
  };

  const columns = [
    { 
      key: "name", 
      label: isRTL ? "المستخدم والاتصال" : "User & Contact",
      render: (row: User) => {
        const avatarStyle = getAvatarStyle(row.name);
        return (
          <div className="d-flex align-items-center" style={{ gap: "14px" }}>
            <div className="rounded-4 d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0" style={{ width: "42px", height: "42px", background: avatarStyle.bg, color: avatarStyle.color, fontSize: "1.05rem" }}>
              {row.name ? row.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="fw-bold text-dark fs-6 d-flex align-items-center">
                <span>{row.name}</span>
              </div>
              <div className="text-muted small mb-0 d-flex align-items-center" style={{ gap: "8px" }}>
                <i className="fa-regular fa-envelope opacity-75"></i>
                <span>{row.email}</span>
              </div>
              {row.phone && (
                <div className="text-muted smaller d-flex align-items-center mt-1" style={{ fontSize: "0.78rem", gap: "8px" }}>
                  <i className="fa-solid fa-phone-flip text-primary opacity-75"></i>
                  <span className="fw-medium">{row.phone}</span>
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: "job_title",
      label: isRTL ? "المسمى والمسؤولية" : "Designation",
      render: (row: User) => (
        <div>
          <div className="fw-semibold text-dark small">{row.job_title || (isRTL ? "مسؤول نظام العام" : "System Staff")}</div>
          <span className="text-muted smaller d-block mt-1 opacity-75" style={{ fontSize: "0.75rem" }}>
            {row.notes ? (row.notes.length > 35 ? row.notes.substring(0, 35) + "..." : row.notes) : (isRTL ? "صلاحيات أساسية" : "Standard privileges")}
          </span>
        </div>
      )
    },
    { 
      key: "role", 
      label: isRTL ? "صلاحية الوصول" : "Access Role",
      render: (row: User) => {
        const badge = getRoleBadgeConfig(row.role);
        return (
          <span 
            className="badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center shadow-xs" 
            style={{ 
              backgroundColor: badge.bg, 
              color: badge.text, 
              border: `1px solid ${badge.border}`,
              fontSize: "0.82rem",
              letterSpacing: "0.3px",
              gap: "8px"
            }}
          >
            <i className={`fa-solid ${badge.icon}`} style={{ color: badge.text }}></i>
            <span>{badge.label}</span>
          </span>
        );
      }
    },
    {
      key: "status",
      label: isRTL ? "الحالة التفاعلية" : "Status",
      render: (row: User) => {
        const st = (row.status || "active").toLowerCase();
        let bg = "#ecfdf5", text = "#059669", border = "#a7f3d0", label = isRTL ? "نشط ومصرح" : "Active", dot = "#10b981";
        if (st === "suspended" || st === "disabled" || st === "banned") {
          bg = "#fef2f2"; text = "#dc2626"; border = "#fecaca"; label = isRTL ? "معلق الحظر" : "Suspended"; dot = "#ef4444";
        } else if (st === "pending") {
          bg = "#fffbeb"; text = "#d97706"; border = "#fde68a"; label = isRTL ? "قيد التدقيق" : "Pending"; dot = "#f59e0b";
        }
        return (
          <span className="badge rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center" style={{ backgroundColor: bg, color: text, border: `1px solid ${border}`, fontSize: "0.78rem", gap: "8px" }}>
            <span className="rounded-circle" style={{ width: "7px", height: "7px", backgroundColor: dot, display: "inline-block" }}></span>
            <span>{label}</span>
          </span>
        );
      }
    },
    { 
      key: "joinDate", 
      label: isRTL ? "تاريخ التسجيل" : "Join Date",
      render: (row: User) => (
        <div className="small fw-medium text-muted d-flex align-items-center" style={{ gap: "8px" }}>
          <i className="fa-regular fa-calendar text-secondary opacity-75"></i>
          <span>{row.joinDate}</span>
        </div>
      )
    },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setShowPassword(false);
    setErrorMsg(null);
    setIsDraftLoaded(false);

    // Check if there is an unsaved draft in localStorage
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        setIsDraftLoaded(true);
      } else {
        setFormData(defaultEmptyForm);
      }
    } catch (e) {
      setFormData(defaultEmptyForm);
    }

    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDraftLoaded(false);
    setFormData({ 
      name: user.name || "", 
      email: user.email || "", 
      phone: user.phone || "", 
      job_title: user.job_title || "", 
      role: user.role || "editor", 
      status: user.status || "active", 
      password: "", 
      notes: user.notes || "" 
    });
    setShowPassword(false);
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {}
    setFormData(defaultEmptyForm);
    setIsDraftLoaded(false);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(isRTL ? `هل أنت متأكد من رغبتك في حذف الحساب "${user.name}" نهائياً؟` : `Delete account "${user.name}"?`)) {
      try {
        if (!isFallback) {
          await adminApi.deleteUser(user.id);
          setSuccessMsg(isRTL ? "تم حذف المستخدم بنجاح من السيرفر" : "User deleted successfully");
        }
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } catch (err: any) {
        alert(err.message || (isRTL ? "خطأ أثناء محاولة الحذف" : "Error deleting user"));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (selectedUser) {
        // Update User
        if (!isFallback) {
          const payload: any = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            job_title: formData.job_title,
            role: formData.role,
            status: formData.status,
            notes: formData.notes,
          };
          if (formData.password) {
            payload.password = formData.password;
          }
          await adminApi.updateUser(selectedUser.id, payload);
          setSuccessMsg(isRTL ? "تم تحديث بيانات الحساب على السيرفر بنجاح" : "User updated successfully");
          await fetchUsers();
        } else {
          setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
          setSuccessMsg(isRTL ? "تم التحديث بنجاح (محلياً)" : "Updated successfully (Local Mode)");
        }
      } else {
        // Create User
        if (!isFallback) {
          await adminApi.createUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            job_title: formData.job_title,
            role: formData.role,
            status: "active",
            notes: formData.notes,
            password: formData.password || "FikritiSec2026!",
          });
          setSuccessMsg(isRTL ? "تم إضافة المستخدم الجديد بنجاح" : "New user created successfully");
          await fetchUsers();
        } else {
          const newUser: User = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone || "+20 100 000 0000",
            job_title: formData.job_title || "Team Specialist",
            role: formData.role,
            status: "active",
            notes: formData.notes,
            joinDate: new Date().toISOString().split("T")[0],
          };
          setUsers(prev => [newUser, ...prev]);
          setSuccessMsg(isRTL ? "تمت الإضافة للقائمة الحية بنجاح" : "Added successfully");
        }
        // Remove draft upon successful addition
        try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch(e) {}
        setIsDraftLoaded(false);
      }
      setShowModal(false);
    } catch (error: any) {
      setErrorMsg(error.message || (isRTL ? "حدث خطأ أثناء الاتصال بالباك أند" : "Validation or network error"));
    } finally {
      setSubmitting(false);
    }
  };

  // 2 Role Options: Admin and Editor (matches DB ENUM)
  const roleOptions = [
    { id: "admin",  labelAr: "Admin / مسؤول",   labelEn: "Admin",  icon: "fa-shield-halved", color: "#fbbf24", bg: "#18181b", border: "#3f3f46" },
    { id: "editor", labelAr: "Editor / محرر",    labelEn: "Editor", icon: "fa-pen-nib",       color: "#047857", bg: "#ecfdf5", border: "#10b981" },
  ];

  return (
    <div className="users-management-container">
      {/* ── Page Title Banner ── */}
      <div className="card border-0 rounded-4 p-4 mb-4 shadow-sm text-white overflow-hidden relative-banner" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)" }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <span className="badge bg-warning text-dark fw-bold px-3 py-1 mb-2 rounded-pill smaller text-uppercase d-inline-flex align-items-center" style={{ gap: "8px" }}>
              <i className="fa-solid fa-users-gear"></i>
              <span>{isRTL ? "إدارة الصلاحيات والمشرفين" : "Access Control Center"}</span>
            </span>
            <h3 className="fw-bold mb-1 text-white">{isRTL ? "فريق عمل المنظومة والمشرفين" : "Agency Staff & Administrators"}</h3>
            <p className="text-light text-opacity-75 small mb-0">
              {isRTL 
                ? "تحكم احترافي وسريع في حسابات فريق التطوير والإدارة، مع تنسيق كامل للصلاحيات وحماية الاتصال." 
                : "Manage agency staff permissions and security levels connected directly to the server."}
            </p>
          </div>
          <div>
            {loading ? (
              <span className="badge bg-dark bg-opacity-50 text-white p-2 px-3 rounded-pill small d-inline-flex align-items-center" style={{ gap: "8px" }}>
                <i className="fa-solid fa-spinner fa-spin text-warning"></i>
                <span>{isRTL ? "مزامنة..." : "Syncing..."}</span>
              </span>
            ) : isFallback ? (
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center" style={{ gap: "8px" }}>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>{isRTL ? "وضع البيانات الحية (بانتظار الرفع)" : "Live UI Mode (Pending Deploy)"}</span>
              </span>
            ) : (
              <span className="badge bg-success px-3 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center" style={{ gap: "8px" }}>
                <i className="fa-solid fa-shield-check"></i>
                <span>{isRTL ? "متصل بسيرفر الباك اند" : "Connected to Server API"}</span>
              </span>
            )}
          </div>
        </div>
      </div>

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

      {/* ── Main Data Table ── */}
      <DataTable 
        title={isRTL ? "سجلات حسابات المنظومة" : "Active Staff Roster"} 
        columns={columns} 
        data={users} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />

      {/* ── Ultra-Coordinated Add/Edit Modal (100% Guaranteed Side-by-Side Flexbox Layout) ── */}
      {showModal && (
        <div 
          className="modal fade show d-block modal-glass-backdrop" 
          tabIndex={-1}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden admin-modal">
              
              {/* Compact Modal Header */}
              <div className="modal-header border-0 py-3 px-4 align-items-center justify-content-between">
                <div className="d-flex align-items-center" style={{ gap: "14px" }}>
                  <div className="rounded-3 p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                    <i className={`fa-solid ${selectedUser ? "fa-user-pen" : "fa-user-plus"} fs-6 text-white`}></i>
                  </div>
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-white d-flex align-items-center" style={{ fontSize: "1.1rem", gap: "8px" }}>
                      <span>
                        {selectedUser 
                          ? (isRTL ? `تعديل بيانات وصلاحيات الحساب #${selectedUser.id}` : `Edit Account #${selectedUser.id}`) 
                          : (isRTL ? "إضافة مسؤول جديد للنظام" : "Add New Administrator")}
                      </span>
                      {!selectedUser && isDraftLoaded && (
                        <span className="badge bg-warning text-dark rounded-pill smaller px-2 py-0 fw-bold d-inline-flex align-items-center" style={{ fontSize: "0.7rem", gap: "4px" }}>
                          <i className="fa-solid fa-cloud-arrow-down"></i>
                          <span>{isRTL ? "مسودة محفوظة" : "Draft"}</span>
                        </span>
                      )}
                    </h6>
                    <span className="text-light text-opacity-75 d-block" style={{ fontSize: "0.76rem", marginTop: "2px" }}>
                      {selectedUser 
                        ? (isRTL ? "تحديث التنسيق الحي وإدارة حالة نشاط الحساب" : "Modify credentials & account activity status") 
                        : (isRTL ? "تنسيق متوارٍ متكامل وتوزيع متوازٍ للصلاحيات (حفظ ذاتي)" : "Streamlined layout with auto-draft preservation")}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                  {/* Clear Fields Button - EXCLUSIVE TO ADD MODE ONLY */}
                  {!selectedUser && (
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="btn btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center shadow-xs clear-draft-btn"
                      style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: "0.8rem", gap: "6px" }}
                      title={isRTL ? "تفريغ جميع الحقول والمسودة الحالية" : "Clear form inputs & draft"}
                    >
                      <i className="fa-solid fa-eraser"></i>
                      <span>{isRTL ? "مسح الحقول" : "Clear Fields"}</span>
                    </button>
                  )}
                  <button type="button" className="btn-close btn-close-white shadow-none opacity-75 m-0" onClick={() => setShowModal(false)} disabled={submitting}></button>
                </div>
              </div>

              {/* Compact Modal Body */}
              <div className="modal-body p-4 bg-light bg-opacity-75">
                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 rounded-2 small fw-medium mb-3 border-0 border-start border-danger border-4 shadow-xs d-flex align-items-center" style={{ gap: "8px" }}>
                    <i className="fa-solid fa-circle-exclamation text-danger"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* ── GUARANTEED SIDE-BY-SIDE ROW 1: Full Name + Email ── */}
                  <div className="d-flex flex-row align-items-start justify-content-between w-100" style={{ gap: "16px", marginBottom: "16px" }}>
                    
                    <div style={{ flex: "1 1 50%", width: "50%", minWidth: "0" }}>
                      <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                        <i className="fa-solid fa-user text-primary opacity-75"></i>
                        <span>{isRTL ? "الاسم الكامل (Full Name)" : "Full Name"}</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-3 border py-2 px-3 shadow-xs fw-medium text-dark bg-white" 
                        placeholder={isRTL ? "مثال: م. أحمد منصور..." : "e.g. Alex Pierce"}
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div style={{ flex: "1 1 50%", width: "50%", minWidth: "0" }}>
                      <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                        <i className="fa-solid fa-envelope text-primary opacity-75"></i>
                        <span>{isRTL ? "البريد الإلكتروني للعمل" : "Corporate Email"}</span>
                      </label>
                      <input 
                        type="email" 
                        className="form-control form-control-sm rounded-3 border py-2 px-3 shadow-xs fw-medium text-dark bg-white" 
                        placeholder="user@company-domain.com"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* ── GUARANTEED SIDE-BY-SIDE ROW 2: Phone + Job Title ── */}
                  <div className="d-flex flex-row align-items-start justify-content-between w-100" style={{ gap: "16px", marginBottom: "16px" }}>
                    
                    <div style={{ flex: "1 1 50%", width: "50%", minWidth: "0" }}>
                      <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                        <i className="fa-solid fa-phone text-primary opacity-75"></i>
                        <span>{isRTL ? "رقم الجوال / الواتساب" : "Phone Number"}</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-3 border py-2 px-3 shadow-xs fw-medium text-dark bg-white" 
                        placeholder="+20 100 000 0000"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div style={{ flex: "1 1 50%", width: "50%", minWidth: "0" }}>
                      <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                        <i className="fa-solid fa-briefcase text-primary opacity-75"></i>
                        <span>{isRTL ? "المسمى التقني / المنصب" : "Job Title / Designation"}</span>
                      </label>
                      <input 
                        type="text" 
                        className="form-control form-control-sm rounded-3 border py-2 px-3 shadow-xs fw-medium text-dark bg-white" 
                        placeholder={isRTL ? "مثال: مطور باك أند..." : "e.g. Lead Engineer"}
                        value={formData.job_title}
                        onChange={e => setFormData({...formData, job_title: e.target.value})}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* ── GUARANTEED SIDE-BY-SIDE ROW 3: Select Access Role (All 4 Buttons strictly in ONE ROW) ── */}
                  <div className="mb-3 bg-white p-3 rounded-3 border shadow-xs w-100">
                    <label className="form-label small fw-bold text-dark mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: "0.83rem" }}>
                      <span className="d-flex align-items-center" style={{ gap: "8px" }}>
                        <i className="fa-solid fa-user-shield text-warning"></i>
                        <span>{isRTL ? "تحديد الصلاحية والدور البرمجي (Select Role)" : "Select Access Role"}</span>
                      </span>
                      <span className="badge bg-primary-subtle text-primary fw-medium px-2 py-1" style={{ fontSize: "0.75rem" }}>{formData.role}</span>
                    </label>

                    <div className="d-flex flex-row align-items-stretch justify-content-between w-100" style={{ gap: "10px" }}>
                      {roleOptions.map((opt) => {
                        const isSelected = formData.role === opt.id || (formData.role.toLowerCase() === opt.id.toLowerCase());
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData({...formData, role: opt.id})}
                            className={`rounded-3 py-2 px-2 border d-flex align-items-center justify-content-center transition-all shadow-none ${isSelected ? "fw-bold shadow-sm" : "fw-medium opacity-75 bg-light border-light-subtle"}`}
                            style={{
                              flex: "1 1 50%",
                              width: "50%",
                              minWidth: "0",
                              backgroundColor: isSelected ? opt.bg : "#f8fafc",
                              color: isSelected ? opt.color : "#475569",
                              borderColor: isSelected ? opt.border : "#e2e8f0",
                              fontSize: "0.82rem",
                              minHeight: "42px",
                              gap: "8px"
                            }}
                          >
                            <i className={`fa-solid ${opt.icon}`} style={{ color: isSelected ? opt.color : "#64748b" }}></i>
                            <span className="text-nowrap text-truncate">{isRTL ? opt.labelAr : opt.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── GUARANTEED SIDE-BY-SIDE ROW 4: Password & Status (in Edit Mode) ── */}
                  <div className="d-flex flex-row align-items-start justify-content-between w-100" style={{ gap: "16px", marginBottom: "16px" }}>
                    
                    {/* Password Input */}
                    <div style={{ flex: selectedUser ? "1 1 50%" : "1 1 100%", width: selectedUser ? "50%" : "100%", minWidth: "0" }}>
                      <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: "0.83rem" }}>
                        <span className="d-flex align-items-center" style={{ gap: "8px" }}>
                          <i className="fa-solid fa-lock text-danger opacity-75"></i>
                          <span>{isRTL ? "كلمة المرور المشفرة" : "Password"}</span>
                        </span>
                        {selectedUser && <span className="text-primary fw-normal" style={{ fontSize: "0.74rem" }}>{isRTL ? "(فارغة بدون تغيير)" : "(Leave blank)"}</span>}
                      </label>
                      <div className="input-group input-group-sm rounded-3 shadow-xs border overflow-hidden bg-white w-100">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control form-control-sm border-0 py-2 px-3 shadow-none fw-medium text-dark" 
                          required={!selectedUser && !isFallback}
                          placeholder={selectedUser ? (isRTL ? "•••••••• (بدون تعديل)" : "•••••••• (Unchanged)") : "••••••••"}
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button type="button" className="btn bg-light border-0 text-muted px-3 shadow-none" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} title="Toggle">
                          <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Account Status - STRICTLY VISIBLE IN UPDATE (EDIT) MODE ONLY */}
                    {selectedUser && (
                      <div style={{ flex: "1 1 50%", width: "50%", minWidth: "0" }}>
                        <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                          <i className="fa-solid fa-toggle-on text-success opacity-75"></i>
                          <span>{isRTL ? "حالة الحساب (Account Status)" : "Account Status"}</span>
                        </label>
                        <div className="d-flex align-items-center bg-white p-1 rounded-3 border shadow-xs w-100" style={{ gap: "4px" }}>
                          {[
                            { val: "active", labelAr: "نشط 🟢", labelEn: "Active 🟢", bg: "#d1fae5", text: "#065f46" },
                            { val: "pending", labelAr: "مراجعة 🟡", labelEn: "Pending 🟡", bg: "#fef3c7", text: "#92400e" },
                            { val: "suspended", labelAr: "معلق 🔴", labelEn: "Suspended 🔴", bg: "#fee2e2", text: "#991b1b" },
                          ].map(opt => {
                            const active = formData.status === opt.val;
                            return (
                              <button
                                key={opt.val}
                                type="button"
                                className="btn btn-sm rounded-2 flex-grow-1 border-0 fw-bold py-1.5 transition-all text-nowrap d-flex align-items-center justify-content-center"
                                onClick={() => setFormData({...formData, status: opt.val})}
                                style={{
                                  backgroundColor: active ? opt.bg : "transparent",
                                  color: active ? opt.text : "#64748b",
                                  fontSize: "0.78rem",
                                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                                }}
                              >
                                <span>{isRTL ? opt.labelAr : opt.labelEn}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── GUARANTEED TALL ROW 5: Supervisor Notes (Extending downward in BOTH Add and Edit modes) ── */}
                  <div className="w-100 mb-2">
                    <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center" style={{ fontSize: "0.83rem", gap: "8px" }}>
                      <i className="fa-solid fa-file-lines text-secondary opacity-75"></i>
                      <span>{isRTL ? "ملاحظات الإشراف الداخلي (تفصيلية)" : "Supervisor Notes"}</span>
                    </label>
                    <textarea 
                      className="form-control rounded-3 border py-2.5 px-3 shadow-xs fw-medium text-dark bg-white w-100" 
                      rows={4}
                      placeholder={isRTL ? "أضف أي ملاحظات أو تعليمات وتوصيفات تفصيلية حول صلاحيات ونطاق أعمال هذا المسؤول..." : "Enter comprehensive notes or domain assignments regarding this administrator profile..."}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      style={{ minHeight: "110px", resize: "vertical", fontSize: "0.88rem", lineHeight: "1.6" }}
                    />
                  </div>

                  {/* Compact Action Footer */}
                  <div className="d-flex align-items-center justify-content-end pt-3 border-top border-light mt-4" style={{ gap: "12px" }}>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-light rounded-pill px-4 py-2 fw-bold text-muted border shadow-xs cancel-btn d-flex align-items-center" 
                      onClick={() => setShowModal(false)} 
                      disabled={submitting}
                      style={{ fontSize: "0.86rem", gap: "8px" }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                      <span>{isRTL ? "إلغاء التعديل" : "Cancel"}</span>
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-sm btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm border-0 d-flex align-items-center justify-content-center save-btn" 
                      style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", fontSize: "0.88rem", minWidth: "170px", gap: "8px" }} 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>{isRTL ? "جاري الحفظ..." : "Saving..."}</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i>
                          <span>{selectedUser ? (isRTL ? "حفظ التحديثات" : "Update Account") : (isRTL ? "تأكيد وإضافة المسؤول" : "Create Account")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .smaller { font-size: 0.75rem; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .modal-glass-backdrop {
          background-color: rgba(15, 23, 42, 0.7) !important;
          backdrop-filter: blur(6px);
        }
        .admin-modal {
          transform: none !important;
          animation: modalScaleFast 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalScaleFast {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .cancel-btn:hover {
          background-color: #e2e8f0 !important;
          color: #1e293b !important;
        }
        .clear-draft-btn:hover {
          background-color: #fee2e2 !important;
          border-color: #f87171 !important;
          transform: translateY(-1px);
        }
        .save-btn:hover {
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
          opacity: 0.96;
        }
        .form-control:focus, .btn:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default UsersPage;
