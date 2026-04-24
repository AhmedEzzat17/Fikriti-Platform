import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";

const MessagesPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const [messages, setMessages] = useState([
    { id: 1, name: "Ahmed Ezzat",    email: "ahmed@example.com",  phone: "+201012345678", message: "أريد الاستفسار عن تكلفة تصميم متجر إلكتروني متكامل.", date: "2026-04-20 14:30", status: "unread" },
    { id: 2, name: "Sara Ali",       email: "sara@example.com",   phone: "+201112223334", message: "Hello, do you provide mobile app development services?",          date: "2026-04-21 10:15", status: "read"   },
    { id: 3, name: "Khaled Mohamed", email: "khaled@example.com", phone: "+201556677889", message: "نحن شركة ناشئة ونريد تطوير نظام لإدارة الموارد.",               date: "2026-04-22 16:45", status: "read"   },
  ]);

  const columns = [
    { 
      key: "name", 
      label: isRTL ? "المرسل" : "Sender",
      render: (row: any) => (
        <div>
          <div className="fw-bold text-dark">{row.name}</div>
          <div className="text-muted small">{row.email}</div>
        </div>
      )
    },
    { key: "phone", label: isRTL ? "رقم الهاتف" : "Phone" },
    { key: "date", label: isRTL ? "التاريخ" : "Date" },
    { 
      key: "status", 
      label: isRTL ? "الحالة" : "Status",
      render: (row: any) => (
        <span className={`badge rounded-pill px-3 py-2 smaller ${row.status === "unread" ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}>
          {row.status === "unread" ? (isRTL ? "جديد" : "New") : (isRTL ? "مقروء" : "Read")}
        </span>
      )
    },
  ];

  const handleView = (message: any) => {
    setSelectedMessage(message);
  };

  const handleDelete = (message: any) => {
    if (window.confirm(isRTL ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?"))
      setMessages(prev => prev.filter(m => m.id !== message.id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="">
      <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">{isRTL ? "الرسائل" : "Messages Inbox"}</h4>
          <p className="text-muted small fw-medium">{isRTL ? "إدارة رسائل تواصل معنا" : "Manage incoming inquiries"}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2 fw-bold shadow-sm"
        >
          <i className="fa-solid fa-print"></i>
          <span>{isRTL ? "طباعة" : "Print"}</span>
        </button>
      </div>

      <DataTable 
        title={isRTL ? "صندوق الوارد" : "Inbox"} 
        columns={columns} 
        data={messages} 
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-primary text-white p-4 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                    <i className="fa-solid fa-envelope fs-4"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">{selectedMessage.name}</h5>
                    <span className="small opacity-75">{selectedMessage.date}</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedMessage(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="text-muted smaller uppercase fw-bold d-block mb-1">{isRTL ? "البريد الإلكتروني" : "Email Address"}</label>
                        <p className="fw-bold mb-0">{selectedMessage.email}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted smaller uppercase fw-bold d-block mb-1">{isRTL ? "رقم الهاتف" : "Phone Number"}</label>
                        <p className="fw-bold mb-0">{selectedMessage.phone}</p>
                      </div>
                    </div>
                    <hr className="opacity-10" />
                    <div className="mt-4">
                      <label className="text-muted smaller uppercase fw-bold d-block mb-2">{isRTL ? "نص الرسالة" : "Message Content"}</label>
                      <div className="p-4 bg-white rounded-4 border border-light-subtle" style={{ minHeight: "150px", fontSize: "1.1rem", lineHeight: "1.8" }}>
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => {
                      const printContent = document.querySelector('.modal-body')?.innerHTML;
                      const originalContent = document.body.innerHTML;
                      document.body.innerHTML = printContent || "";
                      window.print();
                      document.body.innerHTML = originalContent;
                      window.location.reload();
                    }} 
                    className="btn btn-dark rounded-pill px-4 d-flex align-items-center gap-2"
                  >
                    <i className="fa-solid fa-print"></i>
                    <span>{isRTL ? "طباعة هذه الرسالة" : "Print this message"}</span>
                  </button>
                  <button type="button" className="btn btn-primary rounded-pill px-5" onClick={() => setSelectedMessage(null)}>
                    {isRTL ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .navbar, aside, header, .btn, .card-header, th:last-child, td:last-child {
            display: none !important;
          }
          .card { border: 0 !important; box-shadow: none !important; }
          .container-fluid { padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
