import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import adminApi from "../../services/adminApi";

const SettingsPage: React.FC = () => {
  const { currentLang } = useLanguage();
  const isRTL = currentLang === "ar";

  // Login Gate Protection State
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gatePassword, setGatePassword] = useState("fikriti01151721654");
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [gateSaving, setGateSaving] = useState(false);
  const [gateMessage, setGateMessage] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGateSettings = async () => {
      try {
        const res = await adminApi.getLoginGateSettings();
        const data = res.data;
        setGateEnabled(data.enabled);
        if (data.password) {
          setGatePassword(data.password);
        }
      } catch (err: any) {
        console.warn("Failed to fetch admin login gate settings, using local defaults.");
      }
    };
    fetchGateSettings();
  }, []);

  const handleSaveGateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateSaving(true);
    setGateMessage(null);
    setGateError(null);

    try {
      const res = await adminApi.updateLoginGateSettings({
        enabled: gateEnabled,
        password: gatePassword,
      });

      setGateMessage(res.data.message || (isRTL ? "تم حفظ إعدادات بوابة الدخول بنجاح!" : "Login gate settings saved successfully!"));
      // Reset passed status in session so new password applies
      sessionStorage.removeItem("login_gate_passed");
    } catch (err: any) {
      setGateError(err?.message || (isRTL ? "فشل حفظ الإعدادات" : "Failed to save settings"));
    } finally {
      setGateSaving(false);
    }
  };


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

          {/* Login Gate Access Security Card */}
          <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 8px", borderBottom: "1px solid #f1f3f4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
                  <i className="fa-solid fa-lock fs-5"></i>
                </div>
                <div>
                  <h5 style={{ fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    {isRTL ? "حماية صفحة تسجيل الدخول (Login Gate)" : "Login Gate Protection"}
                  </h5>
                  <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {isRTL ? "حماية صفحة الدخول بكلمة مرور أمنية خاصة قبل فتحها" : "Require password modal before opening login page"}
                  </small>
                </div>
              </div>
              <span className={`badge ${gateEnabled ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`} style={{ borderRadius: "20px", padding: "6px 14px", fontWeight: 700 }}>
                {gateEnabled ? (isRTL ? "مُفعّل" : "Enabled") : (isRTL ? "مُعطّل" : "Disabled")}
              </span>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {gateMessage && (
                <div className="alert alert-success d-flex align-items-center gap-2" style={{ borderRadius: "12px", fontSize: "0.9rem" }}>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>{gateMessage}</span>
                </div>
              )}

              {gateError && (
                <div className="alert alert-danger d-flex align-items-center gap-2" style={{ borderRadius: "12px", fontSize: "0.9rem" }}>
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{gateError}</span>
                </div>
              )}

              <form onSubmit={handleSaveGateSettings}>
                {/* Toggle Enable/Disable */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "14px 18px", borderRadius: "12px", marginBottom: "16px" }}>
                  <div>
                    <strong style={{ display: "block", color: "#1e293b", fontSize: "0.95rem" }}>
                      {isRTL ? "تفعيل كلمة مرور بوابة الدخول" : "Enable Login Gate Password"}
                    </strong>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      {isRTL ? "عند التفعيل، سيظهر مودال محمي يطلب رمز الدخول قبل رؤية نموذج اللوجن" : "Shows a security modal prompting for passcode before login form is accessible"}
                    </span>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={gateEnabled}
                      onChange={(e) => setGateEnabled(e.target.checked)}
                      style={{ width: "2.8rem", height: "1.4rem", cursor: "pointer" }}
                    />
                  </div>
                </div>

                {/* Password Setting Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6c757d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {isRTL ? "كلمة مرور البوابة (Gate Passcode)" : "Gate Access Passcode"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showGatePassword ? "text" : "password"}
                      value={gatePassword}
                      onChange={(e) => setGatePassword(e.target.value)}
                      placeholder="fikriti01151721654"
                      disabled={!gateEnabled}
                      style={{
                        width: "100%",
                        padding: "12px 48px 12px 16px",
                        borderRadius: "10px",
                        border: 0,
                        background: gateEnabled ? "#f8f9fa" : "#e2e8f0",
                        fontSize: "0.95rem",
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "monospace",
                        letterSpacing: showGatePassword ? "0.05em" : "0.15em",
                      }}
                      onFocus={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.boxShadow="0 0 0 2px rgba(14,165,233,0.3)"; }}
                      onBlur={e  => { e.currentTarget.style.background=gateEnabled ? "#f8f9fa" : "#e2e8f0"; e.currentTarget.style.boxShadow="none"; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowGatePassword(!showGatePassword)}
                      style={{
                        position: "absolute",
                        left: isRTL ? "14px" : "auto",
                        right: isRTL ? "auto" : "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                      title={showGatePassword ? "إخفاء" : "إظهار"}
                    >
                      <i className={`fa-solid ${showGatePassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  <small style={{ color: "#94a3b8", fontSize: "0.78rem", display: "block", marginTop: "6px" }}>
                    {isRTL ? "كلمة المرور الافتراضية: fikriti01151721654" : "Default Passcode: fikriti01151721654"}
                  </small>
                </div>

                <div style={{ textAlign: isRTL ? "left" : "right" }}>
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold shadow-sm"
                    disabled={gateSaving}
                    style={{ borderRadius: "20px", padding: "10px 32px", background: "#0284c7", borderColor: "#0284c7" }}
                  >
                    {gateSaving ? (isRTL ? "جاري الحفظ..." : "Saving...") : (isRTL ? "حفظ إعدادات البوابة" : "Save Gate Settings")}
                  </button>
                </div>
              </form>
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

          {/* Support CTA intentionally hidden: this area is not needed in the dashboard. */}
          {false && (
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
          )}
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
