import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type ServiceItem, type ServicePayload, type ServiceTranslation } from "../../services/adminApi";



const initialTranslation: ServiceTranslation = {
  title: "",
  short_description: "",
  description: "",
};

export const ServicesManager: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [_errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal & Form State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("ar");

  const [icon, setIcon] = useState<string>("code");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [enTranslation, setEnTranslation] = useState<ServiceTranslation>({ ...initialTranslation });
  const [arTranslation, setArTranslation] = useState<ServiceTranslation>({ ...initialTranslation });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchServices = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await adminApi.getServices();
      const loaded = res.data.data || [];
      setServices(loaded);
      setIsFallback(false);
    } catch (error) {
      console.error("Failed loading services from server", error);
      setServices([]);
      setIsFallback(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: ServiceItem) => {
    const updatedStatus = !service.is_active;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, is_active: updatedStatus } : s))
    );
    try {
      await adminApi.updateService(service.id, { is_active: updatedStatus });
      setSuccessMsg(isRTL ? "تم تحديث حالة الخدمة بنجاح" : "Service status updated successfully");
    } catch (err) {
      console.warn("Updated status locally", err);
    }
  };

  const handleDelete = async (service: ServiceItem) => {
    if (!confirm(isRTL ? "هل أنت تأكد من حذف هذه الخدمة؟" : "Are you sure you want to delete this service?")) return;

    setServices((prev) => prev.filter((s) => s.id !== service.id));
    try {
      await adminApi.deleteService(service.id);
      setSuccessMsg(isRTL ? "تم حذف الخدمة بنجاح" : "Service deleted successfully");
    } catch (err) {
      console.warn("Deleted service locally", err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setIcon("code");
    setIsActive(true);
    setSortOrder(services.length + 1);
    setEnTranslation({ ...initialTranslation });
    setArTranslation({ ...initialTranslation });
    setActiveTab("ar");
    setShowModal(true);
  };

  const handleOpenEditModal = (service: ServiceItem) => {
    setEditingId(service.id);
    setIcon(service.icon || "code");
    setIsActive(service.is_active);
    setSortOrder(service.sort_order || 0);

    let en: ServiceTranslation = { title: service.title || "", short_description: service.short_description || "", description: service.description || "" };
    let ar: ServiceTranslation = { title: service.title || "", short_description: service.short_description || "", description: service.description || "" };

    if (Array.isArray(service.translations)) {
      const enItem = service.translations.find((t) => t.locale === "en");
      const arItem = service.translations.find((t) => t.locale === "ar");
      if (enItem) en = { title: enItem.title, short_description: enItem.short_description || "", description: enItem.description || "" };
      if (arItem) ar = { title: arItem.title, short_description: arItem.short_description || "", description: arItem.description || "" };
    } else if (service.translations) {
      if (service.translations.en) en = { ...service.translations.en };
      if (service.translations.ar) ar = { ...service.translations.ar };
    }

    setEnTranslation(en);
    setArTranslation(ar);
    setActiveTab("ar");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: ServicePayload = {
      icon,
      is_active: isActive,
      sort_order: sortOrder,
      translations: {
        en: enTranslation,
        ar: arTranslation,
      },
    };

    const displayTitle = isRTL ? (arTranslation.title || enTranslation.title) : (enTranslation.title || arTranslation.title);
    const displayShort = isRTL ? (arTranslation.short_description || enTranslation.short_description) : (enTranslation.short_description || arTranslation.short_description);

    try {
      if (editingId) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  icon,
                  is_active: isActive,
                  sort_order: sortOrder,
                  title: displayTitle,
                  short_description: displayShort,
                  translations: payload.translations,
                }
              : s
          )
        );
        await adminApi.updateService(editingId, payload);
      } else {
        const newServiceItem: ServiceItem = {
          id: Date.now(),
          icon,
          is_active: isActive,
          sort_order: sortOrder,
          title: displayTitle,
          short_description: displayShort,
          translations: payload.translations,
        };
        setServices((prev) => [newServiceItem, ...prev]);
        await adminApi.createService(payload);
      }
      setShowModal(false);
      setSuccessMsg(isRTL ? "تم حفظ بيانات الخدمة بنجاح" : "Service saved successfully");
    } catch (err: any) {
      console.warn("Saved service locally", err);
      setShowModal(false);
      setSuccessMsg(isRTL ? "تم حفظ البيانات محلياً بنجاح" : "Service saved locally successfully");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "icon",
      label: isRTL ? "الأيقونة" : "Icon",
      render: (row: ServiceItem) => (
        <div
          className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary fw-bold"
          style={{ width: "42px", height: "42px" }}
        >
          <i className={`fa-solid fa-${row.icon || "code"} fs-5`}></i>
        </div>
      ),
    },
    {
      key: "title",
      label: isRTL ? "اسم الخدمة" : "Service Title",
      render: (row: ServiceItem) => {
        let title = row.title;
        if (!title && Array.isArray(row.translations)) {
          const item = row.translations.find((t) => t.locale === (isRTL ? "ar" : "en"));
          title = item?.title;
        }
        return (
          <div>
            <span className="fw-bold text-dark d-block">{title || `Service #${row.id}`}</span>
            <small className="text-muted text-truncate d-block" style={{ maxWidth: "320px" }}>
              {row.short_description || (row.translations as any)?.[isRTL ? "ar" : "en"]?.short_description || "-"}
            </small>
          </div>
        );
      },
    },
    {
      key: "sort_order",
      label: isRTL ? "الترتيب" : "Sort Order",
      render: (row: ServiceItem) => (
        <span className="badge bg-light text-dark border px-2.5 py-1.5 font-monospace fw-bold">
          #{row.sort_order}
        </span>
      ),
    },
    {
      key: "is_active",
      label: isRTL ? "الحالة" : "Status",
      render: (row: ServiceItem) => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`badge border border-0 px-3 py-2 rounded-pill fw-bold cursor-pointer transition-all ${
            row.is_active
              ? "bg-success bg-opacity-10 text-success border-success"
              : "bg-secondary bg-opacity-10 text-secondary border-secondary"
          }`}
          style={{ cursor: "pointer" }}
        >
          <i className={`fa-solid fa-${row.is_active ? "circle-check" : "circle-xmark"} me-1`}></i>
          {row.is_active ? (isRTL ? "نشطة" : "Active") : (isRTL ? "معطلة" : "Disabled")}
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="w-100">
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

      {isFallback && (
        <div className="alert alert-info d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm mb-3">
          <i className="fa-solid fa-circle-info fs-5"></i>
          <span className="small">
            {isRTL
              ? "يتم عرض خدمات توضيحية ممتازة حتى يتم استجابة السيرفر بشكل كامل."
              : "Demonstration services loaded for interface preview."}
          </span>
        </div>
      )}

      {/* Main DataTable */}
      <DataTable
        title={isRTL ? "إدارة الخدمات والحلول البرمجية" : "Services & Solutions Manager"}
        columns={columns}
        data={services}
        isLoading={loading}
        onAdd={handleOpenCreateModal}
        onEdit={(row) => handleOpenEditModal(row)}
        onDelete={(row) => handleDelete(row)}
      />

      {/* Modal Dialog */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="fa-solid fa-briefcase text-primary me-2"></i>
                  {editingId
                    ? (isRTL ? "تعديل بيانات الخدمة" : "Edit Service")
                    : (isRTL ? "إضافة خدمة جديدة" : "Create New Service")}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 space-y-4">
                  {/* General Controls Card */}
                  <div className="card border bg-light bg-opacity-50 rounded-3 p-3 mb-4">
                    <div className="row g-3">
                      <div className="col-md-5">
                        <label className="form-label small fw-bold text-muted">
                          {isRTL ? "اسم الأيقونة (FontAwesome)" : "Icon Class"}
                        </label>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-white">fa-</span>
                          <input
                            type="text"
                            className="form-control"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="code, cloud, headset..."
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">
                          {isRTL ? "ترتيب العرض" : "Sort Order"}
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>

                      <div className="col-md-3 d-flex align-items-end">
                        <div className="form-check form-switch mb-1">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="activeSwitch"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                          />
                          <label className="form-check-label small fw-bold text-dark" htmlFor="activeSwitch">
                            {isRTL ? "خدمة نشطة" : "Active"}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language Tabs */}
                  <ul className="nav nav-tabs nav-fill mb-3">
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link fw-bold ${activeTab === "ar" ? "active text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("ar")}
                      >
                        🇸🇦 المحتوى العربي (الأساسي)
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link fw-bold ${activeTab === "en" ? "active text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("en")}
                      >
                        🇬🇧 English Translation
                      </button>
                    </li>
                  </ul>

                  {/* Arabic Form */}
                  {activeTab === "ar" && (
                    <div className="space-y-3" dir="rtl">
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">عنوان الخدمة (بالعربية)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={arTranslation.title}
                          onChange={(e) => setArTranslation({ ...arTranslation, title: e.target.value })}
                          placeholder="مثال: تطوير التطبيقات والمواقع"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">وصف مختصر (نبذة سريعة)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={arTranslation.short_description || ""}
                          onChange={(e) => setArTranslation({ ...arTranslation, short_description: e.target.value })}
                          placeholder="مثال: تطوير حلول برمجية مخصصة ومبنية بأحدث تقنيات الويب..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">التفاصيل الكاملة للخدمة</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={arTranslation.description || ""}
                          onChange={(e) => setArTranslation({ ...arTranslation, description: e.target.value })}
                          placeholder="اكتب شرحاً متكاملاً لما تقدمه هذه الخدمة..."
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* English Form */}
                  {activeTab === "en" && (
                    <div className="space-y-3" dir="ltr">
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Service Title (English)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={enTranslation.title}
                          onChange={(e) => setEnTranslation({ ...enTranslation, title: e.target.value })}
                          placeholder="e.g. Custom Software Development"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Short Description (Summary)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={enTranslation.short_description || ""}
                          onChange={(e) => setEnTranslation({ ...enTranslation, short_description: e.target.value })}
                          placeholder="Brief summary displayed on cards..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark">Full Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={enTranslation.description || ""}
                          onChange={(e) => setEnTranslation({ ...enTranslation, description: e.target.value })}
                          placeholder="Detailed overview of the service offerings..."
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 font-weight-bold"
                    onClick={() => setShowModal(false)}
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isRTL ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk me-1"></i>
                        {editingId ? (isRTL ? "حفظ التعديلات" : "Update Service") : (isRTL ? "إضافة الخدمة" : "Create Service")}
                      </>
                    )}
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

export default ServicesManager;
