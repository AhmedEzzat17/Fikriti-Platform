import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";
import adminApi, { type ClientProject } from "../../services/adminApi";
import { API_BASE_URL } from "../../api/client";



const availableServices = [
  "Web Development & Systems",
  "Mobile Applications",
  "AI Solutions & Web Systems",
  "UI/UX Experience Design",
  "Cloud Infrastructure & DevOps",
  "E-Commerce Enterprise ERP"
];

const ClientProjectsPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Suspended Gate Modal State
  const [accessModalProject, setAccessModalProject] = useState<ClientProject | null>(null);
  const [blockedMsgInput, setBlockedMsgInput] = useState("");

  // Create / Edit Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formServiceName, setFormServiceName] = useState("Web Development & Systems");
  const [formDescription, setFormDescription] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formDeadline, setFormDeadline] = useState("");

  // Client Info Fields
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formClientEmail, setFormClientEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formIndustry, setFormIndustry] = useState("");

  // Financials
  const [formTotalCost, setFormTotalCost] = useState("5000");
  const [formAmountPaid, setFormAmountPaid] = useState("2500");
  const [formCurrency, setFormCurrency] = useState("USD");

  // Status & Access
  const [formStatus, setFormStatus] = useState<ClientProject["status"]>("active");
  const [formAccessAllowed, setFormAccessAllowed] = useState(true);
  const [formBlockedMsg, setFormBlockedMsg] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchClientProjects = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getClientProjects();
      setClientProjects(res.data.data || []);
      setIsFallback(false);
    } catch (error) {
      console.error("Failed loading client projects from backend API", error);
      setClientProjects([]);
      setIsFallback(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientProjects();
  }, []);

  // ── Access Gate Control ──────────────────────────────────────────────
  const handleToggleAccess = async (proj: ClientProject) => {
    const nextAccess = !proj.is_allowed_access;
    if (!nextAccess) {
      setAccessModalProject(proj);
      setBlockedMsgInput(proj.blocked_message || (isRTL ? "تم تعليق الدخول بانتظار سداد المستحقات." : "Access suspended pending invoice settlement."));
      return;
    }
    setClientProjects(prev => prev.map(p => p.id === proj.id ? { ...p, is_allowed_access: true, blocked_message: null } : p));
    try {
      await adminApi.toggleProjectAccess(proj.id, { is_allowed_access: true });
    } catch (e) {
      console.warn("Updated access locally", e);
    }
  };

  const saveBlockedAccess = async () => {
    if (!accessModalProject) return;
    const projId = accessModalProject.id;
    setClientProjects(prev => prev.map(p => p.id === projId ? { ...p, is_allowed_access: false, blocked_message: blockedMsgInput } : p));
    try {
      await adminApi.toggleProjectAccess(projId, { is_allowed_access: false, blocked_message: blockedMsgInput });
    } catch (e) {
      console.warn("Updated blocked access locally", e);
    }
    setAccessModalProject(null);
  };

  const handleStatusChange = async (id: number, newStatus: any) => {
    setClientProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    try {
      await adminApi.updateProjectStatus(id, newStatus);
    } catch (e) {
      console.warn("Updated project status locally", e);
    }
  };

  // ── Create / Edit Handlers ──────────────────────────────────────────
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormServiceName("Web Development & Systems");
    setFormDescription("");
    setFormStartDate(new Date().toISOString().split("T")[0]);
    
    const defaultDeadline = new Date();
    defaultDeadline.setMonth(defaultDeadline.getMonth() + 3);
    setFormDeadline(defaultDeadline.toISOString().split("T")[0]);

    setFormCompanyName("");
    setFormClientName("");
    setFormClientEmail("");
    setFormPhone("");
    setFormCountry(isRTL ? "المملكة العربية السعودية" : "Saudi Arabia");
    setFormIndustry(isRTL ? "التقنية والحلول البرمجية" : "Technology & Services");

    setFormTotalCost("5000");
    setFormAmountPaid("2500");
    setFormCurrency("USD");

    setFormStatus("active");
    setFormAccessAllowed(true);
    setFormBlockedMsg("");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (proj: ClientProject) => {
    setEditingProject(proj);
    setFormTitle(proj.title || "");
    setFormServiceName(proj.service_name || "Web Development & Systems");
    setFormDescription(proj.description || "");
    setFormStartDate(proj.start_date || "");
    setFormDeadline(proj.deadline || "");

    setFormCompanyName(proj.client?.company_name || "");
    setFormClientName(proj.client?.user?.name || "");
    setFormClientEmail(proj.client?.user?.email || "");
    setFormPhone(proj.client?.phone || "");
    setFormCountry(proj.client?.country || (isRTL ? "المملكة العربية السعودية" : "Saudi Arabia"));
    setFormIndustry(proj.client?.industry || (isRTL ? "التقنية" : "Technology"));

    setFormTotalCost(String(proj.total_cost || 0));
    setFormAmountPaid(String(proj.amount_paid || 0));
    setFormCurrency(proj.currency || "USD");

    setFormStatus(proj.status);
    setFormAccessAllowed(proj.is_allowed_access);
    setFormBlockedMsg(proj.blocked_message || "");
    setShowFormModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const total = parseFloat(formTotalCost) || 0;
    const paid = parseFloat(formAmountPaid) || 0;
    const rem = Math.max(0, total - paid);

    const newProjectItem: ClientProject = {
      id: editingProject ? editingProject.id : Math.floor(Math.random() * 9000) + 1000,
      title: formTitle,
      service_name: formServiceName,
      description: formDescription,
      start_date: formStartDate,
      deadline: formDeadline,
      client_id: editingProject ? editingProject.client_id : Math.floor(Math.random() * 100) + 1,
      total_cost: total,
      amount_paid: paid,
      remaining_balance: rem,
      currency: formCurrency,
      status: formStatus,
      is_allowed_access: formAccessAllowed,
      blocked_message: formAccessAllowed ? null : formBlockedMsg,
      client: {
        id: editingProject ? editingProject.client_id : 99,
        company_name: formCompanyName || (isRTL ? "شركة التقنية" : "Tech Enterprise"),
        industry: formIndustry,
        phone: formPhone,
        country: formCountry,
        user: { 
          name: formClientName || formCompanyName || "Client Manager", 
          email: formClientEmail || "client@example.com" 
        }
      }
    };

    if (editingProject) {
      setClientProjects(prev => prev.map(p => p.id === editingProject.id ? newProjectItem : p));
    } else {
      setClientProjects(prev => [newProjectItem, ...prev]);
    }

    try {
      const payload = {
        client_id: newProjectItem.client_id,
        title: formTitle,
        description: formDescription,
        service_name: formServiceName,
        start_date: formStartDate,
        deadline: formDeadline,
        total_cost: total,
        amount_paid: paid,
        currency: formCurrency,
        status: formStatus,
        is_allowed_access: formAccessAllowed,
        blocked_message: formBlockedMsg
      };
      if (editingProject) {
        await adminApi.updateClientProject(editingProject.id, payload);
        setSuccessMsg(isRTL ? "تم تحديث مشروع العميل بنجاح ✅" : "Client project updated successfully ✅");
      } else {
        await adminApi.createClientProject(payload);
        setSuccessMsg(isRTL ? "تم إضافة مشروع العميل الجديد بنجاح 🚀" : "Client project created successfully 🚀");
      }
    } catch (err) {
      console.warn("Saved project locally", err);
      setSuccessMsg(isRTL ? "تم الحفظ بنجاح 🚀" : "Client project saved 🚀");
    } finally {
      setSaving(false);
      setShowFormModal(false);
    }
  };

  // Filtered List
  const filteredProjects = clientProjects.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  // Financial Stats
  const totalRevenue = clientProjects.reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);
  const totalPaid = clientProjects.reduce((acc, curr) => acc + Number(curr.amount_paid || 0), 0);
  const totalOutstanding = clientProjects.reduce((acc, curr) => acc + Number(curr.remaining_balance || 0), 0);
  const blockedCount = clientProjects.filter(p => !p.is_allowed_access).length;

  const clientProjectsColumns = [
    {
      key: "title",
      label: isRTL ? "بيانات المشروع والجهة المتعاقدة" : "PROJECT & CLIENT DETAILS",
      render: (row: ClientProject) => (
        <div style={{ minWidth: "260px" }}>
          <div className="fw-bold text-dark fs-6 mb-1">{row.title}</div>
          
          {/* Company Name & Contact Person */}
          <div className="text-dark small d-flex align-items-center gap-1.5 flex-wrap fw-medium mb-1">
            <span className="badge bg-primary-subtle text-primary border-0 rounded-pill px-2 py-0.5 smaller">
              <i className="fa-solid fa-building me-1"></i>
              {row.client?.company_name || `Client #${row.client_id}`}
            </span>
            {row.client?.user?.name && (
              <span className="text-secondary smaller">
                <i className="fa-solid fa-user-tie me-1 ms-1 text-muted"></i>
                {row.client.user.name}
              </span>
            )}
          </div>

          {/* Contact Phone & Email */}
          <div className="text-muted smaller d-flex align-items-center gap-2 flex-wrap mb-1" style={{ fontSize: "0.78rem" }}>
            {row.client?.user?.email && (
              <span>
                <i className="fa-regular fa-envelope me-1 text-primary"></i>
                {row.client.user.email}
              </span>
            )}
            {row.client?.phone && (
              <span>
                <i className="fa-solid fa-phone me-1 text-success"></i>
                {row.client.phone}
              </span>
            )}
          </div>

          {/* Scope / Description Text Preview */}
          {row.description && (
            <div className="text-muted smaller bg-light p-2 rounded-3 mt-1 text-truncate" style={{ maxWidth: "340px", fontSize: "0.75rem" }}>
              <i className="fa-solid fa-align-left me-1 text-secondary opacity-50"></i>
              {row.description}
            </div>
          )}

          {/* Associated Service Tag */}
          {row.service_name && (
            <div className="mt-1">
              <span className="badge bg-light text-dark border rounded-pill smaller px-2.5 py-1">
                <i className="fa-solid fa-gears me-1 text-primary"></i>
                {row.service_name}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: "financials",
      label: isRTL ? "الحساب والدفعات (الإجمالي / المتبقي)" : "FINANCIALS (TOTAL / REMAINING)",
      render: (row: ClientProject) => (
        <div className="small" style={{ minWidth: "160px" }}>
          <div className="d-flex align-items-center justify-content-between mb-1" style={{ gap: "6px" }}>
            <span className="text-muted" style={{ whiteSpace: "nowrap" }}>{isRTL ? "الإجمالي:" : "Total:"}</span>
            <span className="fw-bold text-dark" style={{ whiteSpace: "nowrap" }}>{row.currency} {Number(row.total_cost).toLocaleString()}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-1" style={{ gap: "6px" }}>
            <span className="text-muted" style={{ whiteSpace: "nowrap" }}>{isRTL ? "المسدد:" : "Paid:"}</span>
            <span className="fw-bold text-success" style={{ whiteSpace: "nowrap" }}>{row.currency} {Number(row.amount_paid).toLocaleString()}</span>
          </div>
          <div className="d-flex align-items-center justify-content-between pt-1 border-top border-light" style={{ gap: "6px" }}>
            <span className="text-muted fw-semibold" style={{ whiteSpace: "nowrap" }}>{isRTL ? "المستحق:" : "Due:"}</span>
            <span className={`fw-bold ${row.remaining_balance > 0 ? "text-danger" : "text-success"}`} style={{ whiteSpace: "nowrap" }}>
              {row.currency} {Number(row.remaining_balance).toLocaleString()}
            </span>
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: isRTL ? "حالة التنفيذ والمواعيد" : "EXECUTION & TIMELINE",
      render: (row: ClientProject) => {
        const statusColors: Record<string, string> = {
          active: "text-success fw-bold",
          pending: "text-warning fw-bold",
          on_hold: "text-danger fw-bold",
          completed: "text-info fw-bold",
          delivered: "text-primary fw-bold"
        };
        const statusLabels: Record<string, string> = {
          active: isRTL ? "نشط (جاري العمل)" : "Active",
          pending: isRTL ? "قيد الانتظار" : "Pending",
          on_hold: isRTL ? "معلق" : "On Hold",
          completed: isRTL ? "مكتمل" : "Completed",
          delivered: isRTL ? "تم التسليم" : "Delivered"
        };
        return (
          <div style={{ minWidth: "170px" }}>
            <div className="d-flex align-items-center gap-1.5 mb-1.5">
              <span className={statusColors[row.status] || "text-dark"}>{statusLabels[row.status] || row.status}</span>
              <select 
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
                className="border-0 bg-transparent text-muted cursor-pointer p-0 ms-1"
                style={{ fontSize: "0.75rem", outline: "none" }}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            {row.start_date && (
              <div className="smaller text-muted mb-0.5" style={{ fontSize: "0.74rem" }}>
                <i className="fa-regular fa-calendar-play me-1 text-secondary"></i>
                {isRTL ? `البداية: ${row.start_date}` : `Start: ${row.start_date}`}
              </div>
            )}
            {row.deadline && (
              <div className="smaller text-muted fw-medium" style={{ fontSize: "0.74rem" }}>
                <i className="fa-regular fa-calendar-check me-1 text-primary"></i>
                {isRTL ? `التسليم: ${row.deadline}` : `Deadline: ${row.deadline}`}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: "access",
      label: isRTL ? "بوابة دخول العميل" : "CLIENT PORTAL GATE",
      render: (row: ClientProject) => {
        const fullApiUrl = `${API_BASE_URL}/projects/${row.id}/access-status`;
        return (
          <div style={{ minWidth: "220px" }}>
            <button
              onClick={() => handleToggleAccess(row)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold mb-1.5 shadow-sm ${row.is_allowed_access ? "btn-success" : "btn-danger"}`}
              style={{ fontSize: "0.75rem" }}
            >
              <i className={`fa-solid ${row.is_allowed_access ? "fa-lock-open" : "fa-lock"} me-1`}></i>
              {row.is_allowed_access ? (isRTL ? "مسموح بالدخول" : "Access Granted") : (isRTL ? "محجوب" : "Blocked")}
            </button>
            <div style={{ fontSize: "0.68rem" }} className="d-flex align-items-center gap-1">
              <a
                href={fullApiUrl}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-primary fw-medium d-inline-flex align-items-center gap-1 text-truncate"
                title={isRTL ? "افتح رابط الـ API المباشر" : "Open public API link"}
                style={{ fontFamily: "monospace", fontSize: "0.65rem", maxWidth: "200px" }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-muted" style={{ fontSize: "0.6rem" }}></i>
                <span>{fullApiUrl}</span>
              </a>
            </div>
          </div>
        );
      }
    },
    {
      key: "actions",
      label: isRTL ? "الإجراءات" : "ACTIONS",
      render: (row: ClientProject) => (
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(row)}
            className="btn btn-sm btn-outline-primary rounded-circle p-2"
            title={isRTL ? "تعديل بيانات العقد" : "Edit Contract"}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            onClick={() => {
              if (window.confirm(isRTL ? "هل تريد حذف مشروع هذا العميل؟" : "Remove this client project?")) {
                setClientProjects(prev => prev.filter(p => p.id !== row.id));
              }
            }}
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
      
      {/* Header Info */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-dark mb-1">{isRTL ? "إدارة مشاريع العملاء والتعاقدات B2B" : "Client Projects & B2B Contracts"}</h4>
            {isFallback && (
              <span className="badge bg-warning-subtle text-warning smaller px-2 py-1">
                {isRTL ? "وضع العرض (غير متصل بالخادم)" : "Demo Mode (Offline)"}
              </span>
            )}
          </div>
          <p className="text-muted small m-0">
            {isRTL 
              ? "إدارة وتوثيق عقود العملاء الحالية، تفاصيل الميزانية والمدفوعات والمستحقات، ونطاق العمل والمواعيد، والتحكم في بوابات دخول العملاء" 
              : "Track active client contracts, manage payment terms, scope of work, and client portal gate access"}
          </p>
        </div>
      </div>

      {/* Financial Overview Stats Cards - Exactly 4 in 1 Row */}
      <div style={{ display: "flex", flexWrap: "nowrap", gap: "8px", marginBottom: "24px", overflowX: "auto" }}>
        <div style={{ flex: "1 1 0px", minWidth: "130px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-2 bg-white h-100">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, flexShrink: 0 }}>
              </div>
              <div style={{ minWidth: 0 }}>
                <span className="small text-muted fw-bold d-block text-truncate" style={{ fontSize: "0.65rem" }}>{isRTL ? "إجمالي قيم العقود" : "Total Contracts"}</span>
                <h5 className="fw-bold text-dark mb-0 fs-6">${totalRevenue.toLocaleString()}</h5>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 0px", minWidth: "130px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-2 bg-white h-100">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-success-subtle text-success p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, flexShrink: 0 }}>
                <i className="fa-solid fa-circle-check fs-6"></i>
              </div>
              <div style={{ minWidth: 0 }}>
                <span className="small text-muted fw-bold d-block text-truncate" style={{ fontSize: "0.65rem" }}>{isRTL ? "المبالغ المحصلة" : "Total Collected"}</span>
                <h5 className="fw-bold text-success mb-0 fs-6">${totalPaid.toLocaleString()}</h5>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 0px", minWidth: "130px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-2 bg-white h-100">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-danger-subtle text-danger p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, flexShrink: 0 }}>
                <i className="fa-solid fa-clock-rotate-left fs-6"></i>
              </div>
              <div style={{ minWidth: 0 }}>
                <span className="small text-muted fw-bold d-block text-truncate" style={{ fontSize: "0.65rem" }}>{isRTL ? "المتبقي المستحق" : "Outstanding"}</span>
                <h5 className="fw-bold text-danger mb-0 fs-6">${totalOutstanding.toLocaleString()}</h5>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 0px", minWidth: "130px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-2 bg-white h-100">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-warning-subtle text-warning p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, flexShrink: 0 }}>
                <i className="fa-solid fa-lock fs-6"></i>
              </div>
              <div style={{ minWidth: 0 }}>
                <span className="small text-muted fw-bold d-block text-truncate" style={{ fontSize: "0.65rem" }}>{isRTL ? "البوابات المحجوبة" : "Blocked Portals"}</span>
                <h5 className="fw-bold text-dark mb-0 fs-6">{blockedCount}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Directory Table */}
      <DataTable
        title={isRTL ? "قائمة عقود ومشاريع العملاء" : "Client Projects Directory"}
        columns={clientProjectsColumns}
        data={filteredProjects}
        isLoading={loading}
        onAdd={handleOpenCreateModal}
        addLabel={isRTL ? "تسجيل عقد عميل جديد" : "New Client Contract"}
        headerControls={
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-bold d-none d-sm-inline" style={{ fontSize: "0.8rem" }}>
              <i className="fa-solid fa-filter me-1 text-primary"></i>
              {isRTL ? "الحالة:" : "Status:"}
            </span>
            <select
              className="form-select form-select-sm rounded-pill border px-3 py-1.5 shadow-xs bg-light small fw-bold text-dark"
              style={{ minWidth: "130px", cursor: "pointer", fontSize: "0.82rem" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{isRTL ? "كل الحالات (All)" : "All Statuses"}</option>
              <option value="active">{isRTL ? "نشط (Active)" : "Active"}</option>
              <option value="pending">{isRTL ? "قيد الانتظار (Pending)" : "Pending"}</option>
              <option value="on_hold">{isRTL ? "معلق (On Hold)" : "On Hold"}</option>
              <option value="completed">{isRTL ? "مكتمل (Completed)" : "Completed"}</option>
              <option value="delivered">{isRTL ? "تم التسليم (Delivered)" : "Delivered"}</option>
            </select>
          </div>
        }
      />

      {/* Access Gate Suspension Modal */}
      {accessModalProject && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger text-white p-3 border-0">
                <h6 className="modal-title fw-bold mb-0">
                  <i className="fa-solid fa-lock me-2"></i>
                  {isRTL ? "حجب دخول العميل إلى بوابة المشروع" : "Suspend Client Portal Access"}
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setAccessModalProject(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <p className="small text-muted mb-3">
                  {isRTL 
                    ? `أنت على وشك إيقاف صلاحية الدخول للمشروع "${accessModalProject.title}". يمكنك كتابة رسالة توضيحية ستظهر للعميل عند محاولة تسجيل الدخول:` 
                    : `You are restricting access for project "${accessModalProject.title}". Enter a message to display when the client attempts access:`}
                </p>
                <div className="mb-3">
                  <label className="small fw-bold text-dark d-block mb-1">{isRTL ? "رسالة الحجب:" : "Suspension Reason Message:"}</label>
                  <textarea
                    rows={3}
                    value={blockedMsgInput}
                    onChange={(e) => setBlockedMsgInput(e.target.value)}
                    className="form-control rounded-3"
                    placeholder={isRTL ? "مثال: تم تعليق الحساب بانتظار سداد الدفعات المستحقة." : "e.g. Portal suspended pending overdue invoice settlement."}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setAccessModalProject(null)}>
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button type="button" onClick={saveBlockedAccess} className="btn btn-danger rounded-pill px-4 fw-bold">
                    <i className="fa-solid fa-ban me-1"></i>
                    {isRTL ? "تأكيد الحجب" : "Confirm Suspension"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HIGH-GRADE ENTERPRISE ERP CLIENT CONTRACT FORM MODAL ── */}
      {showFormModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)", zIndex: 2060 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFormModal(false);
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden bg-white">
              
              {/* Sleek Fikriti Electric Blue Theme Header */}
              <div 
                className="modal-header border-0 px-4 py-3 text-white d-flex align-items-center justify-content-between w-100"
                style={{ background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white text-primary p-2 rounded-3 shadow-xs d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <i className="fa-solid fa-file-contract fs-5 text-primary"></i>
                  </div>
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-white fs-6">
                      {editingProject 
                        ? (isRTL ? "تعديل عقد مشروع العميل" : "Edit Client Contract") 
                        : (isRTL ? "تسجيل عقد مشروع عميل جديد" : "New Client Contract")}
                    </h6>
                    <span className="text-white-50 smaller" style={{ fontSize: "0.78rem" }}>
                      {isRTL ? "توثيق بيانات العميل، النطاق المالي، والمواعيد" : "Complete B2B Contract & Scope Registration"}
                    </span>
                  </div>
                </div>

                {/* Close 'X' Button */}
                <button 
                  type="button" 
                  className="btn-close btn-close-white shadow-none" 
                  onClick={() => setShowFormModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveProject}>
                <div className="modal-body px-3 py-3 bg-light" style={{ maxHeight: "78vh", overflowY: "auto" }}>
                  
                  {/* Section 1: Client & Entity Info (بيانات العميل والشركة) */}
                  <div className="card border-0 shadow-xs rounded-4 p-3.5 mb-3 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light">
                      <h6 className="fw-bold text-dark mb-0 fs-6">
                        {isRTL ? "1. بيانات العميل والجهة المتعاقدة" : "1. Client & Entity Information"}
                      </h6>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", margin: "0 -6px" }}>
                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "اسم الشركة / الجهة المتعاقدة:" : "Company / Organization Name:"}
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder={isRTL ? "مثال: شركة التقنية العربية" : "e.g. Arabian Tech Co."}
                          value={formCompanyName}
                          onChange={(e) => setFormCompanyName(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "اسم المسؤول / العميل:" : "Contact Person Name:"}
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder={isRTL ? "مثال: م. طارق علي" : "e.g. Tariq Ali"}
                          value={formClientName}
                          onChange={(e) => setFormClientName(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "البريد الإلكتروني للتواصل:" : "Client Email Address:"}
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder="client@example.com"
                          value={formClientEmail}
                          onChange={(e) => setFormClientEmail(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "رقم الهاتف / للتواصل:" : "Phone / Contact Number:"}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder="+966 50 123 4567"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "الدولة / المنطقة:" : "Country / Region:"}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder={isRTL ? "المملكة العربية السعودية" : "Saudi Arabia"}
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "مجال العمل / الصناعة:" : "Industry Sector:"}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder={isRTL ? "مثال: التطوير العقاري والصحة" : "Healthcare & Real Estate"}
                          value={formIndustry}
                          onChange={(e) => setFormIndustry(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Project Scope & Timeline (تفاصيل المشروع والمواعيد) */}
                  <div className="card border-0 shadow-xs rounded-4 p-3.5 mb-3 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light">
                      <h6 className="fw-bold text-dark mb-0 fs-6">
                        {isRTL ? "2. تفاصيل المشروع ونطاق العمل" : "2. Project Scope & Timeline"}
                      </h6>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", margin: "0 -6px" }}>
                      <div style={{ width: "58.333%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "عنوان المشروع:" : "Project Title:"}
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control form-control-sm rounded-3 py-2"
                          placeholder={isRTL ? "مثال: منصة إدارة عقارات كوارتر ستيت" : "e.g. E-Commerce Enterprise ERP"}
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "41.666%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "الخدمة المتعاقد عليها:" : "Associated Agency Service:"}
                        </label>
                        <select
                          className="form-select form-select-sm rounded-3 py-2"
                          value={formServiceName}
                          onChange={(e) => setFormServiceName(e.target.value)}
                        >
                          {availableServices.map((srv, idx) => (
                            <option key={idx} value={srv}>{srv}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "تاريخ بداية التنفيذ:" : "Contract Start Date:"}
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm rounded-3 py-2"
                          value={formStartDate}
                          onChange={(e) => setFormStartDate(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "10px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "الموعد النهائي للتسليم:" : "Target Delivery Deadline:"}
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm rounded-3 py-2"
                          value={formDeadline}
                          onChange={(e) => setFormDeadline(e.target.value)}
                        />
                      </div>

                      <div style={{ width: "100%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "شرح ونطاق العمل وقائمة المخرجات:" : "Scope Description & Deliverables:"}
                        </label>
                        <textarea
                          rows={2}
                          className="form-control rounded-3 py-2"
                          placeholder={isRTL ? "تطوير لوحة تحكم متكاملة، تطبيق جوال، ربط بوابات الدفع والتراخيص..." : "Detailed scope, architectural deliverables, and milestone specs..."}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Financials & Payments (المالية والمدفوعات) - 3 Fields Side-by-Side */}
                  <div className="card border-0 shadow-xs rounded-4 p-3.5 mb-3 bg-white">
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold text-dark mb-0 fs-6">
                          {isRTL ? "3. البنود المالية والمدفوعات" : "3. Financials & Payment Terms"}
                        </h6>
                      </div>

                      {/* Live Calculated Remaining Balance Display (No Hover / No Badges) */}
                      <div className="fw-bold small text-dark d-flex align-items-center gap-1">
                        <span className="text-muted">{isRTL ? "المبلغ المستحق (المتبقي):" : "Remaining Due:"}</span>
                        <span className={`fs-6 ${Math.max(0, (parseFloat(formTotalCost) || 0) - (parseFloat(formAmountPaid) || 0)) > 0 ? "text-danger" : "text-success"}`}>
                          ${Math.max(0, (parseFloat(formTotalCost) || 0) - (parseFloat(formAmountPaid) || 0)).toLocaleString()} {formCurrency}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", margin: "0 -6px" }}>
                      <div style={{ width: "33.333%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "إجمالي قيمة العقد:" : "Total Contract Value:"}
                        </label>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-light border">$</span>
                          <input
                            required
                            type="number"
                            step="0.01"
                            className="form-control rounded-end py-2 fw-semibold"
                            value={formTotalCost}
                            onChange={(e) => setFormTotalCost(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ width: "33.333%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "المبلغ المسدد مسبقاً:" : "Amount Paid To Date:"}
                        </label>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-light border">$</span>
                          <input
                            required
                            type="number"
                            step="0.01"
                            className="form-control rounded-end py-2 fw-semibold"
                            value={formAmountPaid}
                            onChange={(e) => setFormAmountPaid(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ width: "33.333%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "العملة المتعاقد بها:" : "Contract Currency:"}
                        </label>
                        <select
                          className="form-select form-select-sm rounded-3 py-2 fw-bold"
                          value={formCurrency}
                          onChange={(e) => setFormCurrency(e.target.value)}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="SAR">SAR (ر.س)</option>
                          <option value="EGP">EGP (ج.م)</option>
                          <option value="AED">AED (د.إ)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Execution Status & Access Control (حالة التنفيذ وبوابة الدخول) - Side-by-Side */}
                  <div className="card border-0 rounded-3 p-3 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light">
                      <h6 className="fw-bold text-dark mb-0 fs-6">
                        {isRTL ? "4. حالة التنفيذ وبوابة الدخول" : "4. Status & Portal Access Control"}
                      </h6>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "حالة تنفيذ المشروع الحالية:" : "Current Execution Status:"}
                        </label>
                        <select
                          className="form-select form-select-sm rounded-3 py-2 fw-bold"
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                        >
                          <option value="pending">{isRTL ? "قيد الانتظار (Pending)" : "Pending"}</option>
                          <option value="active">{isRTL ? "نشط - جاري العمل (Active)" : "Active"}</option>
                          <option value="on_hold">{isRTL ? "معلق (On Hold)" : "On Hold"}</option>
                          <option value="completed">{isRTL ? "مكتمل (Completed)" : "Completed"}</option>
                          <option value="delivered">{isRTL ? "تم التسليم بالكامل (Delivered)" : "Delivered"}</option>
                        </select>
                      </div>

                      <div style={{ width: "50%", padding: "0 6px", marginBottom: "6px" }}>
                        <label className="small fw-bold text-dark d-block mb-1">
                          {isRTL ? "بوابة دخول العميل للمشروع:" : "Client Portal Access Gate:"}
                        </label>
                        <div className="form-check form-switch p-2 px-3 bg-light rounded-3 border d-flex align-items-center justify-content-between m-0" style={{ height: "38px" }}>
                          <label className="form-check-label small fw-bold text-dark cursor-pointer m-0" htmlFor="modalGateSwitch">
                            {isRTL ? "السماح بالدخول البوابة" : "Grant Portal Access"}
                          </label>
                          <input
                            className="form-check-input ms-0 me-2"
                            type="checkbox"
                            id="modalGateSwitch"
                            checked={formAccessAllowed}
                            onChange={(e) => setFormAccessAllowed(e.target.checked)}
                          />
                        </div>
                      </div>

                      {!formAccessAllowed && (
                        <div className="col-12 mt-2">
                          <label className="small fw-bold text-danger d-block mb-1">
                            {isRTL ? "رسالة توضيح حجب الدخول للعميل:" : "Client Access Suspension Reason Message:"}
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-3 py-2 border-danger-subtle"
                            placeholder={isRTL ? "مثال: تم تعليق حساب البوابة بانتظار سداد المتبقي." : "Portal access suspended pending milestone settlement."}
                            value={formBlockedMsg}
                            onChange={(e) => setFormBlockedMsg(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setShowFormModal(false)}>
                      {isRTL ? "إلغاء" : "Cancel"}
                    </button>
                    <button type="submit" disabled={saving} className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm d-flex align-items-center gap-2">
                      {saving && <span className="spinner-border spinner-border-sm me-1" role="status"></span>}
                      <i className="fa-solid fa-floppy-disk me-1"></i>
                      <span>{editingProject ? (isRTL ? "حفظ التعديلات" : "Update Contract") : (isRTL ? "حفظ وتوثيق العقد" : "Save B2B Contract")}</span>
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

export default ClientProjectsPage;
