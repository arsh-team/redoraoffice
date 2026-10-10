/**
 * Spam trap: a field real visitors never see or reach. Submissions that fill
 * it are accepted and dropped by the API.
 *
 * The input sits in a clipped 1px wrapper rather than far off-screen: in a
 * right-to-left page an element parked at `left: -9999px` widens the document.
 */
export function Honeypot() {
  return (
    <div className="srOnly" aria-hidden="true">
      <input type="text" name="website" defaultValue="" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
