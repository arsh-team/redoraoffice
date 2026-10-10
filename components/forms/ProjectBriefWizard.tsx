"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Photo } from "@/components/ui/Photo";
import {
  briefBudgets,
  briefProjectTypes,
  briefSpaceStatuses,
  briefStyles,
  briefTimelines,
} from "@/lib/content/contact";
import { isValidEmail, isValidPhone, leadMessages } from "@/lib/forms/validation";
import { DirectContact, submissionCopy } from "./FormStatus";
import { Honeypot } from "./Honeypot";
import { useFormSubmission } from "./useFormSubmission";

const STEP_COUNT = 6;

/**
 * Six-step project brief. All steps stay mounted (inactive ones are hidden by
 * the stylesheet) so answers persist while moving back and forth, and each
 * step is validated before the visitor can continue.
 */
export function ProjectBriefWizard() {
  const form = useRef<HTMLFormElement>(null);
  const [current, setCurrent] = useState(0);
  const [area, setArea] = useState("35");
  const [error, setError] = useState("");
  const { state, submit, reset } = useFormSubmission("/api/contact");

  const submitting = state.status === "submitting";
  const finished = state.status === "success";
  const undelivered =
    state.status === "unavailable" || state.status === "failed" || state.status === "rate_limited";
  const isLast = current === STEP_COUNT - 1;

  /** Mirrors the reference: every [required] control in the active step must be answered. */
  const validateStep = (): boolean => {
    setError("");
    const step = form.current?.querySelector<HTMLElement>(`[data-step="${current + 1}"]`);
    if (!step) return false;
    const required = step.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "[required]",
    );
    for (const control of required) {
      if (control instanceof HTMLInputElement && control.type === "radio") {
        if (!step.querySelector(`[name="${control.name}"]:checked`)) {
          setError(leadMessages.choice);
          control.focus();
          return false;
        }
      } else if (!control.value.trim()) {
        setError(leadMessages.required);
        control.focus();
        return false;
      }
    }
    const phone = step.querySelector<HTMLInputElement>('[name="phone"]');
    if (phone && !isValidPhone(phone.value)) {
      setError(leadMessages.contact);
      phone.focus();
      return false;
    }
    const email = step.querySelector<HTMLInputElement>('[name="email"]');
    if (email && email.value.trim() && !isValidEmail(email.value)) {
      setError(leadMessages.email);
      email.focus();
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep() || isLast) return;
    setCurrent((step) => step + 1);
    form.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const goBack = () => {
    setError("");
    setCurrent((step) => Math.max(0, step - 1));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Enter inside a text field submits the form; treat it as "continue" until the last step.
    if (!isLast) {
      goNext();
      return;
    }
    if (!validateStep()) return;

    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    const result = await submit({
      source: "project-brief",
      type: field("type"),
      style: field("style"),
      area: field("area"),
      city: field("city"),
      spaceStatus: field("space_status"),
      budget: field("budget"),
      timeline: field("timeline"),
      message: field("message"),
      name: field("name"),
      phone: field("phone"),
      email: field("email"),
      website: field("website"),
    });
    if (result.status === "invalid") setError(result.message);
  };

  const panelOpen = finished || undelivered;
  // While the result panel is showing no step is active, so the stylesheet hides them all.
  const stepClass = (index: number) =>
    index === current && !panelOpen ? "wizardStep active" : "wizardStep";

  return (
    <div className="projectWizard">
      <div className="wizardTop">
        <div>
          <small>پیشرفت فرم</small>
          <strong id="stepLabel" aria-live="polite">
            مرحله {current + 1} از {STEP_COUNT}
          </strong>
        </div>
        <div
          className="progressTrack"
          role="progressbar"
          aria-labelledby="stepLabel"
          aria-valuemin={1}
          aria-valuemax={STEP_COUNT}
          aria-valuenow={current + 1}
        >
          <i id="progressBar" style={{ width: `${((current + 1) / STEP_COUNT) * 100}%` }} />
        </div>
      </div>

      <form id="redoraProjectForm" ref={form} noValidate onSubmit={onSubmit}>
        <Honeypot />

        <>
          <div className={stepClass(0)} data-step="1">
            <span className="stepNo">01</span>
            <h3 id="brief-step-1">چه نوع پروژه‌ای دارید؟</h3>
            <p>گزینه‌ای را انتخاب کنید که به پروژه شما نزدیک‌تر است.</p>
            <div className="choiceGrid" role="radiogroup" aria-labelledby="brief-step-1">
              {briefProjectTypes.map((option, index) => (
                <label key={option.value} className="choiceCard">
                  <input type="radio" name="type" value={option.value} required={index === 0} />
                  <b>{option.value}</b>
                  <span>{option.hint}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={stepClass(1)} data-step="2">
            <span className="stepNo">02</span>
            <h3 id="brief-step-2">به کدام حال‌وهوا نزدیک‌ترید؟</h3>
            <p>این انتخاب فقط برای شناخت سلیقه اولیه شماست.</p>
            <div className="styleChoices" role="radiogroup" aria-labelledby="brief-step-2">
              {briefStyles.map((option, index) => (
                <label key={option.value}>
                  <input type="radio" name="style" value={option.value} required={index === 0} />
                  <Photo image={option.image} sizes="(max-width: 600px) 100vw, 220px" />
                  <b>{option.value}</b>
                </label>
              ))}
            </div>
          </div>

          <div className={stepClass(2)} data-step="3">
            <span className="stepNo">03</span>
            <h3 id="brief-step-3">ابعاد تقریبی فضا چقدر است؟</h3>
            <div className="rangeBox">
              <input
                id="areaRange"
                name="area"
                type="range"
                min={10}
                max={100}
                value={area}
                aria-labelledby="brief-step-3"
                aria-valuetext={`${area} متر مربع`}
                onChange={(event) => setArea(event.target.value)}
              />
              <strong>
                <span id="areaValue">{area}</span> متر مربع
              </strong>
            </div>
            <div className="fieldRow">
              <label>
                شهر پروژه
                <input name="city" defaultValue="" autoComplete="address-level2" placeholder="مثلاً تهران" />
              </label>
              <label>
                وضعیت فضا
                <select name="space_status">
                  {briefSpaceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className={stepClass(3)} data-step="4">
            <span className="stepNo">04</span>
            <h3 id="brief-step-4">بازه بودجه و زمان موردنظر؟</h3>
            <div className="choiceGrid compact" role="radiogroup" aria-labelledby="brief-step-4">
              {briefBudgets.map((option, index) => (
                <label key={option.value} className="choiceCard">
                  <input type="radio" name="budget" value={option.value} required={index === 0} />
                  <b>{option.value}</b>
                  <span>{option.hint}</span>
                </label>
              ))}
            </div>
            <label className="fullField">
              زمان تقریبی شروع
              <select name="timeline">
                {briefTimelines.map((timeline) => (
                  <option key={timeline}>{timeline}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={stepClass(4)} data-step="5">
            <span className="stepNo">05</span>
            <h3>کمی درباره پروژه بگویید.</h3>
            <label className="fullField">
              توضیحات پروژه
              <textarea
                name="message"
                rows={6}
                placeholder="نیازها، محدودیت‌ها، تعداد اعضای خانواده یا هر نکته‌ای که برای طراحی مهم است..."
              />
            </label>
          </div>

          <div className={stepClass(5)} data-step="6">
            <span className="stepNo">06</span>
            <h3>راه ارتباطی شما</h3>
            <div className="fieldRow">
              <label>
                نام و نام خانوادگی
                <input name="name" defaultValue="" required autoComplete="name" placeholder="نام شما" />
              </label>
              <label>
                شماره تماس
                <input
                  name="phone"
                  defaultValue=""
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09xx xxx xxxx"
                />
              </label>
            </div>
            <label className="fullField">
              ایمیل (اختیاری)
              <input type="email" name="email" defaultValue="" autoComplete="email" placeholder="name@example.com" />
            </label>
            <div className="finalNote">
              با ارسال فرم، تیم Redora برای هماهنگی جلسه اولیه با شما تماس می‌گیرد.
            </div>
          </div>

          <div className="wizardActions" style={panelOpen ? { display: "none" } : undefined}>
            <button className="ghostBtn" id="prevStep" type="button" disabled={current === 0} onClick={goBack}>
              مرحله قبل
            </button>
            <span className="formError" id="formError" role="alert">
              {error}
            </span>
            {/*
              One primary action per step. (On the reference a later `.btn` rule
              overrides the script's display toggle, so "continue" and "send"
              are both visible on every step; see docs/reference-audit.md.)
            */}
            {isLast ? (
              <button
                className="btn submitBtn"
                id="submitProject"
                type="submit"
                style={{ display: "inline-flex" }}
                disabled={submitting}
              >
                {submitting ? "در حال ارسال..." : "ارسال درخواست ←"}
              </button>
            ) : (
              <button className="btn" id="nextStep" type="button" onClick={goNext}>
                ادامه ←
              </button>
            )}
          </div>
        </>

        <div
          className={`successPanel${panelOpen ? " show" : ""}${undelivered ? " failure" : ""}`}
          id="successPanel"
          role={undelivered ? "alert" : "status"}
        >
          {finished ? (
            <>
              <b>درخواست شما با موفقیت ثبت شد.</b>
              <p>تیم Redora برای هماهنگی جلسه اولیه با شما تماس می‌گیرد.</p>
              <Link href="/">بازگشت به صفحه اصلی ←</Link>
            </>
          ) : null}
          {undelivered ? (
            <>
              <b>درخواست شما ارسال نشد.</b>
              <p>
                {state.status === "rate_limited" ? (
                  submissionCopy.rateLimited
                ) : (
                  <>
                    {state.status === "unavailable" ? submissionCopy.unavailable : submissionCopy.failed}
                    <DirectContact />
                  </>
                )}
              </p>
              <div className="panelActions">
                <button className="linkButton" type="button" onClick={reset}>
                  → بازگشت به فرم
                </button>
              </div>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
}
