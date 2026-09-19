import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type ContactLead } from "../../services/adminApi";



const MessagesPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const [consultations, setConsultations] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactLead | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getContacts({ per_page: 100 });
      const loaded: ContactLead[] = (res.data.data || []).map((c: any) => ({
        ...c,
        full_name: c.full_name || c.name || "—",
      }));
      setConsultations(loaded);
      setIsFallback(false);
    } catch (error) {
      console.error("Failed fetching contacts from server", error);
      setConsultations([]);
      setIsFallback(false);
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

  useEffect(() => { fetchConsultations(); }, []);

  const handleStatusChange = async (contactId: number, newStatus: string) => {
    setUpdatingId(contactId);
    setConsultations((prev) => prev.map((c) => c.id === contactId ? { ...c, status: newStatus, is_read: newStatus !== "new" } : c));
    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) => prev ? { ...prev, status: newStatus, is_read: newStatus !== "new" } : null);
    }
    try {
      await adminApi.updateContactStatus(contactId, newStatus);
      setSuccessMsg(isRTL ? "تم تحديث حالة طلب الاستشارة بنجاح ✅" : "Consultation status updated successfully ✅");
    }
    catch (e) { console.warn("Status update fallback (local only):", e); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (contact: ContactLead) => {
    const confirmMsg = isRTL
      ? `هل أنت متأكد من حذف استشارة "${contact.full_name}"؟`
      : `Delete consultation from "${contact.full_name}"?`;
    if (!window.confirm(confirmMsg)) return;
    setConsultations((prev) => prev.filter((c) => c.id !== contact.id));
    if (selectedContact?.id === contact.id) setSelectedContact(null);
    if (!isFallback) {
      try { await adminApi.deleteContact(contact.id); } catch (e) { console.warn("Delete fallback:", e); }
    }
  };

  const handleView = (contact: ContactLead) => {
    setSelectedContact(contact);
    if (contact.status === "new" && !contact.is_read) handleStatusChange(contact.id, "in_progress");
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: string; label: string; labelAr: string }> = {
      new: { bg: "rgba(234,179,8,0.12)", text: "#b45309", icon: "fa-circle-exclamation", label: "New", labelAr: "جديدة" },
      in_progress: { bg: "rgba(59,130,246,0.12)", text: "#1d4ed8", icon: "fa-circle-half-stroke", label: "In Progress", labelAr: "قيد المعالجة" },
      closed: { bg: "rgba(16,185,129,0.12)", text: "#047857", icon: "fa-circle-check", label: "Completed", labelAr: "مكتملة" },
      spam: { bg: "rgba(239,68,68,0.12)", text: "#b91c1c", icon: "fa-circle-xmark", label: "Spam", labelAr: "بريد مزعج" },
    };
    return configs[status] || { bg: "#f3f4f6", text: "#374151", icon: "fa-circle", label: status, labelAr: status };
  };

  const newCount = consultations.filter((c) => c.status === "new").length;
  const inProgressCount = consultations.filter((c) => c.status === "in_progress").length;
  const closedCount = consultations.filter((c) => c.status === "closed").length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString(isRTL ? "ar-EG" : "en-GB", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return dateStr; }
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    new: { ar: "جديدة", en: "New" },
    in_progress: { ar: "معالجة", en: "Processing" },
    closed: { ar: "أغلق", en: "Close" },
    spam: { ar: "بريد مزعج", en: "Spam" },
  };

  const columns = [
    {
      key: "full_name",
      label: isRTL ? "مقدم الاستشارة" : "Requester",
      render: (row: ContactLead) => (
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-4 d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
            style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#0d83fd,#0057e4)", color: "#fff", fontSize: "1rem" }}>
            {(row.full_name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="fw-bold text-dark d-flex align-items-center gap-2">
              {row.full_name || "—"}
              {(row.status === "new" || row.is_new) && (
                <span className="badge rounded-circle p-1" style={{ backgroundColor: "#ef4444", width: 8, height: 8 }} />
              )}
            </div>
            <div className="text-muted small d-flex align-items-center gap-1 mt-1">
              <i className="fa-regular fa-envelope opacity-75" /><span>{row.email}</span>
            </div>
            {row.phone && (
              <div className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: "0.78rem" }}>
                <i className="fa-solid fa-phone-flip text-primary opacity-75" /><span className="fw-medium">{row.phone}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: isRTL ? "موضوع الاستشارة" : "Subject",
      render: (row: ContactLead) => (
        <div>
          <div className="fw-semibold text-dark small">{row.subject || (isRTL ? "استشارة عامة" : "General Inquiry")}</div>
          {row.message && (
            <div className="text-muted mt-1" style={{ fontSize: "0.78rem", maxWidth: "280px" }}>
              {row.message.length > 70 ? row.message.substring(0, 70) + "..." : row.message}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      label: isRTL ? "تاريخ الطلب" : "Date",
      render: (row: ContactLead) => <div className="text-muted small fw-medium font-monospace">{formatDate(row.created_at)}</div>,
    },
    {
      key: "status",
      label: isRTL ? "الحالة" : "Status",
      render: (row: ContactLead) => {
        const cfg = getStatusConfig(row.status);
        return (
          <span className="badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1"
            style={{ backgroundColor: cfg.bg, color: cfg.text, fontSize: "0.8rem" }}>
            <i className={`fa-solid ${cfg.icon}`} style={{ fontSize: "0.7rem" }} />
            {isRTL ? cfg.labelAr : cfg.label}
          </span>
        );
      },
    },
    {
      key: "status_action",
      label: isRTL ? "تغيير الحالة" : "Change Status",
      render: (row: ContactLead) => {
        const statusOptions = [
          { value: "new", ar: "جديدة", en: "New" },
          { value: "in_progress", ar: "قيد المعالجة", en: "In Progress" },
          { value: "closed", ar: "مغلقة", en: "Closed" },
          { value: "spam", ar: "بريد مزعج", en: "Spam" },
        ];
        const cfg = getStatusConfig(row.status);
        return (
          <div className="position-relative" style={{ minWidth: "130px" }}>
            <select
              value={row.status}
              disabled={updatingId === row.id}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="form-select form-select-sm fw-semibold rounded-3 border-0 pe-4"
              style={{
                backgroundColor: cfg.bg,
                color: cfg.text,
                fontSize: "0.78rem",
                paddingRight: "2rem",
                paddingLeft: "0.6rem",
                cursor: "pointer",
                boxShadow: "none",
                outline: "none",
                appearance: "auto",
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {isRTL ? opt.ar : opt.en}
                </option>
              ))}
            </select>
            {updatingId === row.id && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <span className="spinner-border spinner-border-sm text-primary" style={{ width: "12px", height: "12px" }} />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
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
      <div className="mb-4 d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
            style={{ width: "44px", height: "44px", background: "linear-gradient(135deg,#0d83fd,#0057e4)" }}>
            <i className="fa-solid fa-clipboard-list text-white fs-5" />
          </div>
          <div>
            <h4 className="fw-bold text-dark mb-0">{isRTL ? "إدارة الاستشارات والحجوزات" : "Consultations & Bookings"}</h4>
            <p className="text-muted small mb-0 mt-1">
              {isRTL ? "جميع طلبات الاستشارة والتواصل الواردة من الموقع" : "All incoming consultation requests from the website"}
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isFallback && (
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill small fw-bold">
              <i className="fa-solid fa-triangle-exclamation me-1" />
              {isRTL ? "وضع تجريبي" : "Demo Mode"}
            </span>
          )}
          <button onClick={fetchConsultations} className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2 fw-bold shadow-sm">
            <i className="fa-solid fa-rotate-right" /><span>{isRTL ? "تحديث" : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards — side by side in a single horizontal row (جنب بعض تماماً بدون نزول لسبر تحتاني) */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))", 
          gap: "1rem", 
          marginBottom: "1.5rem" 
        }}
      >
        {[
          { label: isRTL ? "إجمالي الاستشارات" : "Total", value: consultations.length, icon: "fa-clipboard-list", color: "#475569", bg: "rgba(241,245,249,0.95)", border: "#cbd5e1" },
          { label: isRTL ? "استشارات جديدة" : "New Requests", value: newCount, icon: "fa-circle-exclamation", color: "#d97706", bg: "rgba(254,243,199,0.9)", border: "#fde68a" },
          { label: isRTL ? "قيد المعالجة" : "In Progress", value: inProgressCount, icon: "fa-circle-half-stroke", color: "#2563eb", bg: "rgba(239,246,255,0.9)", border: "#bfdbfe" },
          { label: isRTL ? "مكتملة ومغلقة" : "Completed", value: closedCount, icon: "fa-circle-check", color: "#059669", bg: "rgba(236,253,245,0.9)", border: "#a7f3d0" },
        ].map((stat, i) => (
          <div
            key={i}
            className="card border-0 shadow-sm h-100 transition-all"
            style={{ 
              backgroundColor: stat.bg, 
              border: `1px solid ${stat.border}`,
              borderRadius: "16px",
              overflow: "hidden"
            }}
          >
            <div className="card-body py-3 px-3 d-flex align-items-center justify-content-start gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                style={{ width: "44px", height: "44px", backgroundColor: "#ffffff", border: `1px solid ${stat.border}` }}
              >
                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: "1.15rem" }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="fw-black text-dark mb-1" style={{ fontSize: "1.35rem", lineHeight: 1 }}>{stat.value}</div>
                <div className="text-muted fw-bold text-truncate d-block" style={{ fontSize: "0.82rem" }} title={stat.label}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        title={isRTL ? "قائمة الاستشارات الواردة" : "Incoming Consultations List"}
        columns={columns}
        data={consultations}
        isLoading={loading}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Premium Consultation Details Modal */}
      {selectedContact && (
        <div 
          className="modal fade show d-flex align-items-center justify-content-center p-3"
          tabIndex={-1}
          style={{ 
            backgroundColor: "rgba(10, 14, 30, 0.75)", 
            backdropFilter: "blur(6px)", 
            zIndex: 1055,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflowY: "auto"
          }}
          onClick={(e) => { 
            // Close modal when clicking outside on the empty space
            if (e.target === e.currentTarget) {
              setSelectedContact(null); 
            }
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered w-100 m-0" 
            style={{ maxWidth: "760px", pointerEvents: "none", transition: "all 0.3s ease" }}
          >
            <div 
              className="modal-content border-0 shadow-lg w-100 overflow-hidden" 
              style={{ borderRadius: "22px", pointerEvents: "auto", maxHeight: "90vh", display: "flex", flexDirection: "column", background: "#ffffff" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Luxury Modal Header */}
              <div 
                className="modal-header border-0 px-4 pt-4 pb-3 d-flex align-items-center justify-content-between w-100"
                style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)", direction: isRTL ? "rtl" : "ltr" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center fw-black shadow-sm flex-shrink-0 text-white"
                    style={{ 
                      width: "52px", 
                      height: "52px", 
                      fontSize: "1.4rem", 
                      background: "linear-gradient(135deg,#0d83fd,#004cce)",
                      borderRadius: "16px"
                    }}
                  >
                    {(selectedContact.full_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-1" style={{ fontSize: "1.25rem" }}>
                      {selectedContact.full_name || (isRTL ? "عميل بدون اسم" : "Unnamed Client")}
                    </h5>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="fa-regular fa-calendar-days text-primary opacity-75" />
                      <span className="fw-semibold" style={{ fontSize: "0.83rem" }}>{formatDate(selectedContact.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* X Close Button strictly at extreme opposite edge */}
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="d-flex align-items-center justify-content-center border-0 rounded-circle transition-all m-0 shadow-sm"
                  style={{ 
                    width: "38px", 
                    height: "38px", 
                    background: "#ffffff", 
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer", 
                    flexShrink: 0 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#ef4444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                  title={isRTL ? "إغلاق النافذة" : "Close"}
                >
                  <i className="fa-solid fa-xmark" style={{ fontSize: "1rem" }} />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div 
                className="modal-body p-4" 
                style={{ 
                  background: "#fafbff", 
                  overflowY: "auto", 
                  maxHeight: "calc(90vh - 150px)", 
                  flex: "1 1 auto",
                  direction: isRTL ? "rtl" : "ltr"
                }}
              >
                <div className="row g-3 mb-4">
                  {/* Email Card */}
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-4 border bg-white h-100 shadow-sm d-flex flex-column justify-content-between" style={{ borderColor: "#f1f5f9" }}>
                      <span className="text-muted small fw-bold d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.8rem" }}>
                        <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "26px", height: "26px", background: "#eff6ff", color: "#2563eb" }}>
                          <i className="fa-solid fa-envelope" style={{ fontSize: "0.75rem" }} />
                        </div>
                        <span>{isRTL ? "البريد الإلكتروني للعميل" : "Email Address"}</span>
                      </span>
                      <a href={`mailto:${selectedContact.email}`} className="fw-bold text-dark text-decoration-none text-break m-0 d-block" style={{ fontSize: "0.95rem", direction: "ltr", textAlign: isRTL ? "right" : "left" }}>
                        {selectedContact.email || "-"}
                      </a>
                    </div>
                  </div>

                  {/* Phone Card */}
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-4 border bg-white h-100 shadow-sm d-flex flex-column justify-content-between" style={{ borderColor: "#f1f5f9" }}>
                      <span className="text-muted small fw-bold d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.8rem" }}>
                        <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "26px", height: "26px", background: "#f0fdf4", color: "#16a34a" }}>
                          <i className="fa-solid fa-phone" style={{ fontSize: "0.75rem" }} />
                        </div>
                        <span>{isRTL ? "رقم هاتف التواصل" : "Phone Number"}</span>
                      </span>
                      {selectedContact.phone ? (
                        <a href={`tel:${selectedContact.phone}`} className="fw-bold text-dark text-decoration-none text-break m-0 d-block font-monospace" style={{ fontSize: "0.98rem", direction: "ltr", textAlign: isRTL ? "right" : "left" }}>
                          {selectedContact.phone}
                        </a>
                      ) : (
                        <span className="badge rounded-pill align-self-start fw-medium px-3 py-1" style={{ backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.78rem" }}>
                          {isRTL ? "لم يتم إدخال رقم هاتف" : "Not provided"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subject */}
                {selectedContact.subject && (
                  <div className="mb-4">
                    <span className="text-muted small fw-bold d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.83rem" }}>
                      <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "26px", height: "26px", background: "#fef3c7", color: "#d97706" }}>
                        <i className="fa-solid fa-heading" style={{ fontSize: "0.75rem" }} />
                      </div>
                      <span>{isRTL ? "موضوع الاستشارة أو الحجز" : "Consultation Subject"}</span>
                    </span>
                    <div className="p-3 rounded-4 border bg-white shadow-sm fw-bold text-dark" style={{ borderColor: "#f1f5f9", fontSize: "1.05rem" }}>
                      {selectedContact.subject}
                    </div>
                  </div>
                )}

                {/* Message / Request Details */}
                <div className="mb-4">
                  <span className="text-muted small fw-bold d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.83rem" }}>
                    <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "26px", height: "26px", background: "#f3e8ff", color: "#9333ea" }}>
                      <i className="fa-solid fa-file-lines" style={{ fontSize: "0.75rem" }} />
                    </div>
                    <span>{isRTL ? "تفاصيل الطلب والرسالة الواردة" : "Message / Request Details"}</span>
                  </span>
                  <div 
                    className="p-4 rounded-4 shadow-sm bg-white border"
                    style={{ 
                      minHeight: "120px", 
                      fontSize: "1rem", 
                      lineHeight: "1.8", 
                      whiteSpace: "pre-wrap", 
                      color: "#1e293b",
                      borderColor: "#e2e8f0",
                      direction: /^[A-Za-z0-9\s.,?!'"@#$%^&*()-_+=~`<>:[\]{}|\\]+$/.test((selectedContact.message || "").trim()) ? "ltr" : "inherit",
                      textAlign: /^[A-Za-z0-9\s.,?!'"@#$%^&*()-_+=~`<>:[\]{}|\\]+$/.test((selectedContact.message || "").trim()) ? "left" : "inherit"
                    }}
                  >
                    {selectedContact.message || (isRTL ? "لا توجد تفاصيل إضافية مسجلة مع هذا الطلب." : "No details provided in this request.")}
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="p-3 rounded-4 border bg-white shadow-sm" style={{ borderColor: "#f1f5f9" }}>
                  <span className="small fw-bold text-dark d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.85rem" }}>
                    <i className="fa-solid fa-sliders text-primary fs-6" />
                    <span>{isRTL ? "تغيير أو تحديث حالة هذه الاستشارة:" : "Update Consultation Status:"}</span>
                  </span>
                  <div className="d-flex gap-2 flex-wrap">
                    {(["new", "in_progress", "closed", "spam"] as const).map((s) => {
                      const cfg = getStatusConfig(s);
                      const isActive = selectedContact.status === s;
                      return (
                        <button 
                          key={s} 
                          type="button" 
                          onClick={() => handleStatusChange(selectedContact.id, s)} 
                          disabled={isActive}
                          className="btn btn-sm rounded-pill px-3 py-2 fw-bold border d-flex align-items-center gap-2 shadow-sm transition-all"
                          style={{ 
                            backgroundColor: isActive ? cfg.bg : "#f8fafc", 
                            color: isActive ? cfg.text : "#64748b", 
                            borderColor: isActive ? cfg.text : "#e2e8f0",
                            opacity: isActive ? 1 : 0.8,
                            boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.06)" : "none"
                          }}
                        >
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: "20px", height: "20px", background: isActive ? cfg.text : "#cbd5e1", color: "#ffffff" }}
                          >
                            <i className={`fa-solid ${cfg.icon}`} style={{ fontSize: "0.65rem" }} />
                          </div>
                          <span style={{ fontSize: "0.83rem" }}>{isRTL ? statusLabels[s].ar : statusLabels[s].en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Modal Footer (Never cut off) */}
              <div 
                className="modal-footer border-0 px-4 py-3 d-flex align-items-center justify-content-between w-100"
                style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", direction: isRTL ? "rtl" : "ltr", flexShrink: 0 }}
              >
                <button 
                  type="button" 
                  onClick={() => {
                    const toDelete = selectedContact;
                    setSelectedContact(null);
                    handleDelete(toDelete);
                  }}
                  className="btn btn-outline-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-bold shadow-sm"
                  style={{ fontSize: "0.88rem" }}
                >
                  <i className="fa-solid fa-trash-can" />
                  <span>{isRTL ? "حذف الاستشارة نهائياً" : "Delete Permanently"}</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                  style={{ fontSize: "0.88rem", background: "linear-gradient(135deg,#0d83fd,#004cce)", border: 0 }}
                  onClick={() => setSelectedContact(null)}
                >
                  <i className="fa-solid fa-check" />
                  <span>{isRTL ? "إغلاق النافذة" : "Close"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
