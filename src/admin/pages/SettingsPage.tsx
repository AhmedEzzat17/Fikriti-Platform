import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const SettingsPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  const toggles = [
    { label: isRTL ? "الوضع الداكن"      : "Dark Mode",         checked: false },
    { label: isRTL ? "إشعارات البريد"   : "Email Notifications", checked: true  },
    { label: isRTL ? "وضع الصيانة"       : "Maintenance Mode",   checked: false },
    { label: isRTL ? "تحليلات قوقل"     : "Google Analytics",    checked: true  },
  ];

  return (
    <div style={{ width: "100%", paddingBottom: "3rem" }}>

      {/* ── Page header ────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
          {isRTL ? "الإعدادات" : "Settings"}
        </h4>
        <p style={{ color: "#6c757d", fontSize: "0.875rem", margin: 0 }}>
          {isRTL
            ? "تخصيص الموقع ولوحة التحكم وإدارة الصلاحيات"
            : "Site and dashboard customization and access management"}
        </p>
      </div>

      {/* ── Two-column layout: forms | sidebar ─────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>

        {/* LEFT: forms (takes ~70%) */}
        <div style={{ flex: "1 1 400px", minWidth: "300px" }}>

          {/* General Settings card */}
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 8px", borderBottom: "1px solid #f1f3f4", display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="bg-primary-subtle text-primary" style={{ width: 40, height: 40, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fa-solid fa-sliders fs-5"></i>
              </div>
              <h5 style={{ fontWeight: 700, margin: 0, color: "#0d83fd" }}>
                {isRTL ? "الإعدادات العامة" : "General Settings"}
              </h5>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {/* Row 1: site name + email */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {isRTL ? "اسم الموقع" : "Site Name"}
                  </label>
                  <input type="text" defaultValue="Fikriti"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                    onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {isRTL ? "البريد الإلكتروني" : "Contact Email"}
                  </label>
                  <input type="email" defaultValue="info@fikriti.com"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                    onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                  />
                </div>
              </div>

              {/* Row 2: description */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  {isRTL ? "وصف الموقع" : "Site Description"}
                </label>
                <textarea rows={4} defaultValue="Professional software solutions tailored for your business needs."
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                  onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                />
              </div>

              {/* Row 3: whatsapp + phone */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {isRTL ? "رابط واتساب" : "WhatsApp Link"}
                  </label>
                  <input type="text" defaultValue="https://wa.me/20123456789"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                    onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                  />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {isRTL ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input type="text" defaultValue="+20123456789"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                    onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                  />
                </div>
              </div>

              <div style={{ textAlign: isRTL ? "left" : "right" }}>
                <button className="btn btn-primary fw-bold shadow-sm" style={{ borderRadius: "20px", padding: "10px 32px" }}>
                  {isRTL ? "حفظ التغييرات" : "Save Settings"}
                </button>
              </div>
            </div>
          </div>

          {/* Security / Password card */}
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 8px", borderBottom: "1px solid #f1f3f4", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f3f4" }}>
                <i className="fa-solid fa-shield-halved fs-5 text-dark"></i>
              </div>
              <h5 style={{ fontWeight: 700, margin: 0, color: "#1a1a2e" }}>
                {isRTL ? "الأمان وكلمة المرور" : "Security & Password"}
              </h5>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: isRTL ? "كلمة المرور الحالية" : "Current Password" },
                  { label: isRTL ? "كلمة المرور الجديدة" : "New Password"      },
                  { label: isRTL ? "تأكيد كلمة المرور"   : "Confirm Password"  },
                ].map((f, i) => (
                  <div key={i} style={{ flex: "1 1 160px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      {f.label}
                    </label>
                    <input type="password" placeholder="••••••••"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: 0, background: "#f8f9fa", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                      onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(13,131,253,0.25)"; }}
                      onBlur={e  => { e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.boxShadow="none"; }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: isRTL ? "left" : "right" }}>
                <button className="btn btn-dark fw-bold shadow-sm" style={{ borderRadius: "20px", padding: "10px 32px" }}>
                  {isRTL ? "تحديث كلمة المرور" : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: sidebar (takes ~30%) */}
        <div style={{ flex: "0 0 280px", minWidth: "240px" }}>

          {/* Appearance toggles */}
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <h6 style={{ fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b" }}>
              <i className="fa-solid fa-palette"></i>
              {isRTL ? "تخصيص المظهر" : "Appearance"}
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {toggles.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8f9fa", borderRadius: "10px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a1a2e" }}>{item.label}</span>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" role="switch" defaultChecked={item.checked}
                      style={{ width: "2.4rem", height: "1.2rem", cursor: "pointer" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support CTA */}
          <div style={{ borderRadius: "16px", padding: "24px", background: "linear-gradient(135deg, #0d83fd 0%, #4facfe 100%)", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(13,131,253,0.3)" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Technical Support</h6>
              <p style={{ fontSize: "0.78rem", opacity: 0.8, marginBottom: "16px" }}>
                {isRTL ? "فريقنا متاح 24/7 للمساعدة." : "Our team is available 24/7 to help you."}
              </p>
              <button className="btn btn-white btn-sm fw-bold w-100 text-primary shadow-sm" style={{ borderRadius: "20px", padding: "8px" }}>
                {isRTL ? "تواصل معنا" : "Contact Now"}
              </button>
            </div>
            <i className="fa-solid fa-headset" style={{ position: "absolute", bottom: "-20px", right: "-20px", fontSize: "130px", opacity: 0.1 }}></i>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
