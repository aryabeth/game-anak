/**
 * Encouraging feedback. Success and hint states differ by icon and wording,
 * not only by color.
 */
export function FeedbackMessage({ tone, children }: { tone: "success" | "hint"; children: React.ReactNode }) {
  const success = tone === "success";
  return (
    <div
      role="status"
      className={`animate-fade-up flex items-center gap-3 rounded-3xl border-2 px-4 py-3 text-lg font-bold ${
        success ? "border-sage-dark/30 bg-sage text-sage-dark" : "border-terracotta/50 bg-yellow text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${
          success ? "bg-sage-dark text-cream" : "bg-surface text-terracotta-dark"
        }`}
      >
        {success ? "✓" : "↻"}
      </span>
      <span>{children}</span>
    </div>
  );
}
