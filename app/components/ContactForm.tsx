"use client";

import { FormEvent, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { logError } from "../utils/logger";
import { useProgressiveValidation, ValidationResult, Severity } from "../hooks/useProgressiveValidation";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  services,
  defaultService = "",
}: {
  services: string[];
  defaultService?: string;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const isSubmittingRef = useRef(false);

  const validators = useMemo(() => {
    return {
      name: (val: string): ValidationResult => {
        const trimmed = val.trim();
        if (!trimmed) return { isValid: false, severity: "error", message: "Name is required." };
        if (/\d/.test(trimmed)) return { isValid: true, severity: "warning", message: "Names usually don't contain numbers.", value: trimmed };
        return { isValid: true, severity: "neutral", message: "", value: trimmed };
      },
      company: (val: string): ValidationResult => {
        const trimmed = val.trim();
        return { isValid: true, severity: "neutral", message: "", value: trimmed };
      },
      email: (val: string): ValidationResult => {
        const trimmed = val.trim().toLowerCase();
        if (!trimmed) return { isValid: false, severity: "error", message: "Email is required.", value: trimmed };
        if (trimmed.includes("@gmial.com") || trimmed.includes("@gmai.com")) {
          return { isValid: true, severity: "warning", message: "Did you mean @gmail.com?", value: trimmed };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) return { isValid: false, severity: "error", message: "Enter a valid email address. Example: name@company.com", value: trimmed };
        return { isValid: true, severity: "success", message: "", value: trimmed };
      },
      phone: (val: string): ValidationResult => {
        const digits = val.replace(/\D/g, "");
        if (!digits) return { isValid: false, severity: "error", message: "Phone number is required.", value: digits };
        if (digits.length < 10) return { isValid: false, severity: "error", message: "Looks too short. Enter a 10-digit mobile number.", value: digits };
        return { isValid: true, severity: "success", message: "", value: digits };
      },
      service: (val: string): ValidationResult => {
        if (!val) return { isValid: false, severity: "error", message: "Please select a service." };
        return { isValid: true, severity: "neutral", message: "" };
      },
      message: (val: string): ValidationResult => {
        const len = val.trim().length;
        if (len === 0) return { isValid: false, severity: "error", message: "Tell us what you would like to achieve." };
        if (len < 10) return { isValid: true, severity: "info", message: "Good start." };
        if (len < 50) return { isValid: true, severity: "info", message: "Great! Mention any deadlines or requirements." };
        if (len < 100) return { isValid: true, severity: "info", message: "Adding your budget helps us recommend the right solution." };
        return { isValid: true, severity: "info", message: "✓ We have enough information to estimate your project." };
      }
    };
  }, []);

  const { fields, handleChange, handleBlur, validateAll, handleKeyDown, setFields } = useProgressiveValidation({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: defaultService,
    message: ""
  }, validators);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    
    const { isValid, firstInvalidField } = validateAll();
    
    if (!isValid) {
      if (firstInvalidField) {
        const input = document.querySelector(`[name="${firstInvalidField}"]`) as HTMLElement;
        input?.focus();
      }
      return;
    }
    
    isSubmittingRef.current = true;
    setStatus("submitting");

    const payload = {
      name: fields.name.value,
      company: fields.company.value,
      email: fields.email.value,
      phone: fields.phone.value,
      service: fields.service.value,
      message: fields.message.value,
    };

    const loadingToast = toast.loading("Sending enquiry...");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to send your enquiry.");
      }

      setFields((prev) => {
        const reset: Record<string, typeof prev[keyof typeof prev]> = {};
        for (const k in prev) reset[k] = { value: k === "service" ? defaultService : "", touched: false, severity: "neutral", message: "" };
        return reset;
      });
      
      setStatus("success");
      toast.success("Thank you. Your enquiry has been received.", { id: loadingToast });
    } catch (error) {
      setStatus("error");
      logError("ContactForm submit", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
        { id: loadingToast }
      );
    } finally {
      isSubmittingRef.current = false;
    }
  }

  const disabled = status === "submitting";

  function getInputClass(severity: Severity) {
    if (severity === "neutral" || severity === "info") return "";
    return `input-${severity}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <fieldset disabled={disabled} style={{ all: "unset", display: "contents" }}>
        
        <div className="form-row">
          <label>
            <span className="label-text">Your name <span className="required-asterisk">*</span></span>
            <input 
              name="name" 
              type="text" 
              autoComplete="name"
              maxLength={80} 
              placeholder="Enter your name" 
              value={fields.name.value}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              onKeyDown={handleKeyDown}
              className={`form-input ${getInputClass(fields.name.severity)}`}
              aria-invalid={fields.name.severity === "error"}
              aria-describedby={fields.name.message ? "name-feedback" : undefined}
            />
            {fields.name.message && fields.name.touched && (
              <span id="name-feedback" className={`field-feedback ${fields.name.severity}`} role="alert">{fields.name.message}</span>
            )}
          </label>
          
          <label>
            <span className="label-text">Company</span>
            <input 
              name="company" 
              type="text" 
              autoComplete="organization" 
              maxLength={100} 
              placeholder="Company name"
              value={fields.company.value}
              onChange={(e) => handleChange("company", e.target.value)}
              onBlur={() => handleBlur("company")}
              onKeyDown={handleKeyDown}
              className={`form-input ${getInputClass(fields.company.severity)}`}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span className="label-text">Email address <span className="required-asterisk">*</span></span>
            <input 
              name="email" 
              type="email" 
              autoComplete="email"
              maxLength={120} 
              placeholder="you@company.com" 
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
            <span className="label-text">Phone number <span className="required-asterisk">*</span></span>
            <input 
              name="phone" 
              type="tel" 
              autoComplete="tel"
              inputMode="numeric"
              maxLength={20} 
              placeholder="+91" 
              value={fields.phone.value}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              onKeyDown={handleKeyDown}
              className={`form-input ${getInputClass(fields.phone.severity)}`}
              aria-invalid={fields.phone.severity === "error"}
              aria-describedby={fields.phone.message ? "phone-feedback" : undefined}
            />
            {fields.phone.message && fields.phone.touched && (
              <span id="phone-feedback" className={`field-feedback ${fields.phone.severity}`} role="alert">{fields.phone.message}</span>
            )}
          </label>
        </div>

        <label>
          <span className="label-text">Service you are interested in <span className="required-asterisk">*</span></span>
          <select 
            name="service" 
            value={fields.service.value}
            onChange={(e) => handleChange("service", e.target.value)}
            onBlur={() => handleBlur("service")}
            onKeyDown={handleKeyDown}
            className={`form-input ${getInputClass(fields.service.severity)}`}
            aria-invalid={fields.service.severity === "error"}
            aria-describedby={fields.service.message ? "service-feedback" : undefined}
          >
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option value={service} key={service}>{service}</option>)}
          </select>
          {fields.service.message && fields.service.touched && (
            <span id="service-feedback" className={`field-feedback ${fields.service.severity}`} role="alert">{fields.service.message}</span>
          )}
        </label>

        <label>
          <span className="label-text">Tell us about your project <span className="required-asterisk">*</span></span>
          <textarea 
            name="message" 
            maxLength={2000} 
            rows={5} 
            placeholder="Describe your goals." 
            value={fields.message.value}
            onChange={(e) => handleChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            onKeyDown={handleKeyDown}
            className={`form-input ${getInputClass(fields.message.severity)}`}
            aria-invalid={fields.message.severity === "error"}
            aria-describedby={fields.message.touched ? "message-feedback" : undefined}
          />
          {fields.message.touched && (
            <span id="message-feedback" className={`field-feedback ${fields.message.severity}`} role="alert">
              {fields.message.message || "Describe your goals."}
            </span>
          )}
        </label>

        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
        
        <label className="consent">
          <input name="consent" type="checkbox" value="accepted" required />
          <span>I agree to be contacted about this enquiry.</span>
        </label>
        
        <button className="button form-submit" type="submit" disabled={disabled}>
          {disabled ? "Sending..." : "Send enquiry"}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
    </form>
  );
}
