"use client";

import { useCallback, useState } from "react";

export type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  /** `invalid` is a problem the visitor can fix; the others mean nothing was delivered. */
  | { status: "invalid"; message: string }
  | { status: "unavailable" }
  | { status: "rate_limited" }
  | { status: "failed" };

interface ApiResponse {
  ok?: boolean;
  code?: string;
  message?: string;
}

/**
 * Posts a form to one of the API route handlers and tracks the outcome.
 * Success is reported only when the server confirms the request was delivered.
 */
export function useFormSubmission(endpoint: string) {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  const submit = useCallback(
    async (payload: Record<string, unknown>): Promise<SubmissionState> => {
      setState({ status: "submitting" });
      let next: SubmissionState;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = (await response.json().catch(() => ({}))) as ApiResponse;
        if (response.ok && body.ok) next = { status: "success" };
        else if (body.code === "validation") {
          next = { status: "invalid", message: body.message ?? "لطفاً فیلدهای ضروری را کامل کنید." };
        } else if (body.code === "not_configured") next = { status: "unavailable" };
        else if (body.code === "rate_limited") next = { status: "rate_limited" };
        else next = { status: "failed" };
      } catch {
        next = { status: "failed" };
      }
      setState(next);
      return next;
    },
    [endpoint],
  );

  const setInvalid = useCallback((message: string) => setState({ status: "invalid", message }), []);
  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, setInvalid, reset };
}
