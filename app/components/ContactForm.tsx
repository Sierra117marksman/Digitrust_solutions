"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  services,
  defaultService = "",
}: {
  services: string[];
  defaultService?: string;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

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

      form.reset();
      setStatus("success");
      setMessage("Thank you. Your enquiry has been received.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Your name <span>*</span>
          <input name="name" type="text" autoComplete="name" required maxLength={80} placeholder="Enter your name" />
        </label>
        <label>
          Company
          <input name="company" type="text" autoComplete="organization" maxLength={100} placeholder="Company name" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email address <span>*</span>
          <input name="email" type="email" autoComplete="email" required maxLength={120} placeholder="you@company.com" />
        </label>
        <label>
          Phone number <span>*</span>
          <input name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder="+91" />
        </label>
      </div>
      <label>
        Service you are interested in <span>*</span>
        <select name="service" defaultValue={defaultService} required>
          <option value="" disabled>Select a service</option>
          {services.map((service) => <option value={service} key={service}>{service}</option>)}
        </select>
      </label>
      <label>
        Tell us about your project <span>*</span>
        <textarea name="message" required maxLength={2000} rows={5} placeholder="What would you like to achieve?" />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" value="accepted" required />
        <span>I agree to be contacted about this enquiry.</span>
      </label>
      <button className="button form-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send enquiry"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className={`form-message ${status}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
