import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type BlogPostItem, type BlogPostPayload, type BlogPostTranslation } from "../../services/adminApi";

const defaultDemoBlogPosts: BlogPostItem[] = [
  {
    id: 1,
    is_published: true,
    is_featured: true,
    published_at: "2026-07-20",
    title: "مستقبل الذكاء الاصطناعي في حلول البرمجيات وتطوير الويب 2026",
    excerpt: "كيف تساهم تقنيات الـ AI الحديثة في تسريع بناء تطبيقات السحاب وزيادة الكفاءة التشغيلية.",
    body: "يعتبر الذكاء الاصطناعي ركيزة أساسية في التحول الرقمي الحديث لجميع المؤسسات والشركات الناشئة...",
    translations: {
      en: { title: "The Future of AI in Software Solutions & Web 2026", excerpt: "How modern AI speeds up cloud app development and operational efficiency.", body: "Artificial Intelligence has become a core pillar of modern digital transformation..." },
      ar: { title: "مستقبل الذكاء الاصطناعي في حلول البرمجيات وتطوير الويب 2026", excerpt: "كيف تساهم تقنيات الـ AI الحديثة في تسريع بناء تطبيقات السحاب وزيادة الكفاءة التشغيلية.", body: "يعتبر الذكاء الاصطناعي ركيزة أساسية في التحول الرقمي الحديث..." }
    }
  },
  {
    id: 2,
    is_published: true,
    is_featured: false,
    published_at: "2026-07-22",
    title: "أفضل الممارسات لتأمين بيانات البرمجيات وقواعد البيانات السحابية",
    excerpt: "استراتيجيات التشفير المتقدم وإدارة الصلاحيات لحماية بيانات عملائك ضد الهجمات السيبرانية.",
    body: "تأمين البيانات الحساسة يتطلب خطط تشفير وتحديد صلاحيات صارمة مع نسخ احتياطي مستمر...",
    translations: {
      en: { title: "Best Practices for Securing Cloud Software & Databases", excerpt: "Encryption strategies and permission management to protect corporate data.", body: "Securing sensitive data requires robust encryption and permission control..." },
      ar: { title: "أفضل الممارسات لتأمين بيانات البرمجيات وقواعد البيانات السحابية", excerpt: "استراتيجيات التشفير المتقدم وإدارة الصلاحيات لحماية بيانات عملائك.", body: "تأمين البيانات الحساسة يتطلب خطط تشفير..." }
    }
  }
];

const initialTranslation: BlogPostTranslation = {
  title: "",
  excerpt: "",
  body: "",
};

export const BlogManager: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("ar");

  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [enTranslation, setEnTranslation] = useState<BlogPostTranslation>({ ...initialTranslation });
  const [arTranslation, setArTranslation] = useState<BlogPostTranslation>({ ...initialTranslation });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBlogPosts();
      const loaded = res.data.data || [];
      if (loaded.length > 0) {
        setPosts(loaded);
        setIsFallback(false);
      } else {
        setPosts(defaultDemoBlogPosts);
        setIsFallback(true);
      }
    } catch (error) {
      console.warn("Using demonstration blog posts", error);
      setPosts(defaultDemoBlogPosts);
      setIsFallback(true);
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
    fetchBlogPosts();
  }, []);

  const handleTogglePublish = async (post: BlogPostItem) => {
    const nextStatus = !post.is_published;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, is_published: nextStatus } : p))
    );
    try {
      await adminApi.updateBlogPost(post.id, { is_published: nextStatus });
      setSuccessMsg(isRTL ? "تم تحديث حالة النشر" : "Publication status updated");
    } catch (err) {
      console.warn("Updated status locally", err);
    }
  };

  const handleDelete = async (post: BlogPostItem) => {
    if (!confirm(isRTL ? "هل أنت تأكد من حذف هذا المقال؟" : "Are you sure you want to delete this article?")) return;

    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    try {
      await adminApi.deleteBlogPost(post.id);
      setSuccessMsg(isRTL ? "تم حذف المقال بنجاح" : "Article deleted successfully");
    } catch (err) {
      console.warn("Deleted post locally", err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setIsPublished(true);
    setIsFeatured(false);
    setThumbnailUrl("");
    setSelectedImageFile(null);
    setEnTranslation({ ...initialTranslation });
    setArTranslation({ ...initialTranslation });
    setActiveTab("ar");
    setShowModal(true);
  };

  const handleOpenEditModal = (post: BlogPostItem) => {
    setEditingId(post.id);
    setIsPublished(post.is_published);
    setIsFeatured(post.is_featured);
    setThumbnailUrl(post.thumbnail || "");
    setSelectedImageFile(null);

    let en: BlogPostTranslation = { title: post.title || "", excerpt: post.excerpt || "", body: post.body || "" };
    let ar: BlogPostTranslation = { title: post.title || "", excerpt: post.excerpt || "", body: post.body || "" };

    if (Array.isArray(post.translations)) {
      const enItem = post.translations.find((t) => t.locale === "en");
      const arItem = post.translations.find((t) => t.locale === "ar");
      if (enItem) en = { title: enItem.title, excerpt: enItem.excerpt || "", body: enItem.body || "" };
      if (arItem) ar = { title: arItem.title, excerpt: arItem.excerpt || "", body: arItem.body || "" };
    } else if (post.translations) {
      if (post.translations.en) en = { ...post.translations.en };
      if (post.translations.ar) ar = { ...post.translations.ar };
    }

    setEnTranslation(en);
    setArTranslation(ar);
    setActiveTab("ar");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let finalThumbnailUrl = thumbnailUrl.trim();
    if (selectedImageFile) {
      try {
        const uploadRes = await adminApi.uploadBlogImage(selectedImageFile);
        finalThumbnailUrl = uploadRes.data.url || uploadRes.data.path || finalThumbnailUrl;
      } catch (uploadErr) {
        console.warn("Using local preview URL as fallback for image", uploadErr);
      }
    }

    const payload: BlogPostPayload = {
      is_published: isPublished,
      is_featured: isFeatured,
      thumbnail: finalThumbnailUrl || null,
      translations: {
        en: enTranslation,
        ar: arTranslation,
      },
    };

    const displayTitle = isRTL ? (arTranslation.title || enTranslation.title) : (enTranslation.title || arTranslation.title);
    const displayExcerpt = isRTL ? (arTranslation.excerpt || enTranslation.excerpt) : (enTranslation.excerpt || arTranslation.excerpt);

    try {
      if (editingId) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  is_published: isPublished,
                  is_featured: isFeatured,
                  title: displayTitle,
                  excerpt: displayExcerpt,
                  translations: payload.translations,
                }
              : p
          )
        );
        await adminApi.updateBlogPost(editingId, payload);
      } else {
        const newPostItem: BlogPostItem = {
          id: Date.now(),
          is_published: isPublished,
          is_featured: isFeatured,
          published_at: new Date().toISOString().split("T")[0],
          title: displayTitle,
          excerpt: displayExcerpt,
          translations: payload.translations,
        };
        setPosts((prev) => [newPostItem, ...prev]);
        await adminApi.createBlogPost(payload);
      }
      setShowModal(false);
      setSuccessMsg(isRTL ? "تم حفظ بيانات المقال بنجاح" : "Article saved successfully");
    } catch (err: any) {
      console.warn("Saved post locally", err);
      setShowModal(false);
      setSuccessMsg(isRTL ? "تم حفظ البيانات محلياً بنجاح" : "Article saved locally successfully");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "thumbnail",
      label: isRTL ? "الصورة" : "Image",
      render: (row: BlogPostItem) => (
        row.thumbnail ? (
          <div
            className="rounded-3 overflow-hidden border shadow-sm"
            style={{ width: "52px", height: "38px", backgroundImage: `url(${row.thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }}
            title={row.thumbnail}
          />
        ) : (
          <div
            className="rounded-3 d-flex align-items-center justify-content-center border bg-light"
            style={{ width: "52px", height: "38px" }}
          >
            <i className="fa-regular fa-image text-muted" style={{ fontSize: "0.9rem" }} />
          </div>
        )
      ),
    },
    {
      key: "title",
      label: isRTL ? "عنوان المقال" : "Article Title",
      render: (row: BlogPostItem) => {
        let title = row.title;
        if (!title && Array.isArray(row.translations)) {
          const item = row.translations.find((t) => t.locale === (isRTL ? "ar" : "en"));
          title = item?.title;
        }
        return (
          <div>
            <span className="fw-bold text-dark d-block">{title || `Article #${row.id}`}</span>
            <small className="text-muted text-truncate d-block" style={{ maxWidth: "340px" }}>
              {row.excerpt || (row.translations as any)?.[isRTL ? "ar" : "en"]?.excerpt || "-"}
            </small>
          </div>
        );
      },
    },
    {
      key: "is_featured",
      label: isRTL ? "مميز" : "Featured",
      render: (row: BlogPostItem) =>
        row.is_featured ? (
          <span
            className="badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1"
            style={{ backgroundColor: "#78350f", color: "#fef3c7", fontSize: "0.78rem" }}
          >
            <i className="fa-solid fa-star" style={{ fontSize: "0.65rem" }} />
            {isRTL ? "مميز" : "Featured"}
          </span>
        ) : (
          <span className="text-muted small opacity-50">—</span>
        ),
    },
    {
      key: "is_published",
      label: isRTL ? "الحالة" : "Status",
      render: (row: BlogPostItem) => (
        <button
          onClick={() => handleTogglePublish(row)}
          className={`badge border-0 px-3 py-2 rounded-pill fw-bold cursor-pointer ${
            row.is_published ? "btn-status-published" : "btn-status-draft"
          }`}
        >
          <i className={`fa-solid fa-${row.is_published ? "circle-check" : "circle-xmark"} me-1`}></i>
          {row.is_published ? (isRTL ? "منشور" : "Published") : (isRTL ? "مسودة" : "Draft")}
        </button>
      ),
    },
    {
      key: "published_at",
      label: isRTL ? "تاريخ النشر" : "Published Date",
      render: (row: BlogPostItem) => (
        <small className="font-monospace text-muted fw-bold">
          {row.published_at || (row.created_at ? row.created_at.split("T")[0] : "-")}
        </small>
      ),
    },
  ];

  return (
    <div className="w-100">
      <style>{`
        .btn-status-published {
          background-color: rgba(16, 185, 129, 0.14);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          transition: all 0.25s ease-in-out;
        }
        .btn-status-published:hover {
          background-color: #10b981 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
          transform: translateY(-1px);
        }
        .btn-status-draft {
          background-color: rgba(100, 116, 139, 0.14);
          color: #475569;
          border: 1px solid rgba(100, 116, 139, 0.3) !important;
          transition: all 0.25s ease-in-out;
        }
        .btn-status-draft:hover {
          background-color: #475569 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
          transform: translateY(-1px);
        }
      `}</style>
      
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
              ? "يتم عرض مقالات توضيحية ممتازة حتى يتم استجابة السيرفر بشكل كامل."
              : "Demonstration articles loaded for preview."}
          </span>
        </div>
      )}

      {/* Main DataTable */}
      <DataTable
        title={isRTL ? "إدارة المدونة والمقالات التقنية" : "Blog Posts & Articles Manager"}
        columns={columns}
        data={posts}
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
          style={{ 
            backgroundColor: "rgba(10, 14, 30, 0.75)", 
            backdropFilter: "blur(6px)", 
            zIndex: 1055,
            overflowY: "auto",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            style={{ maxWidth: "780px", margin: "2rem auto", transition: "all 0.3s ease" }}
          >
            <div 
              className="modal-content border-0 overflow-hidden shadow-lg w-100" 
              style={{ borderRadius: "20px", maxHeight: "88vh", display: "flex", flexDirection: "column", background: "#ffffff" }}
            >
              {/* Premium Modal Header */}
              <div 
                className="modal-header border-0 px-4 pt-4 pb-3 d-flex align-items-center justify-content-between w-100"
                style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)", direction: isRTL ? "rtl" : "ltr" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                    style={{ width: "42px", height: "42px", background: "linear-gradient(135deg,#0d83fd,#0057e4)", flexShrink: 0 }}>
                    <i className="fa-solid fa-newspaper text-white" style={{ fontSize: "1rem" }} />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: "1.1rem" }}>
                      {editingId
                        ? (isRTL ? "تعديل المقال" : "Edit Article")
                        : (isRTL ? "إضافة مقال جديد" : "Create New Article")}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: "0.78rem" }}>
                      {isRTL ? "أدخل بيانات المقال بالعربية والإنجليزية" : "Fill in Arabic & English article details"}
                    </p>
                  </div>
                </div>

                {/* Close Button — strictly at the extreme far edge (أقصى الشمال) */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="d-flex align-items-center justify-content-center border-0 rounded-circle transition-all m-0"
                  style={{ 
                    width: "38px", 
                    height: "38px", 
                    background: "#ffffff", 
                    color: "#64748b", 
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
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

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: "1 1 auto", overflow: "hidden" }}>
                {/* Scrollable Modal Body */}
                <div 
                  className="modal-body px-4 py-4" 
                  style={{ 
                    background: "#fafbff", 
                    overflowY: "auto", 
                    maxHeight: "calc(88vh - 145px)", 
                    flex: "1 1 auto" 
                  }}
                >
                  {/* Top Section: Image Upload & Publication Settings Side-by-Side */}
                  <div className="row g-3 mb-4">
                    
                    {/* Column 1: Image Upload Area */}
                    <div className="col-12 col-md-7">
                      <div className="card h-100 border-0 rounded-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                            <i className="fa-solid fa-cloud-arrow-up text-primary fs-6" />
                            <span>{isRTL ? "صورة غلاف المقال (Thumbnail)" : "Article Cover Image (Thumbnail)"}</span>
                          </label>

                          {!thumbnailUrl ? (
                            <label 
                              htmlFor="blog-image-upload" 
                              className="d-flex flex-column align-items-center justify-content-center p-3 rounded-4 transition-all h-100"
                              style={{
                                border: "2px dashed #cbd5e1",
                                backgroundColor: "#f8fafc",
                                cursor: "pointer",
                                minHeight: "135px"
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d83fd"; e.currentTarget.style.backgroundColor = "#eff6ff"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                            >
                              <i className="fa-solid fa-image text-primary opacity-75 mb-2" style={{ fontSize: "1.8rem" }} />
                              <span className="fw-bold small text-dark mb-1">
                                {isRTL ? "اضغط لرفع صورة من جهازك" : "Click to upload image from device"}
                              </span>
                              <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                                {isRTL ? "صيغ مدعومة: JPG, PNG, WEBP (بحد أقصى 10MB)" : "Supports: JPG, PNG, WEBP (Max 10MB)"}
                              </span>
                              <input
                                id="blog-image-upload"
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files && files[0]) {
                                    const file = files[0];
                                    setSelectedImageFile(file);
                                    setThumbnailUrl(URL.createObjectURL(file));
                                  }
                                }}
                              />
                            </label>
                          ) : (
                            <div className="position-relative rounded-4 overflow-hidden border shadow-sm h-100 d-flex flex-column justify-content-between" style={{ minHeight: "135px", backgroundColor: "#0f172a" }}>
                              <img
                                src={thumbnailUrl}
                                alt="Cover preview"
                                className="w-100 h-100"
                                style={{ maxHeight: "150px", objectFit: "cover", display: "block" }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-2"
                                style={{ background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(2px)" }}>
                                <label
                                  htmlFor="blog-image-change"
                                  className="btn btn-sm btn-light fw-bold rounded-pill shadow-sm d-flex align-items-center gap-1 px-3 py-1 m-0"
                                  style={{ fontSize: "0.75rem", cursor: "pointer" }}
                                >
                                  <i className="fa-solid fa-arrows-rotate text-primary" />
                                  <span>{isRTL ? "تغيير الصورة" : "Change Image"}</span>
                                  <input
                                    id="blog-image-change"
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      if (files && files[0]) {
                                        const file = files[0];
                                        setSelectedImageFile(file);
                                        setThumbnailUrl(URL.createObjectURL(file));
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedImageFile(null);
                                    setThumbnailUrl("");
                                  }}
                                  className="btn btn-sm btn-danger fw-bold rounded-pill shadow-sm d-flex align-items-center gap-1 px-3 py-1"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  <i className="fa-solid fa-trash-can" />
                                  <span>{isRTL ? "إزالة الصورة" : "Remove"}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Publication & Feature Settings */}
                    <div className="col-12 col-md-5">
                      <div className="card h-100 border-0 rounded-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                            <i className="fa-solid fa-sliders text-primary fs-6" />
                            <span>{isRTL ? "إعدادات النشر والتفاعل" : "Publication Settings"}</span>
                          </label>

                          <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-center">
                            {/* Publish Toggle */}
                            <label
                              htmlFor="publishSwitch"
                              className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 border fw-semibold small m-0"
                              style={{
                                cursor: "pointer",
                                backgroundColor: isPublished ? "rgba(16,185,129,0.08)" : "#f8fafc",
                                borderColor: isPublished ? "rgba(16,185,129,0.4)" : "#e2e8f0",
                                color: isPublished ? "#047857" : "#64748b",
                                transition: "all 0.2s ease",
                                userSelect: "none",
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "26px", height: "26px", backgroundColor: isPublished ? "#10b981" : "#cbd5e1", color: "#fff" }}>
                                  <i className="fa-solid fa-paper-plane" style={{ fontSize: "0.7rem" }} />
                                </div>
                                <span>{isRTL ? "نشر المقال فوراً" : "Publish Immediately"}</span>
                              </div>
                              <div className="form-check form-switch m-0 p-0" style={{ lineHeight: 1 }}>
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="publishSwitch"
                                  checked={isPublished}
                                  onChange={(e) => setIsPublished(e.target.checked)}
                                  style={{ width: "2.2em", height: "1.2em", cursor: "pointer" }}
                                />
                              </div>
                            </label>

                            {/* Featured Toggle */}
                            <label
                              htmlFor="featuredSwitch"
                              className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 border fw-semibold small m-0"
                              style={{
                                cursor: "pointer",
                                backgroundColor: isFeatured ? "rgba(180,83,9,0.08)" : "#f8fafc",
                                borderColor: isFeatured ? "rgba(180,83,9,0.35)" : "#e2e8f0",
                                color: isFeatured ? "#92400e" : "#64748b",
                                transition: "all 0.2s ease",
                                userSelect: "none",
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "26px", height: "26px", backgroundColor: isFeatured ? "#d97706" : "#cbd5e1", color: "#fff" }}>
                                  <i className="fa-solid fa-star" style={{ fontSize: "0.7rem" }} />
                                </div>
                                <span>{isRTL ? "تمييـز المقـال (Featured)" : "Featured Article"}</span>
                              </div>
                              <div className="form-check form-switch m-0 p-0" style={{ lineHeight: 1 }}>
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="featuredSwitch"
                                  checked={isFeatured}
                                  onChange={(e) => setIsFeatured(e.target.checked)}
                                  style={{ width: "2.2em", height: "1.2em", cursor: "pointer" }}
                                />
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Language Tabs */}
                  <ul className="nav nav-tabs nav-fill mb-3" style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link fw-bold d-flex align-items-center justify-content-center gap-2 ${
                          activeTab === "ar" ? "active text-primary border-primary" : "text-muted border-transparent"
                        }`}
                        style={{ borderBottom: activeTab === "ar" ? "2px solid #0d83fd" : "2px solid transparent", marginBottom: "-2px", background: "transparent" }}
                        onClick={() => setActiveTab("ar")}
                      >
                        <span>🇸🇦</span>
                        <span>{isRTL ? "المحتوى العربي" : "Arabic Content"}</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link fw-bold d-flex align-items-center justify-content-center gap-2 ${
                          activeTab === "en" ? "active text-primary" : "text-muted"
                        }`}
                        style={{ borderBottom: activeTab === "en" ? "2px solid #0d83fd" : "2px solid transparent", marginBottom: "-2px", background: "transparent" }}
                        onClick={() => setActiveTab("en")}
                      >
                        <span>🇬🇧</span>
                        <span>English Translation</span>
                      </button>
                    </li>
                  </ul>

                  {/* Arabic Form */}
                  {activeTab === "ar" && (
                    <div dir="rtl">
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-heading text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>عنوان المقال (بالعربية)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={arTranslation.title}
                          onChange={(e) => setArTranslation({ ...arTranslation, title: e.target.value })}
                          placeholder="مثال: مستقبل الذكاء الاصطناعي في البرمجيات"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-align-left text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>الملخص (Excerpt)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={arTranslation.excerpt || ""}
                          onChange={(e) => setArTranslation({ ...arTranslation, excerpt: e.target.value })}
                          placeholder="ملخص قصير يظهر في كروت المقالات..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-file-lines text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>محتوى المقال بالكامل (Body)</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={arTranslation.body || ""}
                          onChange={(e) => setArTranslation({ ...arTranslation, body: e.target.value })}
                          placeholder="اكتب المحتوى الكامل للمقال هنا..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* English Form */}
                  {activeTab === "en" && (
                    <div dir="ltr">
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-heading text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>Article Title (English)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={enTranslation.title}
                          onChange={(e) => setEnTranslation({ ...enTranslation, title: e.target.value })}
                          placeholder="e.g. Future of Artificial Intelligence"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-align-left text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>Excerpt (Short Summary)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={enTranslation.excerpt || ""}
                          onChange={(e) => setEnTranslation({ ...enTranslation, excerpt: e.target.value })}
                          placeholder="Brief summary displayed on article cards..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                          <i className="fa-solid fa-file-lines text-primary" style={{ fontSize: "0.85rem" }} />
                          <span>Full Article Body</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={enTranslation.body || ""}
                          onChange={(e) => setEnTranslation({ ...enTranslation, body: e.target.value })}
                          placeholder="Write the complete article content here..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="d-flex align-items-center justify-content-between gap-3 px-4 py-3 border-top"
                  style={{ background: "#f8faff" }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    onClick={() => setShowModal(false)}
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
                    disabled={submitting}
                    style={{ background: "linear-gradient(135deg,#0d83fd,#0057e4)", border: "none" }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        {isRTL ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk me-2" />
                        {editingId ? (isRTL ? "حفظ التعديلات" : "Update Article") : (isRTL ? "إضافة المقال" : "Create Article")}
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

export default BlogManager;
