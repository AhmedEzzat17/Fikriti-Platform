import React, { useState, useEffect } from "react";
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
  headerControls?: React.ReactNode;
  addLabel?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  headerControls,
  addLabel,
}) => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val !== null &&
        val !== undefined &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Reset page when search term changes or data shrinks below page limit
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div 
      className="card admin-card no-hover-scale border shadow-sm rounded-4 overflow-hidden bg-white mb-4" 
      style={{ transform: "none", transition: "none", height: "auto" }}
    >
      {/* ── Table Header / Controls ── */}
      <div className="card-header bg-white border-bottom border-light py-3 px-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div>
            <h5 className="mb-1 fw-bold text-dark">{title}</h5>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small px-2 py-1">
              {isRTL ? `إجمالي السجلات: ${totalRecords}` : `${totalRecords} Records Found`}
            </span>
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-3 flex-wrap flex-grow-1 justify-content-md-end">
          {/* Search Box */}
          <div className="input-group input-group-sm flex-nowrap shadow-xs rounded-pill overflow-hidden border bg-light" style={{ maxWidth: "320px", minWidth: "220px" }}>
            <span className="input-group-text bg-transparent border-0 px-3">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent py-2 shadow-none small fw-medium" 
              placeholder={isRTL ? "البحث برقم، أسم أو تفصيل..." : "Quick Search..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="btn btn-link border-0 text-muted px-2 shadow-none" onClick={() => setSearchTerm("")}>
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>

          {/* Custom Header Controls (e.g. Status Select Dropdown) */}
          {headerControls}

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0 transition-all flex-shrink-0 add-action-btn"
              style={{ background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)", fontSize: "0.9rem" }}
            >
              <i className="fa-solid fa-plus-circle fs-6"></i>
              <span className="fw-bold">{addLabel || (isRTL ? "إضافة عنصر جديد" : "Add New Record")}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Table Body ── */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table admin-table align-middle mb-0" style={{ transform: "none" }}>
            <thead className="bg-light text-muted fw-bold">
              <tr style={{ transform: "none" }}>
                <th className="px-4 py-3 border-bottom text-muted small fw-bolder text-uppercase letter-spacing-1" style={{ width: "50px" }}>#</th>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 border-bottom text-muted small fw-bolder text-uppercase letter-spacing-1">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 border-bottom text-muted small fw-bolder text-uppercase letter-spacing-1 text-end">
                    {isRTL ? "لوحة الإجراءات" : "Actions"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-5">
                    <div className="py-4">
                      <div className="spinner-border text-primary me-2" role="status" style={{ width: "2rem", height: "2rem" }}></div>
                      <div className="text-muted small mt-2 fw-medium">{isRTL ? "جاري تحميل البيانات الحية من السيرفر..." : "Loading records from live server..."}</div>
                    </div>
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((row, idx) => {
                  const rowNumber = indexOfFirstItem + idx + 1;
                  return (
                    <tr key={row.id || idx} className="border-bottom border-light hover-row" style={{ transform: "none" }}>
                      <td className="px-4 py-3 text-muted small fw-bold">
                        {rowNumber}
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-dark small">
                          {col.render ? col.render(row) : row[col.key] || <span className="text-muted opacity-50">—</span>}
                        </td>
                      ))}
                      {(onEdit || onDelete || onView) && (
                        <td className="px-4 py-3 text-end">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            {onView && (
                              <button 
                                onClick={() => onView(row)} 
                                className="btn btn-sm btn-light border rounded-circle text-primary action-icon-btn shadow-xs"
                                title={isRTL ? "عرض التفاصيل" : "View Details"}
                              >
                                <i className="fa-regular fa-eye"></i>
                              </button>
                            )}
                            {onEdit && (
                              <button 
                                onClick={() => onEdit(row)} 
                                className="btn btn-sm btn-light border rounded-circle text-warning action-icon-btn shadow-xs"
                                title={isRTL ? "تعديل البيانات" : "Edit Record"}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            )}
                            {onDelete && (
                              <button 
                                onClick={() => onDelete(row)} 
                                className="btn btn-sm btn-light border rounded-circle text-danger action-icon-btn shadow-xs"
                                title={isRTL ? "حذف السجل" : "Delete Record"}
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center py-5">
                    <div className="py-4">
                      <div className="text-muted mb-2"><i className="fa-solid fa-folder-open fs-2 opacity-25"></i></div>
                      <p className="text-muted mb-0 small fw-bold">{isRTL ? "لا توجد سجلات متطابقة مع البحث الحالي" : "No matching records found"}</p>
                      {searchTerm && (
                        <button className="btn btn-link btn-sm text-primary mt-2 text-decoration-none" onClick={() => setSearchTerm("")}>
                          {isRTL ? "إعادة ضبط البحث" : "Clear search results"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Table Footer / Pagination ── */}
      <div className="card-footer bg-white border-top py-3 px-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-medium">{isRTL ? "عرض:" : "Show:"}</span>
            <select 
              className="form-select form-select-sm rounded-pill border py-1 shadow-none bg-light small fw-bold" 
              style={{ width: "75px" }}
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="small text-muted fw-medium">{isRTL ? "لكل صفحة" : "per page"}</span>
          </div>
          <span className="text-muted d-none d-md-inline">|</span>
          <span className="small text-muted fw-medium">
            {totalRecords > 0 ? (
              isRTL 
                ? `عرض السجلات من ${indexOfFirstItem + 1} إلى ${Math.min(indexOfLastItem, totalRecords)} من إجمالي ${totalRecords}`
                : `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, totalRecords)} of ${totalRecords} entries`
            ) : (
              isRTL ? "صفر سجلات" : "0 entries"
            )}
          </span>
        </div>

        {/* Pagination Pills */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm mb-0 gap-1 d-flex align-items-center">
              {/* Previous Button */}
              <li className={`page-item ${currentPage === 1 ? "disabled opacity-50" : ""}`}>
                <button 
                  className="page-link rounded-pill border px-3 text-dark fw-medium shadow-xs" 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className={`fa-solid ${isRTL ? "fa-chevron-right" : "fa-chevron-left"} me-1`}></i>
                  <span className="d-none d-sm-inline">{isRTL ? "السابق" : "Prev"}</span>
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                // Show first, last, and neighbors of current page
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <li key={number} className="page-item">
                      <button
                        onClick={() => paginate(number)}
                        className={`page-link rounded-circle border-0 d-flex align-items-center justify-content-center fw-bold transition-all ${
                          currentPage === number
                            ? "bg-primary text-white shadow-sm"
                            : "bg-transparent text-dark hover-bg-light"
                        }`}
                        style={{ width: "34px", height: "34px" }}
                      >
                        {number}
                      </button>
                    </li>
                  );
                } else if (
                  number === currentPage - 2 ||
                  number === currentPage + 2
                ) {
                  return (
                    <li key={number} className="page-item disabled">
                      <span className="page-link bg-transparent border-0 text-muted">...</span>
                    </li>
                  );
                }
                return null;
              })}

              {/* Next Button */}
              <li className={`page-item ${currentPage === totalPages ? "disabled opacity-50" : ""}`}>
                <button 
                  className="page-link rounded-pill border px-3 text-dark fw-medium shadow-xs" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="d-none d-sm-inline">{isRTL ? "التالي" : "Next"}</span>
                  <i className={`fa-solid ${isRTL ? "fa-chevron-left" : "fa-chevron-right"} ms-1`}></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <style>{`
        .admin-card { transform: none !important; transition: none !important; }
        .admin-table { transform: none !important; transition: none !important; }
        .admin-table th { white-space: nowrap; vertical-align: middle; background-color: #f8fafc; }
        .admin-table td { vertical-align: middle; line-height: 1.45; }
        .admin-table th:first-child,
        .admin-table td:first-child { width: 56px; }
        .admin-table td:last-child { white-space: nowrap; }
        .letter-spacing-1 { letter-spacing: 0.5px; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .hover-row {
          transition: background-color 0.2s ease;
          background-color: #ffffff;
        }
        .hover-row:hover {
          background-color: #f8fafd !important;
        }
        .action-icon-btn {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
          background-color: #f8f9fa;
          border-color: #dee2e6 !important;
        }
        .action-icon-btn:hover {
          background-color: #e9ecef !important;
          color: #000 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .add-action-btn:hover {
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3) !important;
          opacity: 0.95;
        }
        .page-link:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }
        .hover-bg-light:hover {
          background-color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
};

export default DataTable;
