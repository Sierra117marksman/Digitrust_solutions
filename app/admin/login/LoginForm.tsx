"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { logError } from "../../utils/logger";

type LoginState = {
  mode: "password" | "totp" | "setup";
  email: string;
  password: string;
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
    email: "",
    password: "",
    loading: false,
  });

  const isSubmittingRef = useRef(false);

  async function submitLogin(formData: FormData) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const email = String(formData.get("email") || state.email);
    const password = String(formData.get("password") || state.password);
    const token = String(formData.get("token") || "");

    setState((current) => ({ ...current, loading: true, error: undefined, message: undefined }));
    const loadingToast = toast.loading(state.mode === "totp" ? "Verifying Code..." : "Checking...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
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
          email,
          password,
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
          email,
          password,
          message: result.message,
          loading: false,
        });
        if (result.message) toast.success(result.message);
        isSubmittingRef.current = false;
        return;
      }

      setState((current) => ({
        ...current,
        email,
        password,
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

  async function submitSetup(formData: FormData) {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const token = String(formData.get("token") || "");
    setState((current) => ({ ...current, loading: true, error: undefined, message: undefined }));
    const loadingToast = toast.loading("Verifying Code...");

    try {
      const response = await fetch("/api/admin/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
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
        <form action={submitSetup} className="admin-form">
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
              <input name="token" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required />
            </label>
            <button className="admin-primary-button" disabled={state.loading}>
              {state.loading ? "Verifying..." : "Enable Authenticator"}
            </button>
          </fieldset>
        </form>
      ) : (
        <form action={submitLogin} className="admin-form">
          <fieldset disabled={state.loading} style={{ all: "unset", display: "contents" }}>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                defaultValue={state.password}
                required
              />
            </label>
            {state.mode === "totp" && (
              <label>
                <span>Authenticator code</span>
                <input name="token" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required />
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
