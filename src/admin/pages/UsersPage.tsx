import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { useLanguage } from "../../context/LanguageContext";

const UsersPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState([
    { id: 1, name: "Admin User",    email: "admin@fikriti.com", role: "Super Admin", joinDate: "2026-01-01" },
    { id: 2, name: "Ahmed Manager", email: "ahmed@fikriti.com", role: "Manager",     joinDate: "2026-02-15" },
    { id: 3, name: "Sara Editor",   email: "sara@fikriti.com",  role: "Editor",      joinDate: "2026-03-10" },
  ]);

  const columns = [
    { 
      key: "name", 
      label: isRTL ? "المستخدم" : "User",
      render: (row: any) => (
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "40px", height: "40px" }}>
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="fw-bold text-dark">{row.name}</div>
            <div className="text-muted small">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      label: isRTL ? "الصلاحية" : "Role",
      render: (row: any) => (
        <span className={`badge rounded-pill px-3 py-2 smaller ${row.role === "Super Admin" ? "bg-dark text-white" : "bg-light text-dark border"}`}>
          {row.role}
        </span>
      )
    },
    { key: "joinDate", label: isRTL ? "تاريخ الانضمام" : "Join Date" },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (user: any) => {
    if (window.confirm(isRTL ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?"))
      setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  return (
    <div className="">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">{isRTL ? "المستخدمين" : "Users Management"}</h4>
        <p className="text-muted small fw-medium">{isRTL ? "إدارة صلاحيات الوصول والمشرفين" : "Manage access and administrators"}</p>
      </div>

      <DataTable 
        title={isRTL ? "قائمة المستخدمين" : "User List"} 
        columns={columns} 
        data={users} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal Placeholder */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(13, 27, 42, 0.6)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 p-4 bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {selectedUser 
                    ? (isRTL ? "تعديل مستخدم" : "Edit User") 
                    : (isRTL ? "إضافة مستخدم جديد" : "Add New User")}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4 bg-light bg-opacity-50">
                <form>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted uppercase mb-2">{isRTL ? "الاسم الكامل" : "Full Name"}</label>
                    <input type="text" className="form-control rounded-3 border-0 shadow-sm p-3" defaultValue={selectedUser?.name} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted uppercase mb-2">{isRTL ? "البريد الإلكتروني" : "Email"}</label>
                    <input type="email" className="form-control rounded-3 border-0 shadow-sm p-3" defaultValue={selectedUser?.email} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted uppercase mb-2">{isRTL ? "الصلاحية" : "Role"}</label>
                    <select className="form-select rounded-3 border-0 shadow-sm p-3" defaultValue={selectedUser?.role}>
                      <option>Super Admin</option>
                      <option>Manager</option>
                      <option>Editor</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end gap-3 mt-4 pt-2">
                    <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold text-muted" onClick={() => setShowModal(false)}>
                      {isRTL ? "إلغاء" : "Cancel"}
                    </button>
                    <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm border-0" style={{ background: "linear-gradient(45deg, #0d83fd, #52aeff)" }}>
                      {isRTL ? "حفظ" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
