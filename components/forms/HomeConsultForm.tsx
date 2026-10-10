"use client";

import type { FormEvent } from "react";
import { homeConsultTypes } from "@/lib/content/home";
import { isValidName, isValidPhone, leadMessages } from "@/lib/forms/validation";
import { FormStatus } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { useFormSubmission } from "./useFormSubmission";

/** Four-field consultation form in the homepage's closing section. */
export function HomeConsultForm() {
  const { state, submit, setInvalid } = useFormSubmission("/api/contact");
  const submitting = state.status === "submitting";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");

    if (!isValidName(name) || !isValidPhone(phone)) {
      setInvalid(leadMessages.contact);
      return;
    }

    const result = await submit({
      source: "home",
      name,
      phone,
      type: String(data.get("type") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    if (result.status === "success") form.reset();
  };

  return (
    <form id="consultForm" noValidate onSubmit={onSubmit} aria-label="درخواست مشاوره رایگان">
      <Honeypot />
      <input name="name" placeholder="نام و نام خانوادگی" aria-label="نام و نام خانوادگی" autoComplete="name" required />
      <input
        name="phone"
        inputMode="tel"
        placeholder="شماره تماس"
        aria-label="شماره تماس"
        autoComplete="tel"
        required
      />
      <select name="type" aria-label="نوع پروژه" defaultValue="">
        <option value="">نوع پروژه</option>
        {homeConsultTypes.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      <textarea name="message" placeholder="توضیحات پروژه" aria-label="توضیحات پروژه" />
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "در حال ارسال..." : "ارسال درخواست ←"}
      </button>
      <FormStatus state={state} persistent />
    </form>
  );
}
