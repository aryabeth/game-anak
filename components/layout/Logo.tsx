/** Little Learners mark: a sprout growing from a soil arc. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="23" fill="#dde7d5" />
      <path d="M10 34c8-4 20-4 28 0" fill="none" stroke="#9c4f33" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 33V20" stroke="#405641" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 22c-2-6-8-8-12-7 0 5 5 9 12 7z" fill="#8fb487" stroke="#405641" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 19c2-6 8-8 12-7 0 5-5 9-12 7z" fill="#8fb487" stroke="#405641" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark className={big ? "h-16 w-16" : "h-10 w-10"} />
      <span className="flex flex-col leading-tight">
        <span className={`font-extrabold text-sage-dark ${big ? "text-4xl sm:text-5xl" : "text-xl"}`}>
          Little Learners
        </span>
        {big && <span className="text-lg font-semibold text-muted">Explore · Learn · Grow</span>}
      </span>
    </span>
  );
}
