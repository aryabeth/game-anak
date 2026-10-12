import { ColorSwatch, Illustration } from "@/components/illustrations/Illustration";
import type { Visual } from "@/types/learning";

// Groups are laid out in rows of at most five, like a ten-frame.
const GROUP_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

/** Renders a prompt or choice visual (text, picture, color, or object group). */
export function VisualView({
  visual,
  size = "md",
  label,
}: {
  visual: Visual;
  size?: "md" | "lg";
  /** Accessible name for pictures; "" when the surrounding control is already labelled. */
  label?: string;
}) {
  const big = size === "lg";
  switch (visual.kind) {
    case "text":
      return (
        <span
          className={`block font-extrabold tracking-wide text-ink ${
            visual.text.length > 6
              ? big
                ? "text-3xl sm:text-4xl"
                : "text-2xl"
              : big
                ? "text-7xl sm:text-8xl"
                : "text-5xl sm:text-6xl"
          }`}
        >
          {visual.text}
        </span>
      );
    case "picture":
      return (
        <span className="flex flex-col items-center gap-1">
          <Illustration id={visual.illustration} label={label} className={big ? "h-36 w-36 sm:h-44 sm:w-44" : "h-24 w-24 sm:h-28 sm:w-28"} />
          {visual.caption && (
            <span className={`font-extrabold tracking-wider text-ink ${big ? "text-3xl" : "text-xl"}`}>{visual.caption}</span>
          )}
        </span>
      );
    case "color":
      return (
        <span className="flex flex-col items-center gap-1">
          <ColorSwatch color={visual.color} label={label} className={big ? "h-36 w-36" : "h-24 w-24 sm:h-28 sm:w-28"} />
          {visual.caption && <span className="text-xl font-extrabold">{visual.caption}</span>}
        </span>
      );
    case "group":
      return (
        <span
          className={`grid gap-2 sm:gap-3 ${GROUP_COLS[Math.min(visual.count, 5)]}`}
          role="img"
          aria-label={label ?? `${visual.count} benda`}
        >
          {Array.from({ length: visual.count }, (_, i) => (
            <Illustration key={i} id={visual.illustration} label="" className="h-14 w-14 sm:h-20 sm:w-20" />
          ))}
        </span>
      );
  }
}
