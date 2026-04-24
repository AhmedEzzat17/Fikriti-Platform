import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  isLoading,
}) => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="card border shadow-sm rounded-3 overflow-hidden bg-white">
      <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h5 className="mb-0 fw-bold text-dark">{title}</h5>
          <span className="smaller text-muted fw-medium">{filteredData.length} records found</span>
        </div>
        
        <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-md-end" style={{ maxWidth: "500px" }}>
          {/* Search Bar */}
          <div className="input-group input-group-sm flex-nowrap shadow-xs rounded-pill overflow-hidden border">
            <span className="input-group-text bg-light border-0 px-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 bg-light py-2 px-2" 
              placeholder={isRTL ? "بحث..." : "Search..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0 transition-all flex-shrink-0"
              style={{ fontSize: "0.85rem" }}
            >
              <i className="fa-solid fa-plus"></i>
              <span className="fw-bold d-none d-sm-inline">{isRTL ? "إضافة" : "Add"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light text-muted fw-bold">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 border-0 smaller text-uppercase letter-spacing-1">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 border-0 text-center smaller text-uppercase letter-spacing-1">
                    {isRTL ? "الإجراءات" : "Actions"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={idx} className="transition-all border-bottom border-light hover-row">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-dark small fw-medium">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex justify-content-center gap-1">
                          {onView && (
                            <button onClick={() => onView(row)} className="btn btn-icon text-primary"><i className="fa-solid fa-eye"></i></button>
                          )}
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="btn btn-icon text-warning"><i className="fa-solid fa-pen"></i></button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="btn btn-icon text-danger"><i className="fa-solid fa-trash-can"></i></button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <p className="text-muted mb-0 small fw-medium">{isRTL ? "لا توجد نتائج مطابقة" : "No matching results found"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .smaller { font-size: 0.75rem; }
        .letter-spacing-1 { letter-spacing: 0.5px; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .btn-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          border-radius: 6px;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .btn-icon:hover { background: #f8f9fa; transform: scale(1.1); }
        .hover-row:hover { background-color: #fcfdfe; }
        .input-group:focus-within { border-color: #0d83fd !important; ring: 2px solid rgba(13, 131, 253, 0.1); }
      `}</style>
    </div>
  );
};

export default DataTable;
