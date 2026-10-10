"use client";

import type { FormEvent } from "react";
import { isValidEmail, leadMessages } from "@/lib/forms/validation";
import { FormStatus, submissionCopy } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { useFormSubmission } from "./useFormSubmission";

/**
 * Newsletter sign-up. On the reference this is an inert `type="button"`;
 * here it validates the address and posts it to /api/newsletter.
 */
export function NewsletterForm() {
  const { state, submit, setInvalid } = useFormSubmission("/api/newsletter");
  const submitting = state.status === "submitting";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");

    if (!isValidEmail(email)) {
      setInvalid(leadMessages.email);
      return;
    }

    const result = await submit({ email, website: String(data.get("website") ?? "") });
    if (result.status === "success") form.reset();
  };

  return (
    <div>
      <form noValidate onSubmit={onSubmit} aria-label="عضویت در خبرنامه">
        <Honeypot />
        <input type="email" name="email" placeholder="ایمیل شما" aria-label="ایمیل شما" autoComplete="email" required />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "در حال ارسال..." : "عضویت در خبرنامه ←"}
        </button>
      </form>
      <FormStatus state={state} successMessage={submissionCopy.newsletterSuccess} />
    </div>
  );
}
