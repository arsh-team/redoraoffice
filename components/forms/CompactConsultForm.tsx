"use client";

import type { FormEvent } from "react";
import { isValidName, isValidPhone, leadMessages } from "@/lib/forms/validation";
import { FormStatus } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { useFormSubmission } from "./useFormSubmission";

/** Name / phone / project-type form used in the dark "start a project" band. */
export function CompactConsultForm({ projectTypes }: { projectTypes: readonly string[] }) {
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
      source: "compact",
      name,
      phone,
      type: String(data.get("type") ?? ""),
      website: String(data.get("website") ?? ""),
    });
    if (result.status === "success") form.reset();
  };

  return (
    <form onSubmit={onSubmit} aria-label="درخواست مشاوره">
      <Honeypot />
      <input name="name" required autoComplete="name" placeholder="نام و نام خانوادگی" aria-label="نام و نام خانوادگی" />
      <input
        name="phone"
        required
        inputMode="tel"
        autoComplete="tel"
        placeholder="شماره تماس"
        aria-label="شماره تماس"
      />
      <select name="type" required aria-label="نوع پروژه" defaultValue="">
        <option value="">نوع پروژه</option>
        {projectTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "در حال ارسال..." : "ارسال درخواست ←"}
      </button>
      <FormStatus state={state} />
    </form>
  );
}
