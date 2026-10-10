import { site } from "@/lib/content/site";
import type { SubmissionState } from "./useFormSubmission";

export const submissionCopy = {
  success: "درخواست شما با موفقیت ثبت شد. تیم Redora برای هماهنگی جلسه اولیه با شما تماس می‌گیرد.",
  newsletterSuccess: "عضویت شما در خبرنامه ثبت شد.",
  rateLimited: "تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
  failed: "ارسال انجام نشد. لطفاً دوباره تلاش کنید یا مستقیم با ما تماس بگیرید:",
  unavailable: "ثبت آنلاین در حال حاضر در دسترس نیست و پیام شما ارسال نشد. لطفاً مستقیم با ما تماس بگیرید:",
} as const;

/** Phone and e-mail links offered whenever a submission could not be delivered. */
export function DirectContact() {
  return (
    <>
      {" "}
      <a href={site.phoneHref} dir="ltr">
        {site.phone}
      </a>
      {" · "}
      <a href={site.emailHref} dir="ltr">
        {site.email}
      </a>
    </>
  );
}

interface FormStatusProps {
  state: SubmissionState;
  successMessage?: string;
  /** Keep the (empty) element in the DOM while idle, as the reference homepage form does. */
  persistent?: boolean;
}

/**
 * Live status line for a form. Errors are announced assertively and are
 * identified by text, not by colour alone.
 */
export function FormStatus({ state, successMessage = submissionCopy.success, persistent }: FormStatusProps) {
  const idle = state.status === "idle" || state.status === "submitting";
  if (idle && !persistent) return null;

  const isError = !idle && state.status !== "success";
  const className = idle ? "formStatus" : `formStatus ${isError ? "error" : "ok"}`;

  return (
    <p className={className} role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"}>
      {state.status === "success" ? successMessage : null}
      {state.status === "invalid" ? state.message : null}
      {state.status === "rate_limited" ? submissionCopy.rateLimited : null}
      {state.status === "failed" ? (
        <>
          {submissionCopy.failed}
          <DirectContact />
        </>
      ) : null}
      {state.status === "unavailable" ? (
        <>
          {submissionCopy.unavailable}
          <DirectContact />
        </>
      ) : null}
    </p>
  );
}
