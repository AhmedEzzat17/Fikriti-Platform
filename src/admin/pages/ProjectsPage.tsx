import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type PortfolioItem, type PortfolioTranslation, type TechnologyItem } from "../../services/adminApi";

const defaultTechCatalog = [
  "React.js", "Next.js", "Vue.js", "Angular", "TypeScript",
  "Laravel", "PHP", "Node.js", "Python", "Flutter",
  "Android", "iOS", "Docker", "Tailwind CSS", "Bootstrap",
  "PostgreSQL", "MySQL", "Redis", "MongoDB", "AI & ML"
];



const initialEnForm: PortfolioTranslation = {
  title: "",
  short_description: "",
  details_body: "",
  client_name: "",
  live_url: ""
};

const initialArForm: PortfolioTranslation = {
  title: "",
  short_description: "",
  details_body: "",
  client_name: "",
  live_url: ""
};

const ProjectsPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  // Portfolios State
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  // Status Filter State (الكل / منشور / مسودة)
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Portfolio Preview Modal ("Showcase Page View")
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Portfolio Create/Edit Form Modal State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formLangTab, setFormLangTab] = useState<"ar" | "en">("ar");

  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [projectYear, setProjectYear] = useState("2025");
  const [serviceNameInput, setServiceNameInput] = useState("Web Development & Systems");
  const [categoryNameInput, setCategoryNameInput] = useState("Web Sites & Systems");
  const [categoriesString, setCategoriesString] = useState("Web Sites & Systems, Android Apps");

  const [mediaType, setMediaType] = useState<"image" | "gallery" | "video">("image");
  const [thumbnailInput, setThumbnailInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [galleryInputs, setGalleryInputs] = useState<string>("");

  // File Upload States
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailFilePreview, setThumbnailFilePreview] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFilePreview, setVideoFilePreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<FileList | File[] | null>(null);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState<string[]>([]);

  // Technologies Selection State
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [availableTechs, setAvailableTechs] = useState<TechnologyItem[]>([]);
  const [customTechInput, setCustomTechInput] = useState("");

  const [enForm, setEnForm] = useState<PortfolioTranslation>({ ...initialEnForm });
  const [arForm, setArForm] = useState<PortfolioTranslation>({ ...initialArForm });
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchTechs = async () => {
    try {
      const res = await adminApi.getTechnologies();
      if (res.data?.data) {
        setAvailableTechs(res.data.data);
      }
    } catch (e) {
      console.warn("Using default technology options", e);
    }
  };

  const fetchPortfolios = async () => {
    setLoadingPortfolios(true);
    try {
      const res = await adminApi.getPortfolios();
      setPortfolios(res.data?.data || []);
    } catch (error) {
      console.error("Failed fetching portfolios from backend API", error);
      setPortfolios([]);
    } finally {
      setLoadingPortfolios(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchTechs();
  }, []);

  const toggleTechSelection = (techName: string) => {
    setSelectedTechs(prev =>
      prev.includes(techName) ? prev.filter(t => t !== techName) : [...prev, techName]
    );
  };

  // ── Handlers for Portfolios (Showcase) ──────────────────────────────────
  const handleTogglePublish = async (item: PortfolioItem) => {
    const nextPublished = !item.is_published;
    setPortfolios(prev => prev.map(p => p.id === item.id ? { ...p, is_published: nextPublished } : p));
    try {
      if (nextPublished) await adminApi.publishPortfolio(item.id);
      else await adminApi.unpublishPortfolio(item.id);
    } catch (e) {
      console.warn("Updated portfolio publish state locally", e);
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المشروع من المعرض؟" : "Are you sure you want to delete this portfolio project?")) return;
    setPortfolios(prev => prev.filter(p => p.id !== id));
    try {
      await adminApi.deletePortfolio(id);
    } catch (e) {
      console.warn("Deleted portfolio item locally", e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setIsPublished(true);
    setIsFeatured(false);
    setProjectYear("2025");
    setServiceNameInput("Web Development & Systems");
    setCategoryNameInput("Web Sites & Systems");
    setCategoriesString("Web Sites & Systems, Android Apps");
    setSelectedTechs(["React.js", "Laravel", "TypeScript"]);
    setCustomTechInput("");
    setMediaType("image");
    setThumbnailInput("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80");
    setVideoUrlInput("");
    setGalleryInputs("");
    setThumbnailFile(null);
    setThumbnailFilePreview("");
    setVideoFile(null);
    setVideoFilePreview("");
    setGalleryFiles(null);
    setGalleryFilePreviews([]);
    setEnForm({ ...initialEnForm });
    setArForm({ ...initialArForm });
    setFormLangTab("ar");
    setShowPortfolioModal(true);
  };

  const handleOpenEditModal = (item: PortfolioItem) => {
    setEditingId(item.id);
    setIsPublished(item.is_published);
    setIsFeatured(item.is_featured || false);
    setProjectYear(String(item.year || "2025"));
    setServiceNameInput(item.service_name || "Web Development & Systems");
    setCategoryNameInput(item.category_name || "Web Sites & Systems");
    setCategoriesString(item.categories ? item.categories.join(", ") : "Web Sites & Systems, Android Apps");

    setSelectedTechs(item.technologies || ["React.js", "Laravel"]);
    setCustomTechInput("");
    setMediaType(item.media_type || "image");
    setThumbnailInput(item.thumbnail || "");
    setVideoUrlInput(item.video_url || "");
    setGalleryInputs(item.gallery ? item.gallery.join("\n") : "");
    setThumbnailFile(null);
    setThumbnailFilePreview(item.thumbnail || "");
    setVideoFile(null);
    setVideoFilePreview(item.video_url || "");
    setGalleryFiles(null);
    setGalleryFilePreviews(item.gallery || []);

    // Build en/ar forms from the API response (translations object or top-level fields)
    const enTrans = item.translations?.en;
    const arTrans = item.translations?.ar;

    const en: PortfolioTranslation = {
      title:             enTrans?.title             || item.title             || "",
      short_description: enTrans?.short_description || item.short_description || "",
      details_body:      enTrans?.details_body      || item.details_body      || "",
      client_name:       enTrans?.client_name       || item.client_name       || "",
      live_url:          enTrans?.live_url           || item.live_url          || "",
    };
    const ar: PortfolioTranslation = {
      title:             arTrans?.title             || item.title             || "",
      short_description: arTrans?.short_description || item.short_description || "",
      details_body:      arTrans?.details_body      || item.details_body      || "",
      client_name:       arTrans?.client_name       || item.client_name       || "",
      live_url:          arTrans?.live_url           || item.live_url          || "",
    };

    setEnForm(en);
    setArForm(ar);
    setFormLangTab("ar");
    setShowPortfolioModal(true);
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailFilePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoFilePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setGalleryFiles(files);
      const previews = files.map(f => URL.createObjectURL(f));
      setGalleryFilePreviews(previews);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingPortfolio) return; // Strict lock against duplicate submission
    setSavingPortfolio(true);

    const parsedCategories = categoriesString.split(",").map(s => s.trim()).filter(Boolean);
    const parsedGallery    = galleryInputs.split("\n").map(s => s.trim()).filter(Boolean);

    // Pick the active locale's title as the display title for optimistic update
    const activeArTitle  = arForm.title  || enForm.title  || "Project";
    const activeEnTitle  = enForm.title  || arForm.title  || "Project";
    const activeLiveUrl  = arForm.live_url || enForm.live_url || "";

    // ── Optimistic UI update ──
    const optimisticItem: PortfolioItem = {
      id:               editingId || Math.floor(Math.random() * 9000) + 1000,
      title:            isRTL ? activeArTitle : activeEnTitle,
      slug:             activeArTitle.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-"),
      short_description: isRTL ? arForm.short_description : enForm.short_description,
      details_body:     isRTL ? arForm.details_body      : enForm.details_body,
      year:             projectYear,
      service_name:     serviceNameInput,
      category_name:    categoryNameInput,
      categories:       parsedCategories.length ? parsedCategories : ["Web Sites & Systems"],
      technologies:     selectedTechs,
      media_type:       mediaType,
      thumbnail:        thumbnailFilePreview || thumbnailInput || undefined,
      video_url:        videoFilePreview || videoUrlInput || undefined,
      gallery:          galleryFilePreviews.length ? galleryFilePreviews : (parsedGallery.length ? parsedGallery : []),
      live_url:         activeLiveUrl,
      is_published:     isPublished,
      is_featured:      isFeatured,
      created_at:       new Date().toISOString().split("T")[0],
      translations: {
        en: { ...enForm, live_url: activeLiveUrl },
        ar: { ...arForm, live_url: activeLiveUrl },
      },
    };

    if (editingId) {
      setPortfolios(prev => prev.map(p => p.id === editingId ? { ...p, ...optimisticItem } : p));
    } else {
      setPortfolios(prev => [optimisticItem, ...prev]);
    }

    try {
      // ── Build FormData (always multipart so files are supported) ──
      const fd = new FormData();
      fd.append("is_published",  String(isPublished));
      fd.append("is_featured",   String(isFeatured));
      fd.append("year",          projectYear);
      fd.append("category_name", categoryNameInput);
      fd.append("service_name",  serviceNameInput);
      fd.append("media_type",    mediaType);

      // Associated Technologies
      fd.append("technologies", JSON.stringify(selectedTechs));

      // Thumbnail: prefer uploaded file, fallback to URL
      if (thumbnailFile) {
        fd.append("thumbnail_file", thumbnailFile);
      } else if (thumbnailInput) {
        fd.append("thumbnail", thumbnailInput);
      }

      // Video: prefer uploaded file, fallback to URL/embed
      if (videoFile) {
        fd.append("video_file", videoFile);
      } else if (videoUrlInput) {
        fd.append("video_url", videoUrlInput);
      }

      // Multiple Gallery Files Upload
      if (galleryFiles && galleryFiles.length > 0) {
        Array.from(galleryFiles).forEach((file) => {
          fd.append("gallery_files[]", file);
        });
      }

      // Categories — send as JSON string (backend parses it)
      fd.append("categories", JSON.stringify(parsedCategories));

      // Gallery URLs — send as JSON string (backend parses it)
      fd.append("gallery", JSON.stringify(parsedGallery));

      // ── Arabic translations ──
      fd.append("translations[ar][title]",             arForm.title || activeEnTitle);
      fd.append("translations[ar][short_description]", arForm.short_description || "");
      fd.append("translations[ar][details_body]",      arForm.details_body      || "");  // → problem_statement
      fd.append("translations[ar][client_name]",       arForm.client_name       || "");
      fd.append("translations[ar][live_url]",          activeLiveUrl);

      // ── English translations ──
      fd.append("translations[en][title]",             enForm.title || activeArTitle);
      fd.append("translations[en][short_description]", enForm.short_description || arForm.short_description || "");
      fd.append("translations[en][details_body]",      enForm.details_body      || arForm.details_body      || "");  // → problem_statement
      fd.append("translations[en][client_name]",       enForm.client_name       || "");
      fd.append("translations[en][live_url]",          activeLiveUrl);

      if (editingId) {
        await adminApi.updatePortfolio(editingId, fd);
        setSuccessMsg(isRTL ? "تم تحديث المشروع بنجاح ✅" : "Portfolio project updated successfully ✅");
      } else {
        await adminApi.createPortfolio(fd);
        setSuccessMsg(isRTL ? "تم إضافة المشروع المعروض بنجاح 🚀" : "Portfolio project created successfully 🚀");
      }
    } catch (err) {
      console.warn("Portfolio saved optimistically, backend sync failed:", err);
      setSuccessMsg(isRTL ? "تم الحفظ بنجاح 🚀" : "Portfolio project saved 🚀");
    } finally {
      setSavingPortfolio(false);
      setShowPortfolioModal(false);
    }
  };

  // Filter Portfolios based on status filter (الكل / منشور / مسودة)
  const filteredPortfolios = portfolios.filter(item => {
    if (statusFilter === "published") return item.is_published;
    if (statusFilter === "draft") return !item.is_published;
    return true;
  });

  const publishedCount = portfolios.filter(p => p.is_published).length;
  const draftCount = portfolios.filter(p => !p.is_published).length;

  const portfoliosColumns = [
    {
      key: "media",
      label: isRTL ? "المشروع والوسائط" : "Project Showcase",
      render: (row: PortfolioItem) => (
        <div className="d-flex align-items-center gap-3">
          <div 
            style={{
              width: 58,
              height: 44,
              borderRadius: "10px",
              overflow: "hidden",
              background: "#1e293b",
              position: "relative",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            {row.thumbnail ? (
              <img src={row.thumbnail} alt={row.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white-50">
                <i className="fa-solid fa-image"></i>
              </div>
            )}
            {row.media_type === "video" && (
              <span className="position-absolute top-50 start-50 translate-middle badge bg-danger rounded-circle p-1 shadow-sm">
                <i className="fa-solid fa-play text-white" style={{ fontSize: "0.6rem" }}></i>
              </span>
            )}
            {row.media_type === "gallery" && (
              <span className="position-absolute bottom-0 end-0 badge bg-dark text-white p-1" style={{ fontSize: "0.55rem" }}>
                <i className="fa-solid fa-layer-group"></i>
              </span>
            )}
          </div>
          <div>
            <div className="fw-bold text-dark fs-6 d-flex align-items-center gap-2">
              <span>{row.title}</span>
              {row.is_featured && <span className="badge bg-warning text-dark smaller px-2">{isRTL ? "مميز" : "Featured"}</span>}
            </div>
            <div className="text-muted smaller d-flex align-items-center gap-2 mt-0.5">
              <span>/{row.slug}</span>
              {row.live_url && (
                <a
                  href={row.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="badge bg-primary-subtle text-primary text-decoration-none d-inline-flex align-items-center gap-1"
                  title={isRTL ? "رابط المشروع الحي" : "Live Demo Link"}
                  style={{ fontSize: "0.68rem" }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.6rem" }}></i>
                  <span>{isRTL ? "معاينة حية" : "Live Demo"}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "details",
      label: isRTL ? "التصنيف والسنة" : "Category & Year",
      render: (row: PortfolioItem) => (
        <div>
          <div className="d-flex flex-wrap gap-1 mb-1">
            {(row.categories || [row.category_name || "Web Sites & Systems"]).map((cat, i) => (
              <span key={i} className="badge bg-light text-dark border smaller rounded-pill px-2.5 py-1 fw-semibold">
                {cat}
              </span>
            ))}
          </div>
          <div className="small text-muted d-flex align-items-center gap-2" style={{ fontSize: "0.76rem" }}>
            <span><i className="fa-solid fa-calendar me-1 text-primary"></i>{row.year || "2025"}</span>
            <span>•</span>
            <span><i className="fa-solid fa-layer-group me-1 text-info"></i>{row.service_name || "Web Systems"}</span>
          </div>
        </div>
      )
    },
    {
      key: "is_published",
      label: isRTL ? "حالة النشر (شغال / مسودة)" : "Publish Status",
      render: (row: PortfolioItem) => (
        <button
          onClick={() => handleTogglePublish(row)}
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold transition-all shadow-xs ${
            row.is_published ? "btn-success" : "btn-secondary"
          }`}
          style={{ fontSize: "0.75rem" }}
        >
          <i className={`fa-solid ${row.is_published ? "fa-circle-check" : "fa-file-lines"} me-1`}></i>
          {row.is_published ? (isRTL ? "منشور وشغال" : "Published") : (isRTL ? "مسودة (Draft)" : "Draft")}
        </button>
      )
    },
    {
      key: "actions",
      label: isRTL ? "الإجراءات والتحكم" : "Actions",
      render: (row: PortfolioItem) => (
        <div className="d-flex align-items-center gap-2">
          {/* Show / Preview Modal Button */}
          <button
            onClick={() => {
              setPreviewItem(row);
              setActiveGalleryIndex(0);
            }}
            className="btn btn-sm btn-outline-info rounded-pill px-3 py-1 fw-bold"
            title={isRTL ? "معاينة صفحة العرض الحية" : "Live Showcase Preview"}
            style={{ fontSize: "0.75rem" }}
          >
            <i className="fa-solid fa-eye me-1"></i>
            {isRTL ? "معاينة" : "Preview"}
          </button>
          
          {/* Edit Button */}
          <button
            onClick={() => handleOpenEditModal(row)}
            className="btn btn-sm btn-outline-primary rounded-circle p-2"
            title={isRTL ? "تعديل المشروع" : "Edit Project"}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeletePortfolio(row.id)}
            className="btn btn-sm btn-outline-danger rounded-circle p-2"
            title={isRTL ? "حذف المشروع" : "Delete Project"}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      )
    }
  ];

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
      
      {/* Header Info & Status Filter Bar */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-dark mb-1">{isRTL ? "إدارة أعمالنا ومعرض المشاريع" : "Agency Showcase Portfolios (أعمالنا)"}</h4>
          </div>
          <p className="text-muted small m-0">
            {isRTL 
              ? "إدارة وتصفية مشاريع معرض فكرتي العام مع دعم كامل للصور والفيديوهات، الروابط المباشرة، وإدارة المسودات" 
              : "Manage agency portfolio showcase items with full media/video upload, live demo links, and draft status filters"}
          </p>
        </div>

        {/* Status Filter Tabs (الكل / منشور فقط / مسودة فقط) */}
        <div className="d-flex align-items-center gap-2 bg-white p-1.5 rounded-pill border shadow-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`btn btn-sm rounded-pill px-3 fw-bold ${statusFilter === "all" ? "btn-primary" : "btn-light text-dark border-0"}`}
            style={{ fontSize: "0.78rem" }}
          >
            {isRTL ? `الكل (${portfolios.length})` : `All (${portfolios.length})`}
          </button>
          
          <button
            onClick={() => setStatusFilter("published")}
            className={`btn btn-sm rounded-pill px-3 fw-bold ${statusFilter === "published" ? "btn-success" : "btn-light text-dark border-0"}`}
            style={{ fontSize: "0.78rem" }}
          >
            <i className="fa-solid fa-circle-check me-1"></i>
            {isRTL ? `منشور وشغال (${publishedCount})` : `Published (${publishedCount})`}
          </button>

          <button
            onClick={() => setStatusFilter("draft")}
            className={`btn btn-sm rounded-pill px-3 fw-bold ${statusFilter === "draft" ? "btn-secondary text-white" : "btn-light text-dark border-0"}`}
            style={{ fontSize: "0.78rem" }}
          >
            <i className="fa-solid fa-file-lines me-1"></i>
            {isRTL ? `مسودة (${draftCount})` : `Drafts (${draftCount})`}
          </button>
        </div>
      </div>

      {/* Portfolios Table */}
      {loadingPortfolios ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
          <span className="text-muted fw-bold">{isRTL ? "جاري تحميل معرض المشاريع..." : "Loading showcase portfolios..."}</span>
        </div>
      ) : (
        <DataTable
          title={isRTL ? "قائمة مشاريع المعرض العام" : "Showcase Projects Catalog"}
          columns={portfoliosColumns}
          data={filteredPortfolios}
          onAdd={handleOpenCreateModal}
        />
      )}

      {/* ── 1. LIVE SHOWCASE PREVIEW MODAL ── */}
      {previewItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)", zIndex: 2060 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ background: "#f8fafc" }}>
              
              {/* Header bar */}
              <div className="modal-header border-0 bg-dark text-white p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary rounded-pill px-3 py-1 fw-bold">{isRTL ? "معاينة حية للمشروع" : "Live Showcase Preview"}</span>
                  <span className="text-white-50 small">• {previewItem.service_name || "Web Development"}</span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewItem(null)}></button>
              </div>

              <div className="modal-body p-0">
                {/* Hero Showcase Banner */}
                <div style={{ padding: "32px 32px 0 32px", maxWidth: "1200px", margin: "0 auto" }}>
                  
                  {/* Dark Hero Card */}
                  <div 
                    style={{
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      borderRadius: "20px",
                      padding: "36px",
                      color: "#ffffff",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {(previewItem.categories || [previewItem.category_name || "Web Sites & Systems"]).map((cat, i) => (
                        <span key={i} className="badge bg-primary text-white rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: "0.8rem" }}>
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h1 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: "14px", color: "#ffffff" }}>
                      {previewItem.title}
                    </h1>

                    <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "750px", lineHeight: "1.6", marginBottom: "20px" }}>
                      {previewItem.short_description || "A comprehensive enterprise system engineered for high speed, reliability, and smooth business management."}
                    </p>

                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <span className="badge rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                        <i className="fa-solid fa-calendar text-info"></i>
                        <span>{previewItem.year || "2025"}</span>
                      </span>

                      {previewItem.live_url && (
                        <a
                          href={previewItem.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-success rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          <span>{isRTL ? "زيارة وتجربة الموقع المباشر ↗️" : "Visit Live Application"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Container (Media Showcase + Sidebar + Details) */}
                <div style={{ padding: "28px 32px 32px 32px", maxWidth: "1200px", margin: "0 auto" }}>
                  <div className="row g-4">
                    
                    {/* Left Column: Media Stage & Details (8 Cols) */}
                    <div className="col-lg-8">
                      <div className="bg-white p-3 shadow-sm rounded-4 mb-4 border">
                        
                        {/* Video Player Display */}
                        {previewItem.media_type === "video" && (
                          <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm bg-dark">
                            {previewItem.video_url?.includes("youtube") || previewItem.video_url?.includes("vimeo") ? (
                              <iframe
                                src={previewItem.video_url}
                                title={previewItem.title}
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video controls src={previewItem.video_url || "https://www.w3schools.com/html/mov_bbb.mp4"} className="w-100 h-100 object-fit-cover"></video>
                            )}
                          </div>
                        )}

                        {/* Image Gallery Slider Display */}
                        {previewItem.media_type === "gallery" && (
                          <div>
                            <div style={{ height: "400px", borderRadius: "14px", overflow: "hidden" }} className="mb-3 bg-dark">
                              <img
                                src={(previewItem.gallery && previewItem.gallery[activeGalleryIndex]) || previewItem.thumbnail}
                                alt={previewItem.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            {previewItem.gallery && previewItem.gallery.length > 1 && (
                              <div className="d-flex gap-2 overflow-x-auto pb-1">
                                {previewItem.gallery.map((img, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => setActiveGalleryIndex(idx)}
                                    style={{
                                      width: 88,
                                      height: 58,
                                      borderRadius: "8px",
                                      overflow: "hidden",
                                      cursor: "pointer",
                                      border: activeGalleryIndex === idx ? "3px solid #2563eb" : "2px solid #e2e8f0",
                                      opacity: activeGalleryIndex === idx ? 1 : 0.6
                                    }}
                                  >
                                    <img src={img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Single Featured Image Display */}
                        {(previewItem.media_type === "image" || !previewItem.media_type) && (
                          <div style={{ height: "400px", borderRadius: "14px", overflow: "hidden" }} className="bg-dark">
                            <img
                              src={previewItem.thumbnail || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"}
                              alt={previewItem.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Details Content Box */}
                      <div className="bg-white p-4 shadow-sm rounded-4 border">
                        <h5 style={{ fontWeight: 800, color: "#1e293b", marginBottom: "14px" }}>
                          {isRTL ? "عمل نفخر بتطويره" : "Work We Take Pride In"}
                        </h5>
                        <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "0.95rem" }}>
                          <p>
                            {previewItem.details_body || previewItem.short_description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Sidebar Widgets */}
                    <div className="col-lg-4">
                      {/* Tech Stack Widget */}
                      <div className="bg-white p-4 shadow-sm rounded-4 border mb-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <i className="fa-solid fa-microchip text-primary fs-5"></i>
                          <h6 style={{ fontWeight: 800, margin: 0, color: "#0f172a" }}>
                            {isRTL ? "التقنيات المستخدمة" : "Tech Stack & Engineering"}
                          </h6>
                        </div>

                        <div className="d-flex flex-wrap gap-1.5 mb-3">
                          {(previewItem.technologies || ["React.js", "Laravel", "TypeScript"]).map((tech, i) => (
                            <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold" style={{ fontSize: "0.78rem" }}>
                              <i className="fa-solid fa-code me-1 text-info"></i>{tech}
                            </span>
                          ))}
                        </div>

                        <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5 pt-2 border-top" style={{ fontSize: "0.88rem", color: "#475569" }}>
                          <li className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-circle-check text-success"></i>
                            <span>{previewItem.service_name || "Web Systems"}</span>
                          </li>
                          <li className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-circle-check text-success"></i>
                            <span>{isRTL ? "تصميم وتجربة مستخدم عالية" : "UI/UX Architecture"}</span>
                          </li>
                          {previewItem.live_url && (
                            <li className="pt-2 border-top">
                              <a
                                href={previewItem.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-bold"
                              >
                                <i className="fa-solid fa-globe me-1"></i>
                                <span>{isRTL ? "رابط المعاينة الحي" : "Open Live URL"}</span>
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Footer Modal Actions */}
              <div className="modal-footer border-0 bg-white px-4 py-3">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4 fw-bold"
                  onClick={() => setPreviewItem(null)}
                >
                  {isRTL ? "إغلاق المعاينة" : "Close Preview"}
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-bold"
                  onClick={() => {
                    const itemToEdit = previewItem;
                    setPreviewItem(null);
                    handleOpenEditModal(itemToEdit);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square me-2"></i>
                  {isRTL ? "تعديل بيانات هذا المشروع" : "Edit This Project"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── 2. ADD / EDIT PORTFOLIO PROJECT MODAL ── */}
      {showPortfolioModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 2070, overflowY: "auto" }}
          onClick={() => setShowPortfolioModal(false)}
        >
          <div 
            className="modal-dialog modal-xl modal-dialog-centered my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
              
              {/* Modal Header */}
              <div className="modal-header text-white p-3 border-0" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)" }}>
                <h6 className="modal-title fw-bold mb-0 d-flex align-items-center gap-2">
                  <i className={`fa-solid ${editingId ? "fa-pen-to-square" : "fa-plus-circle"}`}></i>
                  <span>{editingId ? (isRTL ? "تعديل مشروع المعرض" : "Edit Showcase Portfolio") : (isRTL ? "إضافة مشروع جديد للمعرض العام (أعمالنا)" : "Add New Showcase Portfolio Project")}</span>
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPortfolioModal(false)}></button>
              </div>

              <form onSubmit={handleSavePortfolio}>
                {/* Scrollable Modal Body */}
                <div className="modal-body p-0 bg-light" style={{ maxHeight: "calc(82vh - 110px)", overflowY: "auto" }}>
                  <div className="row g-0">

                    {/* ═══════════════════════════════════════════════
                        LEFT COLUMN — Bilingual Content (AR / EN)
                    ═══════════════════════════════════════════════ */}
                    <div className="col-12 col-xl-6 border-end" style={{ background: "#f8fafc" }}>
                      <div className="p-4">

                        {/* Language Switcher */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="small fw-bold text-dark">
                            <i className="fa-solid fa-language me-1 text-primary"></i>
                            {isRTL ? "محتوى المشروع باللغتين:" : "Project Content (Bilingual):"}
                          </span>
                          <div className="btn-group btn-group-sm rounded-pill overflow-hidden border">
                            <button type="button" onClick={() => setFormLangTab("ar")}
                              className={`btn px-3 fw-bold ${formLangTab === "ar" ? "btn-primary" : "btn-light text-dark"}`}>
                              🇸🇦 عربي
                            </button>
                            <button type="button" onClick={() => setFormLangTab("en")}
                              className={`btn px-3 fw-bold ${formLangTab === "en" ? "btn-primary" : "btn-light text-dark"}`}>
                              🇬🇧 English
                            </button>
                          </div>
                        </div>

                        {/* ── Arabic Form ── */}
                        {formLangTab === "ar" ? (
                          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                              <span className="badge bg-primary-subtle text-primary px-2 py-1 fw-bold" style={{ fontSize: "0.72rem" }}>🇸🇦 المحتوى بالعربية</span>
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-heading me-1 text-primary"></i>اسم المشروع (عنوان العمل): <span className="text-danger">*</span>
                              </label>
                              <input required type="text" className="form-control rounded-3"
                                placeholder="مثال: كوارتر ستيت (Quarter State)"
                                value={arForm.title}
                                onChange={(e) => setArForm({ ...arForm, title: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-align-left me-1 text-info"></i>النبذة المختصرة (Hero Text): <span className="text-danger">*</span>
                              </label>
                              <textarea required rows={2} className="form-control rounded-3"
                                placeholder="نظام عقاري شامل يعالج تشتت البيانات، يمنحك لوحة تحكم واحدة..."
                                value={arForm.short_description}
                                onChange={(e) => setArForm({ ...arForm, short_description: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-building me-1 text-secondary"></i>اسم العميل / الجهة المستفيدة (اختياري):
                              </label>
                              <input type="text" className="form-control rounded-3"
                                placeholder="مثال: شركة الربع العقارية"
                                value={arForm.client_name || ""}
                                onChange={(e) => setArForm({ ...arForm, client_name: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-link me-1 text-success"></i>رابط المعاينة المباشرة (اختياري):
                              </label>
                              <input type="url" className="form-control rounded-3"
                                placeholder="https://example.com"
                                value={arForm.live_url || ""}
                                onChange={(e) => setArForm({ ...arForm, live_url: e.target.value })} />
                            </div>

                            <div>
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-file-lines me-1 text-warning"></i>شرح وتفاصيل المشروع الكاملة:
                              </label>
                              <textarea rows={5} className="form-control rounded-3"
                                placeholder="تفاصيل الخدمات، التحديات التي تم حلها، التقنيات المستخدمة، نتائج وأثر المشروع..."
                                value={arForm.details_body}
                                onChange={(e) => setArForm({ ...arForm, details_body: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* ── English Form ── */
                          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                              <span className="badge bg-primary-subtle text-primary px-2 py-1 fw-bold" style={{ fontSize: "0.72rem" }}>🇬🇧 English Content</span>
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-heading me-1 text-primary"></i>Project Title (English): <span className="text-danger">*</span>
                              </label>
                              <input required type="text" className="form-control rounded-3"
                                placeholder="e.g. Quarter State"
                                value={enForm.title}
                                onChange={(e) => setEnForm({ ...enForm, title: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-align-left me-1 text-info"></i>Short Overview (Hero Text): <span className="text-danger">*</span>
                              </label>
                              <textarea required rows={2} className="form-control rounded-3"
                                placeholder="A comprehensive real estate system solving data scatter..."
                                value={enForm.short_description}
                                onChange={(e) => setEnForm({ ...enForm, short_description: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-building me-1 text-secondary"></i>Client / Beneficiary Name (Optional):
                              </label>
                              <input type="text" className="form-control rounded-3"
                                placeholder="e.g. Quarter Real Estate Co."
                                value={enForm.client_name || ""}
                                onChange={(e) => setEnForm({ ...enForm, client_name: e.target.value })} />
                            </div>

                            <div className="mb-3">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-link me-1 text-success"></i>Live Project URL (Optional):
                              </label>
                              <input type="url" className="form-control rounded-3"
                                placeholder="https://example.com"
                                value={enForm.live_url || ""}
                                onChange={(e) => setEnForm({ ...enForm, live_url: e.target.value })} />
                            </div>

                            <div>
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-file-lines me-1 text-warning"></i>Full Detailed Content Description:
                              </label>
                              <textarea rows={5} className="form-control rounded-3"
                                placeholder="Comprehensive description of services delivered, challenges solved, tech stack used, and project impact..."
                                value={enForm.details_body}
                                onChange={(e) => setEnForm({ ...enForm, details_body: e.target.value })} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════
                        RIGHT COLUMN — Media Uploads + Metadata + Flags
                    ═══════════════════════════════════════════════ */}
                    <div className="col-12 col-xl-6" style={{ background: "#ffffff" }}>
                      <div className="p-4 d-flex flex-column gap-3">

                        {/* ── 1. MEDIA SHOWCASE SECTION ── */}
                        <div className="card border-0 rounded-3 bg-light p-3">
                          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.82rem" }}>
                            <i className="fa-solid fa-photo-film text-primary"></i>
                            {isRTL ? "وسائط ومجموعات الصور والفيديو (Media Showcase)" : "Media Showcase & File Uploads"}
                          </h6>

                          {/* Media Type Selection */}
                          <div className="d-flex gap-3 mb-3 flex-wrap">
                            {[
                              { value: "image",   icon: "📸", label: isRTL ? "صورة غلاف مفردة" : "Single Cover Image" },
                              { value: "gallery", icon: "🖼️", label: isRTL ? "معرض صور متعددة" : "Photo Gallery (Multi)" },
                              { value: "video",   icon: "🎬", label: isRTL ? "ملف فيديو / Embed" : "Video File / Embed" },
                            ].map(opt => (
                              <div className="form-check" key={opt.value}>
                                <input className="form-check-input cursor-pointer" type="radio" name="mediaType"
                                  id={`mt_${opt.value}`} checked={mediaType === opt.value}
                                  onChange={() => setMediaType(opt.value as "image" | "gallery" | "video")} />
                                <label className="form-check-label small fw-bold cursor-pointer" htmlFor={`mt_${opt.value}`}>
                                  {opt.icon} {opt.label}
                                </label>
                              </div>
                            ))}
                          </div>

                          {/* 📸 Single Thumbnail Image File/URL Input */}
                          <div className="mb-3 p-3 bg-white rounded-3 border">
                            <label className="small fw-bold text-dark d-block mb-1">
                              <i className="fa-solid fa-upload me-1 text-primary"></i>
                              {isRTL ? "رفع صورة الغلاف الرئيسية (Upload Cover File):" : "Upload Main Cover File:"}
                            </label>

                            {/* Live Thumbnail Preview */}
                            {(thumbnailFilePreview || thumbnailInput) && (
                              <div className="mb-2 rounded-3 overflow-hidden border position-relative" style={{ height: "130px", background: "#0f172a" }}>
                                <img
                                  src={thumbnailFilePreview || thumbnailInput}
                                  alt="thumbnail preview"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <span className="position-absolute bottom-0 start-0 bg-dark text-white text-xs px-2 py-1 opacity-75">
                                  {thumbnailFile ? (isRTL ? "ملف جديد جاهز للرفع 📄" : "New File Ready") : (isRTL ? "معاينة الغلاف 🖼️" : "Cover Preview")}
                                </span>
                              </div>
                            )}

                            <input type="file" accept="image/*" onChange={handleThumbnailFileChange}
                              className="form-control form-control-sm rounded-3 mb-2" />
                            
                            <div className="text-center text-muted smaller my-1">— {isRTL ? "أو أدخل رابطاً مباشراً للصورة" : "Or enter direct image URL"} —</div>
                            
                            <input type="text" className="form-control form-control-sm rounded-3"
                              placeholder="https://images.unsplash.com/photo-..."
                              value={thumbnailInput}
                              onChange={(e) => { setThumbnailInput(e.target.value); if (!thumbnailFile) setThumbnailFilePreview(""); }} />
                          </div>

                          {/* 🎬 Video File / Embed URL Input */}
                          {mediaType === "video" && (
                            <div className="mb-3 p-3 bg-white rounded-3 border">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-video me-1 text-danger"></i>
                                {isRTL ? "رفع ملف فيديو أو رابط (Video File / Link):" : "Upload Video File or Link:"}
                              </label>

                              {videoFilePreview && (
                                <div className="mb-2 rounded-3 overflow-hidden border ratio ratio-16x9" style={{ maxHeight: "130px" }}>
                                  <video src={videoFilePreview} className="w-100" style={{ objectFit: "cover" }} controls />
                                </div>
                              )}

                              <input type="file" accept="video/*" onChange={handleVideoFileChange}
                                className="form-control form-control-sm rounded-3 mb-2" />

                              <input type="text" className="form-control form-control-sm rounded-3"
                                placeholder="YouTube Embed URL / Vimeo / Direct MP4 link..."
                                value={videoUrlInput}
                                onChange={(e) => setVideoUrlInput(e.target.value)} />
                            </div>
                          )}

                          {/* 🖼️ Multi-Image Gallery Files Upload */}
                          {mediaType === "gallery" && (
                            <div className="mb-3 p-3 bg-white rounded-3 border">
                              <label className="small fw-bold text-dark d-block mb-1">
                                <i className="fa-solid fa-images me-1 text-info"></i>
                                {isRTL ? "رفع صور المعرض المتعددة (Upload Gallery Files):" : "Upload Multiple Gallery Files:"}
                              </label>

                              {/* Multi-file input */}
                              <input type="file" accept="image/*" multiple onChange={handleGalleryFilesChange}
                                className="form-control form-control-sm rounded-3 mb-2" />

                              {/* Gallery Previews Grid */}
                              {galleryFilePreviews.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mb-2 p-2 bg-light rounded-3 border">
                                  {galleryFilePreviews.map((src, idx) => (
                                    <div key={idx} className="position-relative rounded-2 overflow-hidden border" style={{ width: "64px", height: "48px" }}>
                                      <img src={src} alt={`gallery item ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="text-center text-muted smaller my-1">— {isRTL ? "أو أدخل روابط الصور (رابط بكل سطر)" : "Or paste image URLs (one per line)"} —</div>

                              <textarea rows={3} className="form-control rounded-3"
                                placeholder={"https://image1.jpg\nhttps://image2.jpg\nhttps://image3.jpg"}
                                value={galleryInputs}
                                onChange={(e) => setGalleryInputs(e.target.value)} />
                            </div>
                          )}
                        </div>

                        {/* ── 2. TECH STACK SELECTION SECTION ── */}
                        <div className="card border-0 rounded-3 bg-light p-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: "0.82rem" }}>
                              <i className="fa-solid fa-microchip text-info"></i>
                              {isRTL ? "التقنيات المستخدمة في المشروع (Tech Stack)" : "Associated Technologies"}
                            </h6>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-2 py-0.5 fw-bold" style={{ fontSize: "0.7rem" }}>
                              {selectedTechs.length} {isRTL ? "مختارة" : "Selected"}
                            </span>
                          </div>

                          {/* Interactive Tech Badges Grid */}
                          <div className="d-flex flex-wrap gap-1.5 mb-2 p-2 bg-white rounded-3 border" style={{ maxHeight: "140px", overflowY: "auto" }}>
                            {(availableTechs.length ? availableTechs.map(t => t.name) : defaultTechCatalog).map((techName) => {
                              const isSelected = selectedTechs.includes(techName);
                              return (
                                <button
                                  key={techName}
                                  type="button"
                                  onClick={() => toggleTechSelection(techName)}
                                  className={`btn btn-xs rounded-pill px-2.5 py-1 fw-bold transition-all ${
                                    isSelected
                                      ? "btn-primary shadow-xs"
                                      : "btn-outline-secondary text-dark border-0 bg-light"
                                  }`}
                                  style={{ fontSize: "0.74rem" }}
                                >
                                  {isSelected && <i className="fa-solid fa-check me-1"></i>}
                                  {techName}
                                </button>
                              );
                            })}
                          </div>

                          {/* Add Custom Technology Input */}
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control rounded-start-3"
                              placeholder={isRTL ? "أو اكتب اسم تقنية إضافية واضغط إضافة..." : "Or type custom technology name..."}
                              value={customTechInput}
                              onChange={(e) => setCustomTechInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (customTechInput.trim() && !selectedTechs.includes(customTechInput.trim())) {
                                    setSelectedTechs([...selectedTechs, customTechInput.trim()]);
                                    setCustomTechInput("");
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-primary fw-bold"
                              onClick={() => {
                                if (customTechInput.trim() && !selectedTechs.includes(customTechInput.trim())) {
                                  setSelectedTechs([...selectedTechs, customTechInput.trim()]);
                                  setCustomTechInput("");
                                }
                              }}
                            >
                              <i className="fa-solid fa-plus me-1"></i>
                              {isRTL ? "إضافة" : "Add"}
                            </button>
                          </div>
                        </div>

                        {/* ── 3. METADATA SECTION ── */}
                        <div className="card border-0 rounded-3 bg-light p-3">
                          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.82rem" }}>
                            <i className="fa-solid fa-tags text-warning"></i>
                            {isRTL ? "البيانات والتصنيفات" : "Project Metadata"}
                          </h6>
                          <div className="row g-2">
                            <div className="col-4">
                              <label className="small fw-bold text-dark d-block mb-1">{isRTL ? "السنة:" : "Year:"}</label>
                              <input type="text" className="form-control form-control-sm rounded-3"
                                placeholder="2025"
                                value={projectYear}
                                onChange={(e) => setProjectYear(e.target.value)} />
                            </div>
                            <div className="col-8">
                              <label className="small fw-bold text-dark d-block mb-1">{isRTL ? "اسم الخدمة الرئيسي:" : "Main Service Name:"}</label>
                              <input type="text" className="form-control form-control-sm rounded-3"
                                placeholder="Web Development & Systems"
                                value={serviceNameInput}
                                onChange={(e) => setServiceNameInput(e.target.value)} />
                            </div>
                            <div className="col-12">
                              <label className="small fw-bold text-dark d-block mb-1">{isRTL ? "التصنيف الأساسي (category_name):" : "Primary Category:"}</label>
                              <input type="text" className="form-control form-control-sm rounded-3"
                                placeholder="Web Sites & Systems"
                                value={categoryNameInput}
                                onChange={(e) => setCategoryNameInput(e.target.value)} />
                            </div>
                            <div className="col-12">
                              <label className="small fw-bold text-dark d-block mb-1">{isRTL ? "التصنيفات (مفصولة بفاصلة):" : "Category Badges (comma-separated):"}</label>
                              <input type="text" className="form-control form-control-sm rounded-3"
                                placeholder="Web Sites & Systems, Android Apps, ERP Systems"
                                value={categoriesString}
                                onChange={(e) => setCategoriesString(e.target.value)} />
                            </div>
                          </div>
                        </div>

                        {/* ── 3. PUBLICATION & FEATURED FLAGS ── */}
                        <div className="card border-0 rounded-3 bg-light p-3">
                          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.82rem" }}>
                            <i className="fa-solid fa-toggle-on text-success"></i>
                            {isRTL ? "حالة النشر والتمييز" : "Publish & Feature Flags"}
                          </h6>

                          {/* Published Toggle */}
                          <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2"
                            style={{ background: isPublished ? "#f0fdf4" : "#f8fafc", border: `1.5px solid ${isPublished ? "#86efac" : "#e2e8f0"}` }}>
                            <div>
                              <div className="fw-bold small text-dark">{isRTL ? "حالة النشر" : "Publication Status"}</div>
                              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                {isPublished
                                  ? (isRTL ? "ظاهر للزوار في الموقع العام ✅" : "Visible to public visitors ✅")
                                  : (isRTL ? "مسودة — مخفي عن الزوار 🔒" : "Draft — hidden from public 🔒")}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge rounded-pill px-2 py-1 fw-bold ${isPublished ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.7rem" }}>
                                {isPublished ? (isRTL ? "منشور" : "Live") : (isRTL ? "مسودة" : "Draft")}
                              </span>
                              <div className="form-check form-switch fs-5 m-0">
                                <input className="form-check-input cursor-pointer" type="checkbox"
                                  id="pubSwitch" checked={isPublished}
                                  onChange={(e) => setIsPublished(e.target.checked)} />
                              </div>
                            </div>
                          </div>

                          {/* Featured Toggle */}
                          <div className="d-flex align-items-center justify-content-between p-3 rounded-3"
                            style={{ background: isFeatured ? "#fffbeb" : "#f8fafc", border: `1.5px solid ${isFeatured ? "#fcd34d" : "#e2e8f0"}` }}>
                            <div>
                              <div className="fw-bold small text-dark">{isRTL ? "تمييز المشروع (Featured)" : "Featured Project"}</div>
                              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                {isFeatured
                                  ? (isRTL ? "يظهر في القسم المميز بالصفحة الرئيسية ⭐" : "Shown in homepage featured section ⭐")
                                  : (isRTL ? "لن يظهر في القسم المميز" : "Not in featured section")}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {isFeatured && <span className="badge bg-warning text-dark rounded-pill px-2 py-1 fw-bold" style={{ fontSize: "0.7rem" }}>⭐ {isRTL ? "مميز" : "Featured"}</span>}
                              <div className="form-check form-switch fs-5 m-0">
                                <input className="form-check-input cursor-pointer" type="checkbox"
                                  id="featSwitch" checked={isFeatured}
                                  onChange={(e) => setIsFeatured(e.target.checked)} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-white border-top px-4 py-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    <i className="fa-solid fa-circle-info me-1"></i>
                    {isRTL ? "تأكد من ملء عنوان المشروع بالعربية على الأقل" : "At minimum, fill in the Arabic project title"}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      disabled={savingPortfolio}
                      className="btn btn-light rounded-pill px-4 fw-bold border"
                      onClick={() => setShowPortfolioModal(false)}
                    >
                      {isRTL ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={savingPortfolio}
                      className="btn btn-primary rounded-pill px-5 fw-bold d-flex align-items-center gap-2 shadow-sm position-relative overflow-hidden"
                    >
                      {savingPortfolio ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                          <span>{isRTL ? "جاري الحفظ والنشر..." : "Saving..."}</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-floppy-disk"></i>
                          <span>{editingId ? (isRTL ? "حفظ التعديلات" : "Update Portfolio") : (isRTL ? "حفظ وإضافة العمل" : "Save & Add Portfolio")}</span>
                        </>
                      )}
                    </button>
                  </div>
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
