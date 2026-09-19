import React, { useState } from "react";
import apiClient from "../api/client";
import "./LoginGateModal.css";

interface LoginGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const LoginGateModal: React.FC<LoginGateModalProps> = ({ isOpen, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("يرجى إدخال كلمة مرور البوابة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ success: boolean; message: string }>("/auth/login-gate/verify", {
        password: password.trim(),
      });

      if (response.success) {
        sessionStorage.setItem("login_gate_passed", "true");
        onSuccess();
      } else {
        setError(response.message || "كلمة مرور البوابة غير صحيحة");
      }
    } catch (err: any) {
      // Offline / dev fallback check for initial default password
      if (password.trim() === "fikriti01151721654") {
        sessionStorage.setItem("login_gate_passed", "true");
        onSuccess();
        return;
      }

      setError(err?.message || "كلمة مرور البوابة غير صحيحة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-gate-overlay">
      <div className="login-gate-card">
        <div className="login-gate-glow" />

        {/* Security Shield Icon */}
        <div className="login-gate-icon-wrapper">
          <div className="login-gate-pulse-ring" />
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="login-gate-title">بوابة الوصول المحمية</h3>
        <p className="login-gate-subtitle">
          هذه الصفحة محمية بكلمة مرور أمنية فائقة. يرجى إدخال رمز البوابة للمتابعة.
        </p>

        {error && (
          <div className="login-gate-error">
            <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-gate-input-group">
            {/* Lock Icon */}
            <svg className="login-gate-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
            </svg>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="أدخل كلمة مرور البوابة..."
              className="login-gate-input"
              autoFocus
            />

            <button
              type="button"
              className="login-gate-toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.68-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.158-6.158a3 3 0 104.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                </svg>
              ) : (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" className="login-gate-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="login-gate-spinner" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <span>تأكيد وفتح البوابة</span>
                <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginGateModal;
