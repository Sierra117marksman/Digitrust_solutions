"use client";

import Image from "next/image";
import { useState, useRef, useMemo, FormEvent } from "react";
import toast from "react-hot-toast";
import { logError } from "../../utils/logger";
import { useProgressiveValidation, ValidationResult, Severity } from "../../hooks/useProgressiveValidation";

type LoginState = {
  mode: "password" | "totp" | "setup";
  setupSecret?: string;
  otpAuthUrl?: string;
  qrCodeDataUrl?: string;
  message?: string;
  error?: string;
  loading: boolean;
};

export function LoginForm() {
  const [state, setState] = useState<LoginState>({
    mode: "password",
    loading: false,
  });

  const isSubmittingRef = useRef(false);

  const validators = useMemo(() => ({
    email: (val: string): ValidationResult => {
      const trimmed = val.trim().toLowerCase();
      if (!trimmed) return { isValid: false, severity: "error", message: "Email is required.", value: trimmed };
      if (trimmed.includes("@gmial.com") || trimmed.includes("@gmai.com")) {
        return { isValid: true, severity: "warning", message: "Did you mean @gmail.com?", value: trimmed };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return { isValid: false, severity: "error", message: "Enter a valid email.", value: trimmed };
      return { isValid: true, severity: "success", message: "", value: trimmed };
    },
    password: (val: string): ValidationResult => {
      if (!val) return { isValid: false, severity: "error", message: "Password is required." };
      if (val.length < 8) return { isValid: false, severity: "error", message: "Password must be at least 8 characters." };
      return { isValid: true, severity: "success", message: "" };
    },
    token: (val: string): ValidationResult => {
      const digits = val.replace(/\D/g, "");
      if (!digits) return { isValid: false, severity: "error", message: "Code is required.", value: digits };
      if (digits.length !== 6) return { isValid: false, severity: "error", message: "Code must be 6 digits.", value: digits };
      return { isValid: true, severity: "success", message: "", value: digits };
    }
  }), []);

  const { fields, handleChange, handleBlur, validateAll, handleKeyDown } = useProgressiveValidation({
    email: "",
    password: "",
    token: "",
  }, validators);

  function getInputClass(severity: Severity) {
    if (severity === "neutral" || severity === "info") return "";
    return `input-${severity}`;
  }

  async function submitLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    
    // Only validate fields relevant to the current mode
    validateAll();
    
    const isEmailValid = validators.email(fields.email.value).isValid;
    const isPasswordValid = validators.password(fields.password.value).isValid;
    const isTokenValid = state.mode === "totp" ? validators.token(fields.token.value).isValid : true;

    if (!isEmailValid || !isPasswordValid || !isTokenValid) {
      // Focus first error
      const errField = !isEmailValid ? "email" : !isPasswordValid ? "password" : "token";
      const input = document.querySelector(`[name="${errField}"]`) as HTMLElement;
      input?.focus();
      return;
    }

    isSubmittingRef.current = true;
    setState((current) => ({ ...current, loading: true, error: undefined, message: undefined }));
    const loadingToast = toast.loading(state.mode === "totp" ? "Verifying Code..." : "Checking...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email.value, password: fields.password.value, token: fields.token.value }),
      });
      const result = await response.json();

      if (response.ok && result.redirectTo) {
        toast.success("Success", { id: loadingToast });
        window.location.href = result.redirectTo;
        return; // don't unlock ref, we are redirecting
      }

      toast.dismiss(loadingToast);

      if (result.setupRequired) {
        setState({
          mode: "setup",
          setupSecret: result.setupSecret,
          otpAuthUrl: result.otpAuthUrl,
          qrCodeDataUrl: result.qrCodeDataUrl,
          message: result.message,
          loading: false,
        });
        if (result.message) toast.success(result.message);
        isSubmittingRef.current = false;
        return;
      }

      if (result.totpRequired) {
        setState({
          mode: "totp",
          message: result.message,
          loading: false,
        });
        if (result.message) toast.success(result.message);
        isSubmittingRef.current = false;
        return;
      }

      setState((current) => ({
        ...current,
        loading: false,
        error: result.message || "Login failed.",
      }));
      toast.error(result.message || "Login failed.");
      isSubmittingRef.current = false;
    } catch (error) {
      logError("submitLogin", error);
      toast.error("Network error. Please try again.", { id: loadingToast });
      setState((current) => ({ ...current, loading: false }));
      isSubmittingRef.current = false;
    }
  }

  async function submitSetup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    
    if (!validators.token(fields.token.value).isValid) {
      validateAll();
      const input = document.querySelector(`[name="token"]`) as HTMLElement;
      input?.focus();
      return;
    }
    
    isSubmittingRef.current = true;
    setState((current) => ({ ...current, loading: true, error: undefined, message: undefined }));
    const loadingToast = toast.loading("Verifying Code...");

    try {
      const response = await fetch("/api/admin/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fields.token.value }),
      });
      const result = await response.json();

      if (response.ok && result.redirectTo) {
        toast.success("Authenticator enabled!", { id: loadingToast });
        window.location.href = result.redirectTo;
        return; // don't unlock
      }

      toast.error(result.message || "Authenticator setup failed.", { id: loadingToast });
      setState((current) => ({
        ...current,
        loading: false,
        error: result.message || "Authenticator setup failed.",
      }));
      isSubmittingRef.current = false;
    } catch (error) {
      logError("submitSetup", error);
      toast.error("Network error. Please try again.", { id: loadingToast });
      setState((current) => ({ ...current, loading: false }));
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="admin-login-panel">
      <div>
        <p className="admin-kicker">Digitrust CRM</p>
        <h1>Admin Login</h1>
        <p className="admin-muted">
          Sign in with your admin password, then confirm the 6 digit code from Google Authenticator.
        </p>
      </div>

      {state.mode === "setup" ? (
        <form onSubmit={submitSetup} className="admin-form" noValidate>
          <fieldset disabled={state.loading} style={{ all: "unset", display: "contents" }}>
            <div className="setup-box">
              <span>Scan QR code</span>
              {state.qrCodeDataUrl && (
                <Image
                  className="auth-qr-code"
                  src={state.qrCodeDataUrl}
                  alt="Google Authenticator setup QR code"
                  width={220}
                  height={220}
                  unoptimized
                />
              )}
              <p>Open Google Authenticator, tap add account, and scan this QR code.</p>
            </div>
            <div className="setup-box setup-key-box">
              <span>Manual setup key</span>
              <strong>{state.setupSecret}</strong>
              <p>If scan does not work, choose setup key and enter this manually.</p>
            </div>
            <label>
              <span>6 digit code</span>
              <input 
                name="token" 
                inputMode="numeric" 
                autoComplete="one-time-code" 
                maxLength={6} 
                value={fields.token.value}
                onChange={(e) => handleChange("token", e.target.value)}
                onBlur={() => handleBlur("token")}
                onKeyDown={handleKeyDown}
                className={`form-input ${getInputClass(fields.token.severity)}`}
                aria-invalid={fields.token.severity === "error"}
                aria-describedby={fields.token.message ? "token-feedback" : undefined}
              />
              {fields.token.message && fields.token.touched && (
                <span id="token-feedback" className={`field-feedback ${fields.token.severity}`} role="alert">{fields.token.message}</span>
              )}
            </label>
            <button className="admin-primary-button" disabled={state.loading}>
              {state.loading ? "Verifying..." : "Enable Authenticator"}
            </button>
          </fieldset>
        </form>
      ) : (
        <form onSubmit={submitLogin} className="admin-form" noValidate>
          <fieldset disabled={state.loading} style={{ all: "unset", display: "contents" }}>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                onKeyDown={handleKeyDown}
                className={`form-input ${getInputClass(fields.email.severity)}`}
                aria-invalid={fields.email.severity === "error"}
                aria-describedby={fields.email.message ? "email-feedback" : undefined}
              />
              {fields.email.message && fields.email.touched && (
                <span id="email-feedback" className={`field-feedback ${fields.email.severity}`} role="alert">{fields.email.message}</span>
              )}
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={fields.password.value}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                onKeyDown={handleKeyDown}
                className={`form-input ${getInputClass(fields.password.severity)}`}
                aria-invalid={fields.password.severity === "error"}
                aria-describedby={fields.password.message ? "password-feedback" : undefined}
              />
              {fields.password.message && fields.password.touched && (
                <span id="password-feedback" className={`field-feedback ${fields.password.severity}`} role="alert">{fields.password.message}</span>
              )}
            </label>
            {state.mode === "totp" && (
              <label>
                <span>Authenticator code</span>
                <input 
                  name="token" 
                  inputMode="numeric" 
                  autoComplete="one-time-code" 
                  maxLength={6}
                  value={fields.token.value}
                  onChange={(e) => handleChange("token", e.target.value)}
                  onBlur={() => handleBlur("token")}
                  onKeyDown={handleKeyDown}
                  className={`form-input ${getInputClass(fields.token.severity)}`}
                  aria-invalid={fields.token.severity === "error"}
                  aria-describedby={fields.token.message ? "token-feedback" : undefined}
                />
                {fields.token.message && fields.token.touched && (
                  <span id="token-feedback" className={`field-feedback ${fields.token.severity}`} role="alert">{fields.token.message}</span>
                )}
              </label>
            )}
            <button className="admin-primary-button" disabled={state.loading}>
              {state.loading ? "Checking..." : state.mode === "totp" ? "Verify Code" : "Continue"}
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
}
