import { useState, useCallback, KeyboardEvent } from "react";

export type Severity = "neutral" | "info" | "warning" | "error" | "success";

export interface FieldState {
  value: string;
  touched: boolean;
  severity: Severity;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  severity: Severity;
  message: string;
  value?: string; // Optional auto-corrected value
}

export type Validator = (value: string) => ValidationResult;

export function useProgressiveValidation(initialValues: Record<string, string>, validators: Record<string, Validator>) {
  const [fields, setFields] = useState<Record<string, FieldState>>(() => {
    const state: Record<string, FieldState> = {};
    for (const key in initialValues) {
      state[key] = { value: initialValues[key], touched: false, severity: "neutral", message: "" };
    }
    return state;
  });



  const handleChange = useCallback((name: string, value: string) => {
    setFields((prev) => {
      const field = prev[name];
      if (!field) return prev;

      // Only revalidate immediately if it has been touched
      if (field.touched) {
        const result = validators[name] ? validators[name](value) : { isValid: true, severity: "neutral" as Severity, message: "" };
        return {
          ...prev,
          [name]: {
            ...field,
            value,
            severity: result.severity,
            message: result.message,
          }
        };
      }

      // Otherwise just update value
      return {
        ...prev,
        [name]: {
          ...field,
          value,
        }
      };
    });
  }, [validators]);

  const handleBlur = useCallback((name: string) => {
    setFields((prev) => {
      const field = prev[name];
      if (!field) return prev;
      
      // Sanitization step happens here for some fields in the validator returning a new `value`.
      const result = validators[name] ? validators[name](field.value) : null;
      
      return {
        ...prev,
        [name]: {
          ...field,
          touched: true,
          value: result && result.value !== undefined ? result.value : field.value,
          severity: result ? result.severity : "neutral",
          message: result ? result.message : "",
        }
      };
    });
  }, [validators]);

  const validateAll = useCallback(() => {
    let allValid = true;
    let firstInvalidField = "";
    const newState = { ...fields };

    for (const name in validators) {
      const field = newState[name];
      const result = validators[name](field.value);
      
      newState[name] = {
        ...field,
        touched: true,
        value: result.value !== undefined ? result.value : field.value,
        severity: result.severity,
        message: result.message,
      };

      if (result.severity === "error") {
        allValid = false;
        if (!firstInvalidField) firstInvalidField = name;
      }
    }

    setFields(newState);
    return { isValid: allValid, firstInvalidField };
  }, [fields, validators]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.key === "Enter" && e.currentTarget.tagName !== "TEXTAREA") {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      if (!form) return;
      
      const elements = Array.from(form.elements) as HTMLElement[];
      const index = elements.indexOf(e.currentTarget);
      
      // Find next focusable
      for (let i = index + 1; i < elements.length; i++) {
        const next = elements[i];
        if (
          !next.hasAttribute("disabled") &&
          next.getAttribute("type") !== "hidden" &&
          next.tabIndex >= 0 &&
          (next.tagName === "INPUT" || next.tagName === "SELECT" || next.tagName === "TEXTAREA" || next.tagName === "BUTTON")
        ) {
          next.focus();
          break;
        }
      }
    }
  }, []);

  return { fields, handleChange, handleBlur, validateAll, handleKeyDown, setFields };
}
